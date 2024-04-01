import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import ProductInfo from './product-info.entity';
import PaymentInfo from './Payment-info.entity';
import PickupInfo from './pickup-info.entity';
import { OrderChannel, OrderStatus, OrderType } from './enum';

@Entity({ name: 'shj_orders' })
export default class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({
    name: 'order_type',
    type: 'tinyint',
    default: OrderType.Recycle,
  })
  @ApiProperty({ description: '订单类型' })
  orderType: OrderType;

  @Column({
    name: 'order_channel',
    type: 'tinyint',
    default: OrderChannel.C_Alipay,
  })
  @ApiProperty({ description: '订单渠道' })
  orderChannel: OrderChannel;

  @Column({
    name: 'order_status',
    type: 'tinyint',
    default: OrderStatus.PendingPickup,
  })
  @ApiProperty({ description: '订单状态' })
  orderStatus: OrderStatus;

  @Column({ name: 'order_id', unique: true })
  @ApiProperty({ description: '订单编号' })
  orderId: string;

  @Column({ name: 'order_time' })
  @ApiProperty({ description: '订单时间' })
  orderTime: string;

  @Column({ name: 'transaction_success_time', nullable: true })
  @ApiProperty({ description: '交易成功时间' })
  transactionSuccessTime: string;

  @Column({ name: 'user_id', nullable: true })
  @ApiProperty({ description: '交易用户id' })
  userId: string;

  @Column({ name: 'user_message', nullable: true })
  @ApiProperty({ description: '用户留言' })
  userMessage: string;

  @Column({ name: 'third_channel_id', nullable: true })
  @ApiProperty({ description: '三方合作平台id' })
  thirdChannelId: number;

  @Column({ name: 'channel_order_id', nullable: true })
  @ApiProperty({ description: '渠道订单id' })
  channelOrderId: string;

  @Column({ name: 'cancel_reason', nullable: true, comment: '订单取消原因' })
  @ApiProperty({ description: '订单取消原因' })
  cancelReason: string;

  @OneToOne(() => ProductInfo, (product) => product.order, { cascade: true })
  @JoinColumn()
  productInfo: ProductInfo;

  @OneToOne(() => PaymentInfo, (payment) => payment.order, { cascade: true })
  @JoinColumn()
  paymentInfo: PaymentInfo;

  @OneToOne(() => PickupInfo, (pickup) => pickup.order, { cascade: true })
  @JoinColumn()
  pickupInfo: PickupInfo;
}
