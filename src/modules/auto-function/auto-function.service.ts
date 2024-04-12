import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { UtilService } from 'src/shared/services/util.service';
import * as dayjs from 'dayjs';
import { AutoCreatePurchaseDto } from './auto-function.dto';
import ShjPurchaseGood from 'src/entities/base/purchase/shj-purchase-good.entity';
import ShjPurchaseOrder from 'src/entities/base/purchase/shj-purchase-order.entity';
import ShjQualityGood from 'src/entities/base/quality/shj-quality-good.entity';
// import ShjQualityOrder from 'src/entities/base/quality/shj-quality-order.entity';
import Order from 'src/entities/base/order/order.entity';
import {
  PurchaseChannel,
  PurchaseStatus,
} from 'src/entities/base/purchase/enum';
import {
  OrderStatus,
  OrderChannel,
  OrderChannelImplication,
  PaymentStatus,
} from 'src/entities/base/order/enum';
import { QualityStatus } from 'src/entities/base/quality/enum';
@Injectable()
export class AutoFunctionService {
  constructor(
    @InjectRepository(ShjPurchaseGood, 'base')
    private readonly purchaseGood: Repository<ShjPurchaseGood>,
    @InjectRepository(ShjPurchaseOrder, 'base')
    private readonly purchaseOrder: Repository<ShjPurchaseOrder>,
    @InjectRepository(ShjQualityGood, 'base')
    private readonly qualityGood: Repository<ShjQualityGood>,
    @InjectRepository(Order, 'base')
    private readonly order: Repository<Order>,
    private util: UtilService,
  ) {}
  async autoCreatePurchase(dto: AutoCreatePurchaseDto) {
    const { purchaseChannel, orderId } = dto;
    if (purchaseChannel === PurchaseChannel.C_Express) {
      const order = await this.order.findOne({
        where: {
          id: orderId,
          orderStatus: OrderStatus.SuccessfulTransaction,
        },
        relations: ['paymentInfo', 'pickupInfo', 'productInfo'],
      });

      if (
        order &&
        order.paymentInfo.paymentStatus === PaymentStatus.PaySuccess
      ) {
        const supplier = '分收小程序';
        // if (
        //   order.orderChannel === OrderChannel.Third_Channel &&
        //   order.thirdChannelId
        // ) {
        //   supplier = '分收小程序';
        // } else {
        //   supplier = OrderChannelImplication[order.orderChannel];
        // }
        const quality = await this.qualityGood
          .createQueryBuilder('good')
          .leftJoinAndSelect(
            'shj_quality_order',
            'qualityOrder',
            'good.quality_order_id = qualityOrder.id',
          )
          .leftJoinAndSelect(
            'shj_orders',
            'order',
            'order.id = qualityOrder.order_id',
          )
          .leftJoinAndSelect('order.paymentInfo', 'paymentInfo')
          .andWhere('qualityOrder.orderId = :orderId', { orderId })
          .andWhere('qualityOrder.quality_status = :qualityStatus', {
            qualityStatus: QualityStatus.Finished,
          })
          .select([
            'good.model_id AS modelId',
            'good.imei AS imei',
            'good.id AS id',
            'paymentInfo.payment_amount AS paymentAmount',
          ])
          .getRawMany();
        const isPurchaseOrder = await this.purchaseOrder.findOne({
          where: { orderId },
        });

        if (quality.length > 0 && !isPurchaseOrder) {
          const date = new Date();
          const purchaseCode =
            'CGRK' +
            dayjs(+date).format('YYMMDDHHmmss') +
            (await this.util.generateRandomValue(6, '1234567890'));
          const purchaseOrder = await this.purchaseOrder.create({
            purchaseStatus: PurchaseStatus.WaitingInStorage,
            orderId: order.id,
            purchaseChannel: PurchaseChannel.C_Express,
            supplier,
            purchaseCode,
            warehouseId: 1,
            waybillId: order.pickupInfo.waybillId,
            createdAt: dayjs(order.paymentInfo.paymentTime).format(
              'YYYY-MM-DD HH:mm:ss',
            ),
          });
          const savedPurchaseOrder = await this.purchaseOrder.save(
            purchaseOrder,
          );
          for (const item of quality) {
            const data = await this.purchaseGood.create({
              purchaseOrderId: savedPurchaseOrder.id,
              modelId: item.modelId,
              imei: item.imei,
              // cost: item.paymentAmount,
            });
            await this.purchaseGood.save(data);
          }
        }
      }
    }
  }
}
