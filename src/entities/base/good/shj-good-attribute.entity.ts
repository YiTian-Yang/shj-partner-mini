import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { AttributeType } from './eunm';

@Entity({ name: 'shj_good_attribute' })
export default class ShjGoodAttributeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true, name: 'attribute_name' })
  @ApiProperty()
  attributeName: string;

  @Column({
    type: 'tinyint',
    name: 'attribute_type',
    default: AttributeType.Unknown,
  })
  @ApiProperty()
  attributeType: AttributeType;

  @Column({ unique: true, name: 'attribute_custom_id' })
  @ApiProperty()
  attributeCustomId: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;
}
