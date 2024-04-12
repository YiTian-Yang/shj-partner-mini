import { Injectable } from '@nestjs/common';
import {
  ChangeStatusDto,
  CreateOrderDto,
  GetOrderByPageDto,
} from './dto/order.dto';
import Order from 'src/entities/base/order/order.entity';
import PaymentInfo from 'src/entities/base/order/Payment-info.entity';
import ProductInfo from 'src/entities/base/order/product-info.entity';
import PickupInfo from 'src/entities/base/order/pickup-info.entity';
import ShjGoodModelEntity from 'src/entities/base/good/shj-good-model.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OrderStatus,
  OrderChannel,
  PaymentStatus,
  PaymentType,
  OrderChannelImplication,
  ExpressStatus,
  OrderType,
} from 'src/entities/base/order/enum';
import ShjMiniProgramList from 'src/entities/partner/user/shj-mini-program-list.entity';
import { JwtService } from '@nestjs/jwt';
import { UtilService } from 'src/shared/services/util.service';
import { RedisService } from 'src/shared/services/redis.service';
import { SfOrderService } from 'src/shared/services/sf-order.service';
import * as dayjs from 'dayjs';
import { ApiException } from 'src/common/exceptions/api.exception';
import { AlipayOrderService } from 'src/shared/services/alipay.service';
import { LoggerService } from 'src/shared/logger/logger.service';
import { SmsService } from 'src/shared/services/sms.service';
import ShjGoodBrandEntity from 'src/entities/base/good/shj-good-brand.entity';
import ShjGoodTypeEntity from 'src/entities/base/good/shj-good-type.entity';
import { multiply, subtract } from 'mathjs';
import { PartnerService } from '../partner/partner.service';
import axios from 'axios';
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order, 'base')
    private readonly OrderRep: Repository<Order>,
    @InjectRepository(ShjMiniProgramList, 'partner')
    private readonly miniProgramList: Repository<ShjMiniProgramList>,
    @InjectRepository(PaymentInfo, 'base')
    private readonly PaymentRep: Repository<PaymentInfo>,
    @InjectRepository(ProductInfo, 'base')
    private readonly productRep: Repository<ProductInfo>,
    @InjectRepository(PickupInfo, 'base')
    private readonly pickupRep: Repository<PickupInfo>,
    @InjectRepository(ShjGoodModelEntity, 'base')
    private readonly goodModel: Repository<ShjGoodModelEntity>,
    @InjectRepository(ShjGoodTypeEntity, 'base')
    private readonly goodType: Repository<ShjGoodTypeEntity>,
    @InjectRepository(ShjGoodBrandEntity, 'base')
    private readonly goodBrand: Repository<ShjGoodBrandEntity>,
    private jwtService: JwtService,
    private smsService: SmsService,
    private utils: UtilService,
    private sfService: SfOrderService,
    private redisService: RedisService,
    private alipayOrderService: AlipayOrderService,
    private logger: LoggerService,
    private partnerService: PartnerService,
  ) {}
  async create(createOrderDto: CreateOrderDto, headers) {
    const token = await this.jwtService.verify(headers.token);
    const orderDate = dayjs(+new Date()).format('YYMMDDHH');
    const completeId =
      'SHJ' +
      orderDate +
      (await this.utils.generateRandomValue(8, '1234567890'));
    const valuationData = await this.redisService
      .getRedis()
      .get(`calculatePrice:userUid:${token.uid}`);
    if (!valuationData) {
      throw new ApiException(11004);
    }
    const time =
      createOrderDto.pickupInfo.pickupTime.split(' ')[0] +
      createOrderDto.pickupInfo.pickupTime.split(' ')[1].split('-')[1];
    const completeAddress = Object.values(
      createOrderDto.pickupInfo.pickupAddress,
    ).join(' ');
    const SfOrderData = await this.sfService.createSfOrder({
      ...createOrderDto.pickupInfo,
      ...JSON.parse(valuationData),
      pickupAddress: completeAddress,
      pickupTm: time,
      valuationPrice: JSON.parse(valuationData).recoveryPrice,
      orderId: completeId,
    });

    // if (SfOrderData.success !== true || SfOrderData.errorCode !== 'S0000') {
    //   throw new ApiException(10002);
    // }
    // enum orderChannelEnum {
    //   weixin = 'C_Weixin',
    //   alipay = 'C_Alipay',
    //   tiktok = 'C_Tiktok',
    // }
    // const originChannel: string = orderChannelEnum[headers.channel];
    const partnerInfo = await this.partnerService.getPartnerInfo(
      headers['partner-key'],
    );
    const order = await this.OrderRep.create({
      orderId: completeId,
      orderTime: dayjs(new Date()) + '',
      orderType: OrderType.Recycle,
      orderStatus: OrderStatus.PendingPickup,
      orderChannel: OrderChannel.C_Partner,
      userId: token.uid,
      thirdChannelId: partnerInfo.id,
    });

    const payment = await this.PaymentRep.create({
      paymentStatus: PaymentStatus.UnPay,
      realName: createOrderDto.paymentInfo.realName,
      receiveAccount: createOrderDto.paymentInfo.receiveAccount,
      order: order,
    });
    const pickup = this.pickupRep.create({
      contactPerson: createOrderDto.pickupInfo.contactPerson,
      contactPhone: createOrderDto.pickupInfo.contactPhone,
      pickupAddress: JSON.stringify({
        ...createOrderDto.pickupInfo.pickupAddress,
      }),
      pickupTime: createOrderDto.pickupInfo.pickupTime,
      waybillId: SfOrderData?.msgData?.waybillNoInfoList[0]?.waybillNo || null,
      parcelId: createOrderDto.pickupInfo.parcelId || '',
      sfId: SfOrderData?.msgData?.orderId || -1,
      expressStatus: SfOrderData?.msgData?.orderId
        ? ExpressStatus.Success
        : ExpressStatus.fail,
      expressOrderRes: SfOrderData?.msgData?.orderId
        ? null
        : JSON.stringify(SfOrderData),
      order: order,
    });

    const modelData = await this.goodModel.findOne({
      where: {
        id: +createOrderDto.productInfo.modelId,
      },
      select: ['brandId', 'typeId'],
    });

    const product = this.productRep.create({
      categoryId: modelData.typeId,
      brandId: modelData.brandId,
      modelId: +createOrderDto.productInfo.modelId,
      valuationPrice: JSON.parse(valuationData).recoveryPrice,
      valuationDetails: valuationData,
      order: order,
    });
    order.paymentInfo = payment;
    order.pickupInfo = pickup;
    order.productInfo = product;
    const orderRes = await this.OrderRep.save(order);
    try {
      const brandInfo = await this.goodBrand.findOne({
        where: {
          id: modelData.brandId,
        },
      });
      await this.smsService.sendSms(
        pickup.contactPhone,
        '18df14b8d1e847f2a7bca5ba4946d5c4',
        [order.orderId],
      );
      await this.smsService.sendSms(
        '17143250000',
        '70ffd27e0fe84fd4b5cd90110efa782c',
        [
          OrderChannelImplication[order.orderChannel],
          modelData.typeId == 1 ? '手机' : '平板',
          brandInfo && brandInfo.id ? brandInfo.brandName : '暂无品牌',
          JSON.parse(valuationData).modelName,
          JSON.parse(valuationData).recoveryPrice,
        ],
      );
      await this.redisService
        .getRedis()
        .del(`calculatePrice:userUid:${token.uid}`);
    } catch (error) {}
    return orderRes;
  }

  async getOrdersBypage(params: GetOrderByPageDto, headers) {
    const token = await this.jwtService.verify(headers.token);
    const where = params.orderStatus
      ? { orderStatus: +params.orderStatus, userId: token.uid }
      : { userId: token.uid };
    const [orders, count] = await this.OrderRep.findAndCount({
      relations: ['productInfo'],
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      order: {
        createdAt: 'DESC',
      },
    });
    for (const item of orders) {
      item.productInfo.valuationDetails = JSON.parse(
        item.productInfo.valuationDetails,
      );
    }
    return {
      list: orders,
      count,
    };
  }

  async cancelOrder(params: ChangeStatusDto) {
    try {
      return await this.OrderRep.manager.transaction(
        async (orderTransaction) => {
          const orderInfo = await orderTransaction.findOne(Order, {
            where: {
              orderId: params.orderId,
            },
            lock: { mode: 'pessimistic_write' },
            relations: ['pickupInfo', 'productInfo'],
          });
          if (orderInfo.orderStatus !== OrderStatus.PendingPickup) {
            throw new ApiException(10007);
          }
          // 先取消顺丰订单
          const sfCancel = await this.sfService.cancelSfOrder({
            orderId: orderInfo.pickupInfo.sfId,
          });
          if (
            sfCancel.success == true ||
            sfCancel.errorCode == '8037' ||
            sfCancel.errorCode == '8253' ||
            sfCancel.errorCode == '8018'
          ) {
            orderInfo.orderStatus = OrderStatus.Cancelled;
            return await orderTransaction.save(Order, orderInfo);
          }
          throw new ApiException(10004);
        },
      );
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.errorCode);
    }
  }

  async agreePrice(params: ChangeStatusDto) {
    try {
      return await this.OrderRep.manager.transaction(
        async (orderTransaction) => {
          const orderInfo = await orderTransaction.findOne(Order, {
            where: {
              orderId: params.orderId,
            },
            lock: { mode: 'pessimistic_write' },
            relations: ['pickupInfo', 'productInfo', 'paymentInfo'],
          });
          if (orderInfo.orderStatus !== OrderStatus.WaitingConfirm) {
            throw new ApiException(10006);
          }
          orderInfo.orderStatus = OrderStatus.SuccessfulTransaction;
          try {
            const payRes: any =
              await this.alipayOrderService.singleTransferAccounts({
                time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                orderId: orderInfo.orderId,
                quotePrice: orderInfo.productInfo.quotePrice,
                moneyTitle: '速换机',
                realName: orderInfo.paymentInfo.realName,
                receiveAccount: orderInfo.paymentInfo.receiveAccount,
              });
            const time = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
            if (payRes.code === '10000') {
              orderInfo.paymentInfo.paymentStatus = PaymentStatus.PaySuccess;
              orderInfo.transactionSuccessTime = time;
              orderInfo.paymentInfo.paymentAmount =
                orderInfo.productInfo.quotePrice;
              orderInfo.paymentInfo.paymentType = PaymentType.AutoPay;
              orderInfo.paymentInfo.paymentTime = time;
              orderInfo.paymentInfo.payer = '系统';
              orderInfo.paymentInfo.serialNumber = payRes?.order_id;
              return await orderTransaction.save(Order, {
                ...orderInfo,
              });
            } else {
              this.logger.error(payRes);
              orderInfo.paymentInfo.paymentStatus = PaymentStatus.PayFail;
              orderInfo.paymentInfo.paymentType = PaymentType.AutoPay;
              orderInfo.transactionSuccessTime = time;
              return await orderTransaction.save(Order, {
                ...orderInfo,
              });
            }
          } catch (error) {
            orderInfo.paymentInfo.paymentStatus = PaymentStatus.PayFail;
            return await orderTransaction.save(Order, {
              ...orderInfo,
            });
          }
        },
      );
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.errorCode);
    }
  }

  async rejectPrice(params: ChangeStatusDto) {
    try {
      return await this.OrderRep.manager.transaction(
        async (orderTransaction) => {
          const orderInfo = await orderTransaction.findOne(Order, {
            where: {
              orderId: params.orderId,
            },
            lock: { mode: 'pessimistic_write' },
            relations: ['pickupInfo', 'productInfo', 'paymentInfo'],
          });
          if (orderInfo.orderStatus !== 3) {
            throw new ApiException(10006);
          }
          orderInfo.orderStatus = OrderStatus.Cancelled;
          return await orderTransaction.save(orderInfo);
        },
      );
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.errorCode);
    }
  }

  async getOrderInfo(params: ChangeStatusDto) {
    const data = await this.OrderRep.findOne({
      where: {
        orderId: params.orderId,
      },
      relations: ['paymentInfo', 'pickupInfo', 'productInfo'],
    });
    const routerData = await this.sfService.getSfRouters({
      searchType: 2,
      searchId: data.pickupInfo.sfId,
    });
    const orderData = JSON.parse(JSON.stringify(data));
    if (routerData.msgData.routeResps && routerData.msgData.routeResps[0]) {
      orderData.pickupInfo.routerInfo = routerData.msgData.routeResps[0].routes;
      if (
        orderData.pickupInfo.routerInfo.length &&
        orderData.pickupInfo.routerInfo[0].opCode == '50' &&
        orderData.orderStatus == OrderStatus.PendingPickup
      ) {
        orderData.orderStatus = OrderStatus.WaitingQuote;
        await this.OrderRep.update(
          { orderId: data.orderId },
          {
            orderStatus: OrderStatus.WaitingQuote,
          },
        );
        const productCode =
          'P' +
          dayjs(new Date()).format('YYMMDDHH') +
          this.utils.generateRandomValue(8, '1234567890');
      }
    }
    orderData.productInfo.valuationDetails = JSON.parse(
      orderData.productInfo.valuationDetails,
    );
    orderData.pickupInfo.pickupAddress = JSON.parse(
      orderData.pickupInfo.pickupAddress,
    );
    return orderData;
  }

  async changeOrderStatus(orderId: string, status: number) {
    // 取消平台订单
    const orderData = await this.OrderRep.findOne({
      where: {
        orderId: orderId,
      },
    });
    orderData.orderStatus = status;
    const res = await this.OrderRep.save(orderData);
    return res;
  }

  async editPickupTm(params) {
    const orderInfoData = await this.OrderRep.findOne({
      where: {
        orderId: params.orderId,
      },
      relations: ['pickupInfo', 'productInfo'],
    });
    const cancelRes = await this.sfService.cancelSfOrder({
      orderId: orderInfoData.pickupInfo.sfId,
    });
    if (
      cancelRes.success == true ||
      cancelRes.errorCode == '8037' ||
      cancelRes.errorCode == '8018'
    ) {
      const sfNo =
        orderInfoData.pickupInfo.sfId == '-1'
          ? 1
          : +orderInfoData.pickupInfo.sfId.split('SF')[1] + 1;
      const completeAddress = Object.values(
        JSON.parse(orderInfoData.pickupInfo.pickupAddress),
      ).join(' ');
      const time =
        params.pickupTm.split(' ')[0] +
        params.pickupTm.split(' ')[1].split('-')[1];
      const createRes = await this.sfService.createSfOrder(
        {
          ...orderInfoData.pickupInfo,
          ...orderInfoData.productInfo,
          pickupAddress: completeAddress,
          pickupTm: time,
          orderId: orderInfoData.orderId,
        },
        sfNo,
      );
      if (createRes.success == true) {
        orderInfoData.pickupInfo.expressStatus = ExpressStatus.Success;
        orderInfoData.pickupInfo.sfId = createRes.msgData.orderId;
        orderInfoData.pickupInfo.waybillId =
          createRes.msgData.waybillNoInfoList[0].waybillNo;
        orderInfoData.pickupInfo.pickupTime = params.pickupTm;
      }
      return await this.OrderRep.save(orderInfoData);
    }
    throw new ApiException(10004);
  }

  async editPickupAd(params) {
    const orderInfoData = await this.OrderRep.findOne({
      where: {
        orderId: params.orderId,
      },
      relations: ['pickupInfo', 'productInfo'],
    });
    const cancelRes = await this.sfService.cancelSfOrder({
      orderId: orderInfoData.pickupInfo.sfId,
    });
    const completeAddress = Object.values(params.pickupAd).join(' ');
    if (
      cancelRes.success == true ||
      cancelRes.errorCode == '8037' ||
      cancelRes.errorCode == '8018'
    ) {
      const sfNo =
        orderInfoData.pickupInfo.sfId == '-1'
          ? 1
          : +orderInfoData.pickupInfo.sfId.split('SF')[1] + 1;
      const time =
        orderInfoData.pickupInfo.pickupTime.split(' ')[0] +
        orderInfoData.pickupInfo.pickupTime.split(' ')[1].split('-')[1];
      const createRes = await this.sfService.createSfOrder(
        {
          ...orderInfoData.productInfo,
          pickupTm: time,
          pickupAddress: completeAddress,
          contactPhone: params.contactInfo.phone,
          contactPerson: params.contactInfo.name,
          orderId: orderInfoData.orderId,
        },
        sfNo,
      );
      if (createRes.success == true) {
        orderInfoData.pickupInfo.expressStatus = ExpressStatus.Success;
        orderInfoData.pickupInfo.sfId = createRes.msgData.orderId;
        orderInfoData.pickupInfo.waybillId =
          createRes.msgData.waybillNoInfoList[0].waybillNo;
        orderInfoData.pickupInfo.pickupAddress = JSON.stringify({
          ...params.pickupAd,
        });
        orderInfoData.pickupInfo.contactPerson = params.contactInfo.name;
        orderInfoData.pickupInfo.contactPhone = params.contactInfo.phone;
      }
      return await this.OrderRep.save(orderInfoData);
    }
    throw new ApiException(10004);
  }

  async getOrderCount(headers) {
    const token = await this.jwtService.verify(headers.token);
    const countData = {};
    for (const value of Object.values(OrderStatus)) {
      if (!isNaN(+value)) {
        countData[OrderStatus[value]] = await this.OrderRep.count({
          where: {
            userId: token.uid,
            orderStatus: +value,
          },
        });
      }
    }
    countData['all'] = await this.OrderRep.count({
      where: {
        userId: token.uid,
      },
    });
    return countData;
  }
  /**
   * 取消订单原因
   * @param params
   * @returns
   */
  async saveCancelReason(params) {
    return await this.OrderRep.update(
      {
        orderId: params.orderId,
      },
      {
        cancelReason: params.reason,
      },
    );
  }
  async getstartEndTime(time) {
    // 将时间范围表示法分割为起始时间和结束时间
    const [startDate, timeRange] = time.split(' ');
    let [startTime, endTime] = timeRange.split('-');

    // 修改后的时间表示法
    startTime = `${startDate} ${startTime}:00`;
    endTime = `${startDate} ${endTime}:00`;
    return { startTime, endTime };
  }
}
