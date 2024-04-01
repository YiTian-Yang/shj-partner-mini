import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_good_model_recommend_online' })
export default class ShjGoodModelRecommendOnlineEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true, name: 'model_id' })
  @ApiProperty()
  modelId: number;

  @Column({ name: 'recommend_sort' })
  @ApiProperty()
  recommendSort: number;
}
