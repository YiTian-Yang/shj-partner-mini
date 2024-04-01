import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
@Entity({ name: 'shj_evaluate_config_answer_online' })
export default class ShjEvaluateConfigAnswerOnlineEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'answer_id' })
  @ApiProperty()
  answerId: number;

  @Column({
    name: 'config_question_id',
  })
  @ApiProperty()
  configQuestionId: number;

  @Column({ nullable: true, name: 'config_answer_description' })
  @ApiProperty()
  configAnswerDescription: string;

  @Column({
    name: 'config_answer_deduct_money',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  @ApiProperty()
  configAnswerDeductMoney: number;

  @Column({
    name: 'next_config_question_sort_id',
    nullable: true,
  })
  @ApiProperty()
  nextConfigQuestionSortId: number;

  // @Column({
  //   name: 'next_config_question_sort',
  //   nullable: true,
  // })
  // @ApiProperty()
  // nextConfigQuestionSort: number;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: 0,
    name: 'is_direct_finish',
  })
  @ApiProperty()
  isDirectFinish: number;
}
