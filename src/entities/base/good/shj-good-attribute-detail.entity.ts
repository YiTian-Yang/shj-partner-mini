import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_good_attribute_detail' })
export default class ShjGoodAttributeDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'attribute_id' })
  @ApiProperty()
  attributeId: number;

  @Column({ name: 'attribute_detail_name' })
  @ApiProperty()
  attributeDetailName: string;

  @Column({ unique: true, name: 'attribute_detail_custom_id' })
  @ApiProperty()
  attributeDetailCustomId: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;
}
