import { Injectable } from '@nestjs/common';
import { SearchModelEvaluateConfig } from './evaluate-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ShjEvaluateConfigAnswerOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-config-answer-online.entity';
import ShjEvaluateConfigOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-config-online.entity';
import ShjEvaluateConfigQuestionOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-config-question-online.entity';
import ShjEvaluateQuestionEntity from '../../../entities/base/evaltate/shj-evaluate-question.entity';
import ShjEvaluateAnswerEntity from '../../../entities/base/evaltate/shj-evaluate-answer.entity';
import ShjGoodModelEntity from '../../../entities/base/good/shj-good-model.entity';
import { ApiException } from '../../../common/exceptions/api.exception';
import ShjEvaluateGoodModelOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-good-model-online.entity';
import ShjGoodModelRecommendOnlineEntity from '../../../entities/base/evaltate/shj-good-model-recommend-online.entity';
import { RedisService } from '../../../shared/services/redis.service';

@Injectable()
export class EvaluateConfigService {
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
    @InjectRepository(ShjGoodModelRecommendOnlineEntity, 'base')
    private readonly shjGoodRecommendModelEntity: Repository<ShjGoodModelRecommendOnlineEntity>,
    private redisService: RedisService,
  ) {}

  // 查询型号对应配置问题以及答案
  async getModelEvaluateConfig(dto: SearchModelEvaluateConfig) {
    const modelId = dto.modelId;
    const redisConfig = await this.redisService
      .getRedis()
      .get(`evaluateConfig:modelId:${modelId}`);
    if (redisConfig) {
      return JSON.parse(redisConfig);
    }
    const model = await this.shjEvaluateGoodModel.findOne({
      where: { modelId: Number(modelId) },
    });
    const recommendModel = await this.shjGoodRecommendModelEntity.findOne({
      where: { modelId: Number(modelId) },
    });
    if (!model && !recommendModel) {
      // 型号不存在
      throw new ApiException(30002);
    }
    const modelInfo = await this.shjGoodModelEntity
      .createQueryBuilder('model')
      .where('model.id = :modelId', { modelId: modelId })
      .innerJoinAndSelect(
        'shj_good_brand',
        'brand',
        'brand.id = model.brand_id',
      )
      .getRawOne();
    if (!modelInfo) {
      throw new ApiException(30002);
    }
    const configId = await this.shjEvaluateConfig
      .createQueryBuilder('config')
      .where('config.model_id = :modelId', { modelId: modelId })
      .select(['config.id'])
      .getOne();
    const questionList = await this.shjEvaluateConfigQuestion
      .createQueryBuilder('question')
      .where('question.config_id = :configId', { configId: configId.id })
      .orderBy('question.configQuestionSort', 'ASC')
      .select([
        'question.id',
        'question.questionId',
        'question.configQuestionDescription',
        'question.configQuestionSort',
      ])
      .getMany();
    const result = await Promise.all(
      questionList.map(async (item) => {
        const answerList = await this.shjEvaluateConfigAnswer
          .createQueryBuilder('answer')
          .where('answer.config_question_id = :configQuestionId', {
            configQuestionId: item.id,
          })
          .orderBy('id', 'ASC')
          .select([
            'answer.answerId',
            'answer.configAnswerDescription',
            'answer.nextConfigQuestionSortId',
            'answer.isDirectFinish',
            'answer.id',
            'answer.configQuestionId',
          ])
          .getMany();
        const question = await this.shjEvaluateQuestion
          .createQueryBuilder('question')
          .where('id = :questionId', { questionId: item.questionId })
          .select(['question.questionName', 'question.answerType'])
          .getOne();
        const answerResult = [];
        for (const i of answerList) {
          const answerInfo = await this.shjEvaluateAnswer
            .createQueryBuilder('answer')
            .where('id = :answerId', { answerId: i.answerId })
            .select([
              'answer.mainAnswer',
              'answer.secondaryAnswer',
              'answer.isAllowRecovery',
            ])
            .getOne();
          const nextQuestionSort = await this.shjEvaluateConfigQuestion
            .createQueryBuilder()
            .where('id = :nextConfigQuestionSortId', {
              nextConfigQuestionSortId: i.nextConfigQuestionSortId,
            })
            .getOne();
          const newItem = JSON.parse(JSON.stringify(i));
          newItem.id = undefined;
          newItem.nextConfigQuestionSortId = undefined;
          answerResult.push({
            ...newItem,
            answerId: i.id,
            mainAnswer: answerInfo.mainAnswer,
            secondaryAnswer: answerInfo.secondaryAnswer,
            isAllowRecovery: answerInfo.isAllowRecovery,
            nextQuestionSortId: nextQuestionSort ? nextQuestionSort.id : null,
            nextQuestionSort: nextQuestionSort
              ? nextQuestionSort.configQuestionSort
              : null,
          });
        }
        const newItem = JSON.parse(JSON.stringify(item));
        newItem.questionId = item.id;
        newItem.id = undefined;
        return {
          questionName: question.questionName,
          answerType: question.answerType,
          ...newItem,
          answerList: answerResult,
        };
      }),
    );
    const configObj = {
      list: result,
      modelInfo: {
        modelName: `${modelInfo.brand_brand_name} ${modelInfo.model_model_name}`,
        modelId: modelInfo.model_id,
        modelImg: modelInfo.model_model_img,
      },
    };
    await this.redisService
      .getRedis()
      .set(
        `evaluateConfig:modelId:${modelInfo.model_id}`,
        JSON.stringify(configObj),
      );
    return {
      list: result,
      modelInfo: {
        modelName: `${modelInfo.brand_brand_name} ${modelInfo.model_model_name}`,
        modelId: modelInfo.model_id,
        modelImg: modelInfo.model_model_img,
      },
    };
  }
}
