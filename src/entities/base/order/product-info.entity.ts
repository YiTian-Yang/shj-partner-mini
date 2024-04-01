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

@Entity({ name: 'shj_product_info' })
export default class ProductInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'category_id', nullable: true })
  @ApiProperty({ description: '类目id' })
  categoryId: number;

  @Column({ name: 'brand_id' })
  @ApiProperty({ description: '品牌id', nullable: true })
  brandId: number;

  @Column({ name: 'model_id' })
  @ApiProperty({ description: '型号id', nullable: true })
  modelId: number;

  @Column({ name: 'valuation_price', type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '估价金额' })
  valuationPrice: number;

  @Column({
    name: 'channel_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  @ApiProperty({ description: '渠道估价金额' })
  channelPrice: number;

  @Column({
    name: 'quote_price',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  @ApiProperty({ description: '报价金额' })
  quotePrice: number;

  @Column({ name: 'valuation_details', type: 'text' })
  @ApiProperty({ description: '估价详情' })
  valuationDetails: string;

  @OneToOne((type) => Order, (order) => order.productInfo)
  order: Order;
}
