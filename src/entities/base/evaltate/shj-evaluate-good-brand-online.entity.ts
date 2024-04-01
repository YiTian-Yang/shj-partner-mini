import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_evaluate_good_brand_online' })
export default class ShjEvaluateGoodBrandOnlineEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'brand_id' })
  @ApiProperty()
  brandId: number;

  @Column({ name: 'type_id' })
  @ApiProperty()
  typeId: number;

  @Column({ name: 'brand_sort' })
  @ApiProperty()
  brandSort: number;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;
}
