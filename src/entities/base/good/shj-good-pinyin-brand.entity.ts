import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_good_pinyin_brand' })
export default class ShjGoodPinyinBrandEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'pinyin_name' })
  @ApiProperty()
  pinyinName: string;

  @Column({ name: 'brand_id', nullable: true })
  @ApiProperty()
  brandId: number;
}
