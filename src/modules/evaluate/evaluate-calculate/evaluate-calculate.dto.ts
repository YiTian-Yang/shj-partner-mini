import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
interface question {
  questionId: number;
  answerIdList: number[];
  // configQuestionId: number;
}
export class QuestionDto {
  @ApiProperty({
    description: '问题列表',
  })
  @IsArray()
  @IsNotEmpty()
  questionList: question[];

  @ApiProperty({
    description: '型号ID',
  })
  @IsNotEmpty()
  @IsNumber()
  modelId: number;

  @ApiProperty({
    description: '是否为换机，true为是，默认为false',
  })
  @IsBoolean()
  @IsOptional()
  isReplace = false;
}
