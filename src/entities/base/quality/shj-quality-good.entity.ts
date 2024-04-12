import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ProductStatus } from './enum';

@Entity({ name: 'shj_quality_good' })
export default class ShjQualityGood extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'quality_order_id', comment: '质检单id' })
  @ApiProperty()
  qualityOrderId: number;

  @Column({ name: 'product_code', comment: '产品code', nullable: true })
  @ApiProperty()
  productCode: string;

  @Column({ name: 'model_id', comment: '型号id', nullable: true })
  @ApiProperty()
  modelId: number;

  @Column({ name: 'category_id', nullable: true, comment: '类目ID' })
  @ApiProperty()
  categoryId: number;

  @Column({ name: 'brand_id', nullable: true, comment: '品牌ID' })
  @ApiProperty()
  brandId: number;

  @Column({ comment: '序列号', nullable: true })
  @ApiProperty()
  imei: string;

  @Column({ comment: '瑕疵项', type: 'text', nullable: true })
  @ApiProperty()
  flaw: string;

  @Column({
    name: 'flaw_img',
    comment: '瑕疵照片',
    type: 'text',
    nullable: true,
  })
  @ApiProperty()
  flawImg: string;

  @Column({
    name: 'print_count',
    comment: '打印次数',
    default: 0,
  })
  @ApiProperty()
  printCount: number;

  @Column({
    name: 'product_status',
    comment: '产品状态',
    type: 'tinyint',
    default: ProductStatus.Unknown,
  })
  @ApiProperty()
  productStatus: ProductStatus;

  @Column({
    name: 'quote_price',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '报价金额',
  })
  @ApiProperty()
  quotePrice: string;
}
