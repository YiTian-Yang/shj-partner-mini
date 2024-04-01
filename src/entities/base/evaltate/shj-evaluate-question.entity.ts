import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
@Entity({ name: 'shj_evaluate_question' })
export default class ShjEvaluateQuestionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true, name: 'question_custom_id' })
  @ApiProperty()
  questionCustomId: string;

  @Column({ name: 'question_name' })
  @ApiProperty()
  questionName: string;

  @Column({ type: 'tinyint', default: 0, name: 'answer_type' })
  @ApiProperty()
  answerType: number;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;
}
