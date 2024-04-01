import { Injectable } from '@nestjs/common';
import { UtilService } from 'src/shared/services/util.service';
import { RedisService } from 'src/shared/services/redis.service';
import { SDT_config, SFConfig } from 'src/config/configuration';
import * as dayjs from 'dayjs';
import axios from 'axios';
import { ApiException } from 'src/common/exceptions/api.exception';
import { LoggerService } from 'src/shared/logger/logger.service';
import * as crypto from 'crypto';

@Injectable()
export class SfOrderService {
  constructor(
    private utils: UtilService,
    private redisService: RedisService,
    private logger: LoggerService, // @InjectRepository(Order) // private readonly OrderRep: Repository<Order>,
  ) {}
  /**
   * 获取顺丰Token
   */
  async getSfAccessToken() {
    const token = await this.redisService.getRedis().get('sf:accessToken');
    if (token && token.length) {
      return token;
    }
    const { data: sfToken } = await axios({
      url: SFConfig().realTokenUrl,
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data: {
        partnerID: SFConfig().partnerID,
        secret: SFConfig().realSecret,
        grantType: 'password',
      },
    });
    if (sfToken.apiResultCode == 'A1000' && sfToken.accessToken.length) {
      this.redisService
        .getRedis()
        .set('sf:accessToken', sfToken.accessToken, 'EX', sfToken.expiresIn);
      return sfToken.accessToken;
    } else {
      this.logger.error(sfToken);
      throw new ApiException(10001);
    }
  }
  async createSfOrder(orderInfo, sfNo = 1) {
    if (process.env.SF_SOURCE && process.env.SF_SOURCE == 'SDT') {
      const sdtRes = await this.createSfOrderForSDT(orderInfo, sfNo);
      if (sdtRes?.msgData?.filterResult == 3) {
        throw Error('顺丰下单失败，当前地区暂不支持快递收派！');
      }
      return sdtRes;
    } else {
      const sfRes = await this.createSfOrderForSf(orderInfo, sfNo);
      if (sfRes?.msgData?.filterResult == 3) {
        throw Error('顺丰下单失败，当前地区暂不支持快递收派！');
      }
      return sfRes;
    }
  }
  /**
   * 创建sf订单for SF
   */
  async createSfOrderForSf(orderInfo, sfNo = 1) {
    const sfAccessToken = await this.getSfAccessToken();
    const msgData = {
      cargoDetails: [
        {
          count: 1,
          unit: '个',
          amount: orderInfo.valuationPrice,
          // currency: 'HKD',
          name: '手机',
          // sourceArea: 'CHN',
        },
      ],
      contactInfoList: [
        {
          address: orderInfo.pickupAddress,
          contact: orderInfo.contactPerson,
          contactType: 1,
          country: 'CN',
          tel: orderInfo.contactPhone,
        },
        {
          ...SFConfig().deliveryAddress,
        },
      ],
      language: 'zh_CN',
      expressTypeId: 2,
      orderId: orderInfo.orderId + 'SF' + sfNo,
      sendStartTm: dayjs(orderInfo.pickupTm).format('YYYY-MM-DD HH:mm:ss'),
      monthlyCard: SFConfig().monthlyCard,
      isDocall: 1,
    };
    const { data: SfOrderRes } = await axios({
      method: 'POST',
      url: SFConfig().realUrl,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data: {
        partnerID: SFConfig().partnerID,
        requestID: this.utils.generateUUID(),
        serviceCode: 'EXP_RECE_CREATE_ORDER',
        timestamp: new Date().getTime(),
        accessToken: sfAccessToken,
        msgData: JSON.stringify(msgData),
      },
    });
    if (SfOrderRes.apiResultCode !== 'A1000') {
      this.logger.error(SfOrderRes);
      this.redisService.getRedis().del('sf:accessToken');
      throw new ApiException(10002);
    }
    const SfOrderData = JSON.parse(SfOrderRes.apiResultData);
    return SfOrderData;
  }
  /**
   * 取消sf订单
   */
  async cancelSfOrder(cancelOrderInfo) {
    const sfAccessToken = await this.getSfAccessToken();
    const msgData = {
      dealType: 2,
      language: 'zh-CN',
      orderId: cancelOrderInfo.orderId,
      totalWeight: 1,
      waybillNoInfoList: [],
    };
    const { data: CancelRes } = await axios({
      method: 'POST',
      url: SFConfig().realUrl,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data: {
        partnerID: SFConfig().partnerID,
        requestID: this.utils.generateUUID(),
        serviceCode: 'EXP_RECE_UPDATE_ORDER',
        timestamp: new Date().getTime(),
        accessToken: sfAccessToken,
        msgData: JSON.stringify(msgData),
      },
    });
    if (CancelRes.apiResultCode !== 'A1000') {
      this.logger.error(CancelRes);
      this.redisService.getRedis().del('sf:accessToken');
      throw new ApiException(10004);
    }
    return JSON.parse(CancelRes.apiResultData);
  }
  /**
   * 查询订单结果
   * @param params
   */
  async getCreateOrderRes(params) {
    const sfAccessToken = await this.getSfAccessToken();
    const msgData = {
      orderId: params.orderId,
    };
    const { data: createRes } = await axios({
      method: 'POST',
      url: SFConfig().realUrl,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data: {
        partnerID: SFConfig().partnerID,
        requestID: this.utils.generateUUID(),
        serviceCode: 'EXP_RECE_SEARCH_ORDER_RESP',
        timestamp: new Date().getTime(),
        accessToken: sfAccessToken,
        msgData: JSON.stringify(msgData),
      },
    });
    if (createRes.apiResultCode !== 'A1000') {
      this.logger.error(createRes);
      this.redisService.getRedis().del('sf:accessToken');
      throw new ApiException(10003);
    }
    return JSON.parse(createRes.apiResultData);
  }
  /**
   * 路由查询接口
   */
  async getSfRouters(params) {
    const sfAccessToken = await this.getSfAccessToken();
    const msgData = {
      trackingType: params.searchType,
      trackingNumber: [params.searchId],
    };
    const { data: routersRes } = await axios({
      method: 'POST',
      url: SFConfig().realUrl,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data: {
        partnerID: SFConfig().partnerID,
        requestID: this.utils.generateUUID(),
        serviceCode: 'EXP_RECE_SEARCH_ROUTES',
        timestamp: new Date().getTime(),
        accessToken: sfAccessToken,
        msgData: JSON.stringify(msgData),
      },
    });
    if (routersRes.apiResultCode !== 'A1000') {
      this.logger.error(routersRes);
      this.redisService.getRedis().del('sf:accessToken');
      throw new ApiException(10005);
    }
    return JSON.parse(routersRes.apiResultData);
  }
  // // 路由推送接口
  // async receiveSfPushRoute(params) {
  //   this.logger.log(params);
  //   try {
  //     const orderInfo = await this.OrderRep.createQueryBuilder('order')
  //       .innerJoinAndSelect('order.pickupInfo', 'pickupInfo')
  //       .where('pickupInfo.sfId = :sfId', {
  //         sfId: params.WaybillRoute[0].orderid,
  //       })
  //       .getOne();
  //     if (
  //       params.WaybillRoute[0].opCode == '50' &&
  //       orderInfo.orderStatus == OrderStatus.PendingPickup
  //     ) {
  //       orderInfo.orderStatus = OrderStatus.WaitingQuote;
  //       this.OrderRep.save(orderInfo);
  //     }
  //   } catch (error) {
  //     this.logger.error(error);
  //   }
  //   return {
  //     success: 'true',
  //   };
  // }
  // // 订单状态推送
  // async receiveSfPushOrder(params) {
  //   this.logger.log(params);
  //   try {
  //     const orderInfo = await this.OrderRep.createQueryBuilder('order')
  //       .innerJoinAndSelect('order.pickupInfo', 'pickupInfo')
  //       .where('pickupInfo.sfId = :sfId', {
  //         sfId: params.orderState[0].orderNo,
  //       })
  //       .getOne();
  //     if (
  //       params.orderState[0].orderStateCode == '05-40003' &&
  //       orderInfo.orderStatus == OrderStatus.PendingPickup
  //     ) {
  //       orderInfo.orderStatus = OrderStatus.WaitingQuote;
  //       this.OrderRep.save(orderInfo);
  //     }
  //   } catch (error) {
  //     this.logger.error(error);
  //   }
  //   return {
  //     success: 'true',
  //   };
  // }
  /**
   * 顺电通创建订单
   * @param params
   */
  async createSfOrderForSDT(orderInfo: any, sfNo = 1) {
    const signDate = this.resultSign();
    const Sdt_config = SDT_config[`SDT_${process.env.SF_ENV}`];
    const params = {
      // 加密基础信息
      appId: Sdt_config.appId,
      requestId: signDate.requestId,
      timestamp: signDate.timestamp,
      sign: signDate.sign,
      // 付款方式，支持以下值 1:寄方付(寄付月付) 2:收方付 3:第三方付 4：寄付现结
      payMethod: 1,
      // 1；特快，2：标快
      expressType: '2',
      // 寄件时间 要求上门取件开始时间，不传值则为自己联系取件；若传值代表下call，格式：YYYY-MM-DD HH24:MM:SS，
      sendStartTime: dayjs(orderInfo.pickupTm).format('YYYY-MM-DD HH:mm:ss'),
      // 月结卡号测试使用9999999999,不传默认使用后台配置
      customNumber: Sdt_config.customNumber,
      // 客户订单号，不传则系统默认生成。填了此值，重复下单会返回重复下单提示
      orderNumber: orderInfo.orderId + 'SF' + sfNo,
      // mailNumber: '',
      // 寄件人信息
      senderOrgCode: Sdt_config.custumerNo,
      senderName: orderInfo.contactPerson,
      senderTel: orderInfo.contactPhone,
      senderAddress: orderInfo.pickupAddress,
      // 收件人信息
      receiverOrgCode: Sdt_config.custumerNo,
      receiverName: SFConfig().deliveryAddress.contact,
      receiverTel: SFConfig().deliveryAddress.tel,
      receiverAddress: SFConfig().deliveryAddress.address,
      // 是否返回签回单（签单返还）的运单号，支持以下值： 0：为不要求,1：纸质回单，2，电子回单，3纸质+电子回单 增值服务会产生相应计费，使用前请与顺丰销售或科技人员确认
      needReturnTrackingNumber: '0',
      // 成本类型 0:公司 1:卖场 2:消费者（门店给个人消费者寄件场景） 3:仓库 4:门店调货 6:维修
      costType: 0,
      cargo: [
        {
          name: '数码产品', //货物名称，取列表第一个货物的名称作为订单的托寄物名称
          count: 1, //货物数量
          unit: '个', //单位
          weight: null, //重量，KG
          amount: orderInfo.valuationPrice, //货物价值金额
        },
      ],
    };
    try {
      const resData = await axios({
        url: Sdt_config.url + 'api/universal/createOrder',
        method: 'POST',
        data: {
          ...params,
        },
      });
      // return resData.data;
      const createRes = resData.data;
      if (createRes.errorCode !== '0') {
        this.logger.log(JSON.stringify(createRes));
      }
      const data_detail = createRes.data;
      const dataFormat = {
        success: createRes.errorCode == '0' ? true : false,
        errorCode: 'S0000',
        errorMsg: createRes?.message,
        msgData: {
          orderId: data_detail?.orderNumber,
          originCode: data_detail?.originCode,
          destCode: data_detail?.destCode,
          filterResult: data_detail?.filterResult,
          remark: data_detail?.remark,
          url: data_detail?.url,
          paymentLink: data_detail?.paymentLink,
          isUpstairs: null,
          isSpecialWarehouseService: null,
          mappingMark: data_detail?.mappingMark,
          waybillNoInfoList: [
            {
              waybillType: 1,
              waybillNo: data_detail?.mailNumber,
            },
          ],
        },
      };
      return dataFormat;
    } catch (error) {
      throw new Error(`创建sf订单失败：${error}`);
    }
  }

  /**
   * 生成加密凭证
   */
  private generateSign(
    appId: string,
    requestId: string,
    timestamp: string,
    appSecret?: string,
  ): string {
    const arrs = [appId, requestId, timestamp];
    if (appSecret) {
      arrs.push(appSecret);
    }
    arrs.sort();
    const combinedString = arrs.join('');
    return this.encrypt32(combinedString);
  }

  /**
   * 转16进制
   * @param data buffer data
   * @returns hex text
   */
  private encodeHex(data: Buffer): string {
    return data.toString('hex');
  }

  /**
   * md5加密
   * @param text Plain text
   * @returns Hashed text
   */
  private encrypt32(text: string): string {
    const hash = crypto.createHash('md5');
    hash.update(text, 'utf8');
    return this.encodeHex(hash.digest());
  }

  /**
   * 生成加密凭证前置方法
   * @throws Error if signature generation fails
   * @returns sign
   */
  private resultSign(): {
    sign: string;
    requestId: string;
    timestamp: string;
  } {
    const Sdt_config = SDT_config[`SDT_${process.env.SF_ENV}`];
    const appId = Sdt_config.appId; // Replace with your app ID
    const appSecret = Sdt_config.appSecret; // Replace with your app secret
    const requestId = this.generateRequestId(); // Implement your logic to generate a unique request ID
    const timestamp = Date.now().toString();
    const sign = this.generateSign(appId, requestId, timestamp, appSecret);
    return {
      sign: sign,
      requestId: requestId,
      timestamp: timestamp,
    };
  }

  /**
   * 生成请求id
   */
  private generateRequestId(): string {
    // 生成一个 8-4-4-4-12 格式的标识符
    const uuid = [
      this.utils.generateRandomValue(8),
      this.utils.generateRandomValue(4),
      this.utils.generateRandomValue(4),
      this.utils.generateRandomValue(4),
      this.utils.generateRandomValue(12),
    ].join('-');
    return uuid;
  }
}
