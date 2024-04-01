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
import { PaymentStatus, PaymentType } from './enum';

@Entity({ name: 'shj_payment_info' })
export default class PaymentInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({
    name: 'payment_status',
    type: 'tinyint',
    default: PaymentStatus.UnPay,
  })
  @ApiProperty({ description: '打款状态' })
  paymentStatus: PaymentStatus;

  @Column({
    name: 'payment_type',
    type: 'tinyint',
    default: PaymentType.AutoPay,
    nullable: true,
  })
  @ApiProperty({ description: '打款类型' })
  paymentType: PaymentType;

  @Column({ name: 'payment_time', nullable: true })
  @ApiProperty({ description: '打款时间' })
  paymentTime: string;

  @Column({ name: 'payer', nullable: true })
  @ApiProperty({ description: '打款人' })
  payer: string;

  @Column({
    name: 'payment_amount',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  @ApiProperty({ description: '打款金额' })
  paymentAmount: number;

  @Column({ name: 'real_name' })
  @ApiProperty({ description: '真实姓名' })
  realName: string;

  @Column({ name: 'receive_account' })
  @ApiProperty({ description: '收款账户' })
  receiveAccount: string;
  @Column({
    name: 'serial_number',
    nullable: true,
  })
  @ApiProperty({ description: '交易流水号' })
  serialNumber: string;

  @OneToOne((type) => Order, (order) => order.paymentInfo)
  order: Order;
}
