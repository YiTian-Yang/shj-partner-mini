import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_good_pinyin_model' })
export default class ShjGoodPinyinModelEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'pinyin_name' })
  @ApiProperty()
  pinyinName: string;

  @Column({ name: 'model_id', nullable: true })
  @ApiProperty()
  modelId: number;

  @Column({ name: 'brand_id', nullable: true })
  @ApiProperty()
  brandId: number;

  @Column({ name: 'type_id', nullable: true })
  @ApiProperty()
  typeId: number;
}
