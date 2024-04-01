import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
@Entity({ name: 'shj_evaluate_answer' })
export default class ShjEvaluateAnswerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'question_id' })
  @ApiProperty()
  questionId: number;

  @Column({ name: 'main_answer' })
  @ApiProperty()
  mainAnswer: string;

  @Column({ name: 'secondary_answer', nullable: true, default: '' })
  @ApiProperty()
  secondaryAnswer: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;

  @Column({ type: 'tinyint', default: 1, name: 'is_allow_recovery' })
  @ApiProperty()
  isAllowRecovery: number;
}
