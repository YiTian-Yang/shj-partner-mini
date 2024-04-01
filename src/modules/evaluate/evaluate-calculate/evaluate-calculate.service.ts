import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ShjEvaluateConfigAnswerOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-config-answer-online.entity';
import ShjEvaluateConfigOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-config-online.entity';
import ShjEvaluateConfigQuestionOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-config-question-online.entity';
import ShjEvaluateQuestionEntity from '../../../entities/base/evaltate/shj-evaluate-question.entity';
import ShjEvaluateAnswerEntity from '../../../entities/base/evaltate/shj-evaluate-answer.entity';
import ShjGoodModelEntity from '../../../entities/base/good/shj-good-model.entity';
import { QuestionDto } from './evaluate-calculate.dto';
import { ApiException } from '../../../common/exceptions/api.exception';
import ShjEvaluateGoodModelOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-good-model-online.entity';
import { RedisService } from '../../../shared/services/redis.service';
import ShjGoodModelRecommendOnlineEntity from '../../../entities/base/evaltate/shj-good-model-recommend-online.entity';
import { isArray } from 'class-validator';

@Injectable()
export class EvaluateCalculateService {
  constructor(
    @InjectRepository(ShjEvaluateConfigAnswerOnlineEntity, 'base')
    private readonly shjEvaluateConfigAnswer: Repository<ShjEvaluateConfigAnswerOnlineEntity>,
    @InjectRepository(ShjEvaluateConfigOnlineEntity, 'base')
    private readonly shjEvaluateConfig: Repository<ShjEvaluateConfigOnlineEntity>,
    @InjectRepository(ShjEvaluateConfigQuestionOnlineEntity, 'base')
    private readonly shjEvaluateConfigQuestion: Repository<ShjEvaluateConfigQuestionOnlineEntity>,
    @InjectRepository(ShjEvaluateQuestionEntity, 'base')
    private readonly shjEvaluateQuestion: Repository<ShjEvaluateQuestionEntity>,
    @InjectRepository(ShjEvaluateAnswerEntity, 'base')
    private readonly shjEvaluateAnswer: Repository<ShjEvaluateAnswerEntity>,
    @InjectRepository(ShjGoodModelEntity, 'base')
    private readonly shjGoodModelEntity: Repository<ShjGoodModelEntity>,
    @InjectRepository(ShjEvaluateGoodModelOnlineEntity, 'base')
    private readonly shjEvaluateGoodModel: Repository<ShjEvaluateGoodModelOnlineEntity>,
    private redisService: RedisService,
    @InjectRepository(ShjGoodModelRecommendOnlineEntity, 'base')
    private readonly shjGoodRecommendModelEntity: Repository<ShjGoodModelRecommendOnlineEntity>,
  ) {}

  async calculatePrice(dto: QuestionDto, user: string) {
    const { modelId, questionList, isReplace } = dto;
    const questionSet = new Set();
    const answerSet = new Set();
    for (const i of questionList) {
      if (!isArray(i.answerIdList)) {
        throw new ApiException(30010);
      }
      if (questionSet.has(i.questionId)) {
        throw new ApiException(30007);
      }
      questionSet.add(i.questionId);
      for (const j of i.answerIdList) {
        if (answerSet.has(j)) {
          throw new ApiException(30008);
        }
        answerSet.add(j);
      }
    }
    const model = await this.shjEvaluateGoodModel.findOne({
      where: { modelId: modelId },
    });
    const modelInfo = await this.shjGoodModelEntity
      .createQueryBuilder('model')
      .where('model.id = :modelId', { modelId: modelId })
      .innerJoinAndSelect(
        'shj_good_brand',
        'brand',
        'brand.id = model.brand_id',
      )
      .getRawOne();
    const recommendModel = await this.shjGoodRecommendModelEntity.findOne({
      where: { modelId: modelId },
    });
    if (!model && !recommendModel) {
      // 型号不存在
      throw new ApiException(30002);
    }
    const modelConfig = await this.shjEvaluateConfig
      .createQueryBuilder('model')
      .where('model.model_id = :modelId', { modelId: modelId })
      .getOne();
    const minPrice = modelConfig.minPrice;
    let maxPrice = modelConfig.maxPrice;
    if (!maxPrice || !minPrice) {
      throw new ApiException(30009);
    }
    for (const i of questionList) {
      const configQuestion = await this.shjEvaluateConfigQuestion.findOne({
        where: { id: i.questionId },
      });
      if (!configQuestion) {
        throw new ApiException(30003);
      }
      if (configQuestion.configId !== modelConfig.id) {
        throw new ApiException(30004);
      }
      for (const j of i.answerIdList) {
        const configAnswer = await this.shjEvaluateConfigAnswer.findOne({
          where: { id: j },
        });
        if (!configAnswer) {
          throw new ApiException(30005);
        }
        const answer = await this.shjEvaluateAnswer.findOne({
          where: { id: configAnswer.answerId },
        });
        if (answer.questionId !== configQuestion.questionId) {
          throw new ApiException(30006);
        }
        if (configAnswer.configQuestionId !== configQuestion.id) {
          throw new ApiException(30006);
        }
        maxPrice -= configAnswer.configAnswerDeductMoney;
      }
    }
    maxPrice = maxPrice <= minPrice ? minPrice : maxPrice;
    const saveQuestionList = await Promise.all(
      questionList.map(async (item) => {
        const configQuestion = await this.shjEvaluateConfigQuestion.findOne({
          where: { id: item.questionId },
        });
        const question = await this.shjEvaluateQuestion.findOne({
          where: { id: configQuestion.questionId },
        });
        if (question.answerType === 0 && item.answerIdList.length !== 1) {
          throw new ApiException(30011);
        }
        const answerList = [];
        for (const i of item.answerIdList) {
          const configAnswer = await this.shjEvaluateConfigAnswer.findOne({
            where: { id: i },
          });
          const answer = await this.shjEvaluateAnswer.findOne({
            where: { id: configAnswer.answerId },
          });
          if (answer.isAllowRecovery === 0) {
            throw new ApiException(30012);
          }
          answerList.push({
            answerId: answer.id,
            answerName: answer.mainAnswer,
          });
        }
        return {
          question: {
            questionId: item.questionId,
            questionName: question.questionName,
          },
          answerList: answerList,
        };
      }),
    );
    const redisEvaluateInfo = {
      modelName: `${modelInfo.brand_brand_name} ${modelInfo.model_model_name}`,
      modelId: modelInfo.model_id,
      modelImg: modelInfo.model_model_img,
      recoveryPrice: maxPrice,
      questionList: saveQuestionList,
    };
    if (isReplace) {
      await this.redisService
        .getRedis()
        .set(
          `calculatePrice:isReplace:userUid:${user}`,
          JSON.stringify(redisEvaluateInfo),
          'EX',
          60 * 60 * 24,
        );
    } else {
      await this.redisService
        .getRedis()
        .set(
          `calculatePrice:userUid:${user}`,
          JSON.stringify(redisEvaluateInfo),
          'EX',
          60 * 60 * 24,
        );
    }

    return maxPrice;
  }
}
