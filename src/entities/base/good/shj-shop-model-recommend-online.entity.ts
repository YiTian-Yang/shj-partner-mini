import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_shop_good_model_recommend' })
export default class ShjShopGoodModelRecommendEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'good_id' })
  @ApiProperty()
  goodId: number;

  @Column({ name: 'recommend_sort' })
  @ApiProperty()
  recommendSort: number;
}
