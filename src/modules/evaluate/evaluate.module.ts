import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ShjGoodBrandEntity from '../../entities/base/good/shj-good-brand.entity';
import ShjGoodModelEntity from '../../entities/base/good/shj-good-model.entity';
import ShjGoodTypeEntity from '../../entities/base/good/shj-good-type.entity';
import ShjGoodPinyinBrandEntity from 'src/entities/base/good/shj-good-pinyin-brand.entity';
import ShjGoodPinyinModelEntity from 'src/entities/base/good/shj-good-pinyin-model.entity';
import ShjGoodPinyinTypeEntity from 'src/entities/base/good/shj-good-pinyin-type.entity';
import ShjEvaluateConfigAnswerOnlineEntity from '../../entities/base/evaltate/shj-evaluate-config-answer-online.entity';
import ShjEvaluateConfigOnlineEntity from '../../entities/base/evaltate/shj-evaluate-config-online.entity';
import ShjEvaluateConfigQuestionOnlineEntity from '../../entities/base/evaltate/shj-evaluate-config-question-online.entity';
import { EvaluateGoodController } from './evaluate-good/evaluate-good.controller';
import { EvaluateGoodService } from './evaluate-good/evaluate-good.service';
import ShjEvaluateQuestionEntity from '../../entities/base/evaltate/shj-evaluate-question.entity';
import ShjEvaluateAnswerEntity from '../../entities/base/evaltate/shj-evaluate-answer.entity';
import ShjEvaluateGoodBrandOnlineEntity from '../../entities/base/evaltate/shj-evaluate-good-brand-online.entity';
import ShjEvaluateGoodModelOnlineEntity from '../../entities/base/evaltate/shj-evaluate-good-model-online.entity';
import { EvaluateConfigController } from './evaluate-config/evaluate-config.controller';
import { EvaluateConfigService } from './evaluate-config/evaluate-config.service';
import { EvaluateCalculateController } from './evaluate-calculate/evaluate-calculate.controller';
import { EvaluateCalculateService } from './evaluate-calculate/evaluate-calculate.service';
import ShjGoodModelRecommendOnlineEntity from '../../entities/base/evaltate/shj-good-model-recommend-online.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        ShjEvaluateConfigQuestionOnlineEntity,
        ShjEvaluateConfigOnlineEntity,
        ShjEvaluateConfigAnswerOnlineEntity,
        ShjGoodModelEntity,
        ShjGoodTypeEntity,
        ShjGoodBrandEntity,
        ShjEvaluateQuestionEntity,
        ShjEvaluateAnswerEntity,
        ShjEvaluateGoodModelOnlineEntity,
        ShjEvaluateGoodBrandOnlineEntity,
        ShjGoodModelRecommendOnlineEntity,
        ShjGoodPinyinBrandEntity,
        ShjGoodPinyinTypeEntity,
        ShjGoodPinyinModelEntity,
      ],
      'base',
    ),
  ],
  controllers: [
    EvaluateGoodController,
    EvaluateConfigController,
    EvaluateCalculateController,
  ],
  providers: [
    EvaluateGoodService,
    EvaluateConfigService,
    EvaluateCalculateService,
  ],
})
export class EvaluateModule {}
