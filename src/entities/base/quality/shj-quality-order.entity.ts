import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { QualityChannel, QualityStatus } from './enum';

@Entity({ name: 'shj_quality_order' })
export default class ShjQualityOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({
    name: 'quality_status',
    comment: '质检状态',
    type: 'tinyint',
    default: QualityStatus.Unknown,
  })
  @ApiProperty()
  qualityStatus: QualityStatus;

  @Column({
    name: 'quality_channel',
    comment: '质检渠道',
    type: 'tinyint',
    default: QualityChannel.Unknown,
  })
  @ApiProperty()
  qualityChannel: QualityChannel;

  @Column({
    name: 'order_id',
    comment: '订单ID（自增ID）可能是C端快递/B端回收',
  })
  @ApiProperty()
  orderId: number;

  @Column({ name: 'good_count', comment: '订单出货数量' })
  @ApiProperty()
  goodCount: number;

  @Column({ comment: '运单号', name: 'waybill_id' })
  @ApiProperty()
  waybillId: string;

  @Column({ comment: '联系人' })
  @ApiProperty()
  contact: string;

  @Column({ comment: '联系电话' })
  @ApiProperty()
  phone: string;

  @Column({ name: 'quality_user_id', comment: '质检员用户ID', nullable: true })
  @ApiProperty()
  qualityUserId: number;

  @Column({ name: 'quality_at', comment: '质检时间', nullable: true })
  @ApiProperty()
  qualityAt: Date;
}
