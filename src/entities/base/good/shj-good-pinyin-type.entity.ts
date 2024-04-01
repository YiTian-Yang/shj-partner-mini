import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_good_pinyin_type' })
export default class ShjGoodPinyinTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'pinyin_name' })
  @ApiProperty()
  pinyinName: string;

  @Column({ name: 'type_id', nullable: true })
  @ApiProperty()
  typeId: number;
}
