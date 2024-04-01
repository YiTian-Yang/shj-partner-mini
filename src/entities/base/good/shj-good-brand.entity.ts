import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_good_brand' })
export default class ShjGoodBrandEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true, name: 'brand_name' })
  @ApiProperty()
  brandName: string;

  @Column({ unique: true, name: 'brand_custom_id' })
  @ApiProperty()
  brandCustomId: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;
}
