import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
@Entity({ name: 'shj_evaluate_config_question_online' })
export default class ShjEvaluateConfigQuestionOnlineEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'config_id' })
  @ApiProperty()
  configId: number;

  @Column({
    name: 'question_id',
  })
  @ApiProperty()
  questionId: number;

  @Column({ nullable: true, name: 'config_question_description' })
  @ApiProperty()
  configQuestionDescription: string;

  @Column({ name: 'config_question_sort' })
  @ApiProperty()
  configQuestionSort: number;

  @Column({ nullable: true, default: '', name: 'config_question_remark' })
  @ApiProperty()
  configQuestionRemark: string;
}
