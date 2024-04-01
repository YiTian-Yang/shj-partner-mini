import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_evaluate_good_model_online' })
export default class ShjEvaluateGoodModelOnlineEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true, name: 'model_id' })
  @ApiProperty()
  modelId: number;

  @Column({ name: 'model_sort' })
  @ApiProperty()
  modelSort: number;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;
}
