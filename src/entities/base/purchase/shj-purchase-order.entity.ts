import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { PurchaseChannel, PurchaseStatus } from './enum';

@Entity({ name: 'shj_purchase_order' })
export default class ShjPurchaseOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'purchase_code', unique: true, comment: '采购入库单编号' })
  @ApiProperty()
  purchaseCode: string;

  @Column({
    name: 'purchase_status',
    comment: '采购入库单状态',
    type: 'tinyint',
    default: PurchaseStatus.Unknown,
  })
  @ApiProperty()
  purchaseStatus: PurchaseStatus;

  @Column({
    name: 'order_id',
    comment: '订单ID（自增ID）可能是C端快递/B端回收/线下回收任何一个',
  })
  @ApiProperty()
  orderId: number;

  @Column({
    name: 'purchase_channel',
    comment: '采购渠道',
    type: 'tinyint',
    default: PurchaseChannel.Unknown,
  })
  @ApiProperty()
  purchaseChannel: PurchaseChannel;

  @Column({
    comment: '供应商',
    nullable: true,
  })
  @ApiProperty()
  supplier: string;

  @Column({
    comment: '入库人用户Id',
    name: 'in_storage_user_id',
    nullable: true,
  })
  @ApiProperty()
  inStorageUserId: number;

  @Column({
    comment: '入库时间',
    name: 'in_storage_at',
    nullable: true,
  })
  @ApiProperty()
  inStorageAt: Date;

  @Column({
    comment: '商品所属用户id，可以为空，和仓库货架ID二选一',
    name: 'good_user_id',
    nullable: true,
  })
  @ApiProperty()
  goodUserId: number;

  @Column({
    comment: '仓库货架id，可以为空，和商品所属用户id二选一',
    name: 'warehouse_shelf_id',
    nullable: true,
  })
  @ApiProperty()
  warehouseShelfId: number;

  @Column({
    comment: '仓库ID',
    name: 'warehouse_id',
  })
  @ApiProperty()
  warehouseId: number;

  @Column({
    comment: '收货人用户id',
    name: 'receive_user_id',
    nullable: true,
  })
  @ApiProperty()
  receiveUserId: number;

  @Column({ comment: '运单号', name: 'waybill_id' })
  @ApiProperty()
  waybillId: string;
}
