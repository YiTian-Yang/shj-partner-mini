import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import Order from './order.entity';
import { ExpressStatus } from './enum';

@Entity({ name: 'shj_pickup_info' })
export default class PickupInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'sf_id' })
  @ApiProperty({ description: '顺丰订单id' })
  sfId: string;

  @Column({ name: 'contact_person' })
  @ApiProperty({ description: '取件联系人' })
  contactPerson: string;

  @Column({ name: 'contact_phone' })
  @ApiProperty({ description: '取件手机号' })
  contactPhone: string;

  @Column({ name: 'pickup_address', type: 'text' })
  @ApiProperty({ description: '取件地址' })
  pickupAddress: string;

  @Column({ name: 'pickup_time' })
  @ApiProperty({ description: '取件时间' })
  pickupTime: string;

  @Column({ name: 'waybill_id', nullable: true })
  @ApiProperty({ description: '运单号' })
  waybillId: string;

  @Column({ name: 'parcel_id', nullable: true, type: 'text' })
  @ApiProperty({ description: '包裹号' })
  parcelId: string;

  @Column({
    name: 'express_status',
    nullable: true,
    default: ExpressStatus.Success,
    type: 'tinyint',
  })
  @ApiProperty({ description: '快递下单状态' })
  expressStatus: number;

  @Column({
    name: 'express_order_res',
    nullable: true,
    type: 'text',
  })
  @ApiProperty({ description: '快递下单结果' })
  expressOrderRes: string;

  @OneToOne((type) => Order, (order) => order.pickupInfo)
  order: Order;
}
