import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_purchase_good' })
export default class ShjPurchaseGood extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'purchase_order_id', comment: '采购单id' })
  @ApiProperty()
  purchaseOrderId: number;

  @Column({ name: 'model_id', comment: '型号id' })
  @ApiProperty()
  modelId: number;

  @Column({ comment: '序列号', nullable: true })
  @ApiProperty()
  imei: string;

  @Column({
    comment: '成本',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  @ApiProperty()
  cost: string;

  @Column({ comment: '内存', nullable: true })
  @ApiProperty()
  memory: string;

  @Column({ comment: '颜色', nullable: true })
  @ApiProperty()
  color: string;

  @Column({ comment: '照片', type: 'text', nullable: true })
  @ApiProperty()
  img: string;
}
