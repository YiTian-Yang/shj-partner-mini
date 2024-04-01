import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { AttributeStatus } from './eunm';

@Entity({ name: 'shj_shop_good_model_attribute' })
export default class ShjShopGoodModelAttributeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'good_id', comment: '商品ID' })
  @ApiProperty()
  goodId: number;

  @Column({
    name: 'price',
    comment: '售价',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  @ApiProperty()
  price: number;

  @Column({ name: 'color_attribute_id', comment: '颜色属性ID' })
  @ApiProperty()
  colorAttributeId: number;

  @Column({ name: 'color_img', comment: '颜色主图', nullable: true })
  @ApiProperty()
  colorImg: string;

  @Column({ name: 'memory_attribute_id', comment: '内存属性ID' })
  @ApiProperty()
  memoryAttributeId: number;

  @Column({ name: 'sku_custom_id', comment: 'SKU自定义ID' })
  @ApiProperty()
  skuCustomId: string;

  @Column({
    name: 'attribute_status',
    comment: '停用启用状态',
    type: 'tinyint',
    default: AttributeStatus.Unknown,
  })
  @ApiProperty()
  attributeStatus: AttributeStatus;
}
