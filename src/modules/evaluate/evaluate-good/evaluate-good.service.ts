import { Injectable } from '@nestjs/common';
import {
  SearchAllBrandDto,
  SearchLocalModelDto,
  SearchModelByPageDto,
  SearchModelDto,
} from './evlauate-good.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, ILike } from 'typeorm';
import ShjGoodBrandEntity from '../../../entities/base/good/shj-good-brand.entity';
import ShjGoodModelEntity from '../../../entities/base/good/shj-good-model.entity';
import ShjGoodTypeEntity from 'src/entities/base/good/shj-good-type.entity';
import ShjGoodPinyinBrandEntity from 'src/entities/base/good/shj-good-pinyin-brand.entity';
import ShjGoodPinyinModelEntity from 'src/entities/base/good/shj-good-pinyin-model.entity';
import ShjGoodPinyinTypeEntity from 'src/entities/base/good/shj-good-pinyin-type.entity';
import ShjEvaluateConfigOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-config-online.entity';
import ShjEvaluateGoodBrandOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-good-brand-online.entity';
import ShjEvaluateGoodModelOnlineEntity from '../../../entities/base/evaltate/shj-evaluate-good-model-online.entity';
import ShjGoodModelRecommendOnlineEntity from '../../../entities/base/evaltate/shj-good-model-recommend-online.entity';
import { pinyin } from 'pinyin-pro';

@Injectable()
export class EvaluateGoodService {
  constructor(
    @InjectRepository(ShjGoodBrandEntity, 'base')
    private readonly shjGoodBrand: Repository<ShjGoodBrandEntity>,
    @InjectRepository(ShjGoodPinyinBrandEntity, 'base')
    private readonly goodPinyinBrand: Repository<ShjGoodPinyinBrandEntity>,
    @InjectRepository(ShjGoodPinyinModelEntity, 'base')
    private readonly goodPinyinModel: Repository<ShjGoodPinyinModelEntity>,
    @InjectRepository(ShjGoodPinyinTypeEntity, 'base')
    private readonly goodPinyinType: Repository<ShjGoodPinyinTypeEntity>,
    @InjectRepository(ShjGoodTypeEntity, 'base')
    private readonly shjGoodType: Repository<ShjGoodTypeEntity>,
    @InjectRepository(ShjGoodModelEntity, 'base')
    private readonly shjGoodModel: Repository<ShjGoodModelEntity>,
    @InjectRepository(ShjEvaluateConfigOnlineEntity, 'base')
    private readonly shjEvaluateConfig: Repository<ShjEvaluateConfigOnlineEntity>,
    @InjectRepository(ShjEvaluateGoodBrandOnlineEntity, 'base')
    private readonly shjEvaluateGoodBrand: Repository<ShjEvaluateGoodBrandOnlineEntity>,
    @InjectRepository(ShjEvaluateGoodModelOnlineEntity, 'base')
    private readonly shjEvaluateGoodModel: Repository<ShjEvaluateGoodModelOnlineEntity>,
    @InjectRepository(ShjGoodModelRecommendOnlineEntity, 'base')
    private readonly shjGoodModelRecommend: Repository<ShjGoodModelRecommendOnlineEntity>,
  ) {}
  // 查询类目下所有品牌 并且以估价品牌表的顺序返回
  async findAllBrand(dto: SearchAllBrandDto) {
    const allBrand = await this.shjEvaluateGoodBrand
      .createQueryBuilder('good_brand')
      .where('good_brand.type_id = :typeId', { typeId: dto.typeId })
      .orderBy('good_brand.brand_sort', 'ASC')
      .getMany();
    const brandResult = [];
    for (const brand of allBrand) {
      const brandInfo = await this.shjGoodBrand
        .createQueryBuilder()
        .where('id = :brandId', { brandId: brand.brandId })
        .getOne();
      brandResult.push({
        brandId: brand.brandId,
        brandName: brandInfo.brandName,
      });
    }
    return brandResult;
  }

  // 查询所有类目
  async findAllType() {
    const allType = await this.shjGoodType.find();
    const typeResult = [];
    for (const type of allType) {
      typeResult.push({
        id: type.id,
        typeName: type.typename,
      });
    }
    return typeResult;
  }

  // 分页查询品牌下的型号 并且带出最高价和最低价 以估价型号表的顺序返回
  async findModelByPage(dto: SearchModelByPageDto) {
    const { limit, page, brandId, typeId } = dto;
    if (brandId !== '0') {
      const total = await this.shjGoodModel
        .createQueryBuilder('model')
        .innerJoin(
          'shj_evaluate_good_model_online',
          'evaluate_model',
          'evaluate_model.model_id = model.id',
        )
        .innerJoin(
          'shj_evaluate_config_online',
          'config',
          'config.model_id = model.id',
        )
        .andWhere('model.brand_id = :brandId', { brandId })
        .andWhere('model.type_id = :typeId', { typeId })
        .getCount();
      const models = await this.shjGoodModel
        .createQueryBuilder('model')
        .innerJoinAndSelect(
          'shj_evaluate_good_model_online',
          'evaluate_model',
          'evaluate_model.model_id = model.id',
        )
        .innerJoinAndSelect(
          'shj_good_brand',
          'brand',
          'brand.id = model.brand_id',
        )
        .innerJoinAndSelect(
          'shj_evaluate_config_online',
          'config',
          'config.model_id = model.id',
        )
        .andWhere('brand.id = :brandId', { brandId })
        .andWhere('model.type_id = :typeId', { typeId })
        .offset((page - 1) * limit)
        .limit(limit)
        .orderBy('evaluate_model.model_sort', 'ASC')
        .select([
          'model.id',
          'config.max_price',
          'model.model_img',
          'brand.brand_name',
          'model.model_name',
        ])
        .getRawMany();
      const result = models.map((item) => {
        return {
          modelId: item['model_id'],
          maxPrice: parseInt(item['max_price']),
          modelImg: item['model_img'],
          modelName: `${item['brand_name']} ${item['model_name']}`,
        };
      });
      return {
        list: result,
        total,
      };
      // brandId为0 则查推荐表
    } else {
      const total = await this.shjGoodModel
        .createQueryBuilder('model')
        .innerJoin(
          'shj_good_model_recommend_online',
          'recommend',
          'recommend.model_id = model.id',
        )
        .innerJoin(
          'shj_evaluate_config_online',
          'config',
          'config.model_id = model.id',
        )
        .andWhere('model.type_id = :typeId', { typeId })
        .getCount();
      const models = await this.shjGoodModel
        .createQueryBuilder('model')
        .innerJoinAndSelect(
          'shj_good_model_recommend_online',
          'recommend',
          'recommend.model_id = model.id',
        )
        .innerJoinAndSelect(
          'shj_good_brand',
          'brand',
          'brand.id = model.brand_id',
        )
        .innerJoinAndSelect(
          'shj_evaluate_config_online',
          'config',
          'config.model_id = model.id',
        )
        .andWhere('model.type_id = :typeId', { typeId })
        .offset((page - 1) * limit)
        .limit(limit)
        .orderBy('recommend.recommend_sort', 'ASC')
        .select([
          'model.id',
          'config.max_price',
          'model.model_img',
          'brand.brand_name',
          'model.model_name',
        ])
        .getRawMany();
      const result = models.map((item) => {
        return {
          modelId: item['model_id'],
          maxPrice: parseInt(item['max_price']),
          modelImg: item['model_img'],
          modelName: `${item['brand_name']} ${item['model_name']}`,
        };
      });
      return {
        list: result,
        total,
      };
    }
  }

  // 获取本机 根据前端传过来的型号码（不是真实名称） 匹配本机 精准匹配
  async getModelByLocalName(dto: SearchLocalModelDto) {
    const modelName = dto.modelName;
    let modelResult;
    let precisionModel;
    if (modelName.includes('iPhone')) {
      modelResult = await this.getIPhoneName(modelName);
      precisionModel = await this.shjGoodModel
        .createQueryBuilder('model')
        .innerJoinAndSelect(
          'shj_evaluate_config_online',
          'config',
          'config.model_id = model.id',
        )
        .innerJoinAndSelect(
          'shj_good_brand',
          'brand',
          'brand.id = model.brand_id',
        )
        .where('model.model_name = :modelName', {
          modelName: modelResult,
        })
        .getRawOne();
    } else if (modelName.includes('Redmi')) {
      modelResult = await this.getRedmi(modelName);
      precisionModel = await this.shjGoodModel
        .createQueryBuilder('model')
        .innerJoinAndSelect(
          'shj_evaluate_config_online',
          'config',
          'config.model_id = model.id',
        )
        .innerJoinAndSelect(
          'shj_good_brand',
          'brand',
          'brand.id = model.brand_id',
        )
        .where(
          "CONCAT(brand.brand_name, ' ', model.model_name) LIKE :modelName",
          {
            modelName: modelResult,
          },
        )
        .getRawOne();
    } else if (modelName.includes('Xiaomi')) {
      modelResult = await this.getXiaomi(modelName);
      precisionModel = await this.shjGoodModel
        .createQueryBuilder('model')
        .innerJoinAndSelect(
          'shj_evaluate_config_online',
          'config',
          'config.model_id = model.id',
        )
        .innerJoinAndSelect(
          'shj_good_brand',
          'brand',
          'brand.id = model.brand_id',
        )
        .where("CONCAT(brand.brand_name, ' ', model.model_name) = :modelName", {
          modelName: modelResult,
        })
        .getRawOne();
    }
    if (precisionModel) {
      const model = await this.shjEvaluateGoodModel.findOne({
        where: { modelId: precisionModel.model_id },
      });
      if (!model) {
        const recommendedModel = await this.shjGoodModelRecommend.findOne({
          where: { modelId: precisionModel.model_id },
        });
        if (!recommendedModel) {
          return null;
        }
      }
      return {
        maxPrice: parseInt(precisionModel.config_max_price),
        modelId: precisionModel.model_id,
        modelName: `${precisionModel.brand_brand_name} ${precisionModel.model_model_name}`,
        modelImg: precisionModel.model_model_img,
      };
    }
    return null;
    // return precisionModel || null;
  }

  async getRecommendModelAll() {
    const result = await this.shjGoodModelRecommend
      .createQueryBuilder('recommend')
      .innerJoinAndSelect(
        'shj_good_model',
        'model',
        'model.id = recommend.model_id',
      )
      .innerJoin('shj_good_brand', 'brand', 'brand.id = model.brand_id')
      .innerJoin(
        'shj_evaluate_config_online',
        'config',
        'config.model_id = model.id',
      )
      .select('model.model_name')
      .addSelect('brand.brand_name')
      .orderBy('recommend.recommend_sort', 'ASC')
      .andWhere('model.type_id = 1 OR model.type_id = 2')
      .getRawMany();
    return result.map((item) => {
      return {
        modelName: `${item['brand_name']} ${item['model_name']}`,
      };
    });
  }
  // 搜索型号
  async getModelName(dto: SearchModelDto) {
    const { modelName, limit, page } = dto; // 中文文本
    let pinyinString = pinyin(modelName, { toneType: 'none', type: 'array' })
      .join('')
      .toLowerCase()
      .replace(/\s/g, '');

    let newPinyinString;
    let twoPinyinString;
    const typeList = await this.goodPinyinType.find();
    const brandList = await this.goodPinyinBrand.find();
    let typeId;
    let typeText;
    let brandId;
    let brandText;
    //获取型号id
    const type = await this.getId(typeList, pinyinString, 'type');

    if (type) {
      typeId = type.id;
      typeText = type.text;
      twoPinyinString = pinyinString;
      for (let i = 0; i < pinyinString.length; i++) {
        pinyinString = await this.modifyString(pinyinString, typeText);
      }
    }

    const brand = await this.getId(brandList, pinyinString, 'brand');

    if (brand) {
      brandId = brand.id;
      brandText = brand.text;
      newPinyinString = pinyinString;
      for (let i = 0; i < pinyinString.length; i++) {
        pinyinString = await this.modifyString(pinyinString, brandText);
      }
    }

    if (!pinyinString) {
      let whereSql = '';
      const where: any = {};

      if (typeId) {
        whereSql += 'model.type_id = :typeId';
        where.typeId = typeId;
      }

      if (brandId) {
        if (whereSql) {
          whereSql += ' AND ';
        }
        whereSql += 'model.brand_id = :brandId';
        where.brandId = brandId;
      }
      const [modelList, total] = await Promise.all([
        this.shjGoodModel
          .createQueryBuilder('model')
          .innerJoinAndSelect(
            'shj_evaluate_config_online',
            'config',
            'config.model_id = model.id',
          )
          .innerJoinAndSelect(
            'shj_evaluate_good_model_online',
            'evaluate',
            'evaluate.model_id = model.id',
          )
          .where(whereSql, where)
          .orderBy('config.maxPrice', 'DESC')
          .take(limit)
          .skip((page - 1) * limit)
          .getMany(),
        this.shjGoodModel
          .createQueryBuilder('model')
          .innerJoinAndSelect(
            'shj_evaluate_config_online',
            'config',
            'config.model_id = model.id',
          )
          .innerJoinAndSelect(
            'shj_evaluate_good_model_online',
            'evaluate',
            'evaluate.model_id = model.id',
          )
          .where(whereSql, where)
          .getCount(), // 获取总记录数
      ]);
      const modelsResult = await Promise.all(
        modelList.map(async (item) => {
          const modelPrice = await this.shjEvaluateConfig
            .createQueryBuilder('config')
            .where('config.model_id = :id', { id: item.id })
            .getOne();

          return {
            ...item,
            maxPrice: parseInt(String(modelPrice.maxPrice)),
          };
        }),
      );

      const brandResult = await Promise.all(
        modelsResult.map(async (item) => {
          const brand = await this.shjGoodBrand
            .createQueryBuilder('brand')
            .where('brand.id = :id', { id: item.brandId })
            .getOne();

          return {
            ...item,
            modelId: item.id,
            brandName: String(brand.brandName),
          };
        }),
      );
      return {
        list: brandResult,
        total,
      };
    } else {
      newPinyinString = newPinyinString ? newPinyinString : pinyinString;

      // 初始化 WHERE 子句
      let whereSql = `model.pinyin_name LIKE :pinyinString`;

      // 构建条件
      const conditions = [];

      if (typeId) {
        conditions.push(`model.type_id = :modelId`);
      }

      if (brandId) {
        conditions.push(`model.brand_id = :brandId`);
      }

      // 如果有其他条件，也可以继续添加

      // 将条件连接到 WHERE 子句
      if (conditions.length > 0) {
        whereSql += ` AND ${conditions.join(' AND ')}`;
      }

      const one = await this.goodPinyinModel.findOne({
        where: { pinyinName: newPinyinString },
      });

      let results;
      results = await this.goodPinyinModel
        .createQueryBuilder('model')
        .innerJoinAndSelect(
          'shj_evaluate_config_online',
          'config',
          'config.model_id = model.id',
        )
        .where(whereSql, {
          pinyinString: `%${newPinyinString}%`,
          modelId: typeId,
          brandId: brandId,
        })
        .orderBy('config.maxPrice', 'DESC')
        .take(limit)
        .skip((page - 1) * limit)
        .getMany();

      if (results.length === 0) {
        results = await this.goodPinyinModel
          .createQueryBuilder('model')
          .where(whereSql, {
            pinyinString: `%${twoPinyinString}%`,
            modelId: typeId,
            brandId: brandId,
          })
          .take(limit)
          .skip((page - 1) * limit)
          .getMany();
      }

      if (results.length === 0) {
        results = await this.goodPinyinModel
          .createQueryBuilder('model')
          .where(whereSql, {
            pinyinString: `%${pinyinString}%`,
            modelId: typeId,
            brandId: brandId,
          })
          .take(limit)
          .skip((page - 1) * limit)
          .getMany();
      }

      const idList = results.map((item) => {
        return item.modelId;
      });

      if (idList && idList.length > 0) {
        const models = await this.shjGoodModel
          .createQueryBuilder('model')
          .innerJoinAndSelect(
            'shj_evaluate_config_online',
            'config',
            'config.model_id = model.id',
          )
          .innerJoinAndSelect(
            'shj_evaluate_good_model_online',
            'evaluate',
            'evaluate.model_id = model.id',
          )
          .where('model.id IN (:idList) ', {
            idList,
          })
          .orderBy('config.maxPrice', 'DESC')
          .take(limit)
          .skip((page - 1) * limit)
          .getMany();
        //把最匹配度最高调高
        let newData;
        if (one) {
          const obj = await this.shjGoodModel
            .createQueryBuilder('model')
            .innerJoinAndSelect(
              'shj_evaluate_config_online',
              'config',
              'config.model_id = model.id',
            )
            .innerJoinAndSelect(
              'shj_evaluate_good_model_online',
              'evaluate',
              'evaluate.model_id = model.id',
            )
            .where({
              id: one.modelId,
            })
            .getOne();

          newData = models.filter((item, index, array) => {
            return (
              array.findIndex((element) => element.id === item.id) === index
            );
          });
          if (obj) {
            // 查找 obj 在 newData 中的索引，如果找不到就返回 -1
            const objIndex = newData.findIndex(
              (element) => element.id === obj.id,
            );

            if (objIndex !== -1) {
              // 如果 obj 已经存在于 newData 中，就先删除它
              newData.splice(objIndex, 1);
            }

            // 将 obj 插入到 newData 数组的开头
            newData.unshift(obj);
          }
        } else {
          const uniqueModelIds = new Set(); // 使用Set来存储唯一的modelId值
          newData = [];
          for (const item of models) {
            if (!uniqueModelIds.has(item.id)) {
              uniqueModelIds.add(item.id); // 将modelId添加到Set中，确保唯一
              newData.push(item); // 仅保留第一个具有每个唯一modelId值的对象
            }
          }
        }

        const modelsResult = await Promise.all(
          newData.map(async (item) => {
            const modelPrice = await this.shjEvaluateConfig
              .createQueryBuilder('config')
              .where('config.model_id = :id', { id: item.id })
              .getOne();
            return {
              ...item,
              maxPrice: parseInt(String(modelPrice.maxPrice)),
            };
          }),
        );
        const brandResult = await Promise.all(
          modelsResult.map(async (item) => {
            const brand = await this.shjGoodBrand
              .createQueryBuilder('brand')
              .where('brand.id = :id', { id: item.brandId })
              .getOne();

            return {
              ...item,
              modelId: item.id,
              brandName: String(brand.brandName),
            };
          }),
        );
        // const newData = await brandList.map(item=>{

        // })
        const results = await this.goodPinyinModel
          .createQueryBuilder('model')
          .innerJoin(
            'shj_evaluate_config_online',
            'config',
            'config.model_id = model.id',
          )
          .innerJoinAndSelect(
            'shj_evaluate_good_model_online',
            'evaluate',
            'evaluate.model_id = model.id',
          )
          .where(`model.pinyin_name LIKE  :pinyinString `, {
            pinyinString: `%${newPinyinString}%`,
          })
          .getCount();
        return {
          list: brandResult,
          total: results < 10 ? brandResult.length : results,
        };
      } else {
        return {
          list: [],
          total: 0,
        };
      }
    }
  }

  // 获取苹果系列手机真实名称
  async getIPhoneName(modelName: string) {
    if (modelName.indexOf('<') != -1) {
      return modelName.substring(0, modelName.indexOf('<'));
    } else {
      return modelName;
    }
  }

  // 获取小米系列手机真实名称
  async getXiaomi(modelName: string) {
    return `${modelName.replace('Xiaomi', '小米')}`;
    // return `%${modelName.replace('Xiaomi', '小米').replace(/\s/g, '')}%`;
  }

  // 获取红米系列手机真实名称
  async getRedmi(modelName: string) {
    return `${modelName.replace('Xiaomi Redmi', '红米')}`;
    // return `%${modelName.replace('Xiaomi', '小米').replace(/\s/g, '')}%`;
  }
  //获取对应Id
  async getId(list, pinyinString, type) {
    for (let i = 0; i < list.length; i++) {
      if (pinyinString.includes(list[i].pinyinName)) {
        return {
          id: list[i][`${type}Id`],
          text: list[i].pinyinName,
        };
      }
    }
  }
  //生成删除正则
  async modifyString(inputString, excludeWord) {
    const regex = new RegExp(`${excludeWord}(.*)`, 'g');

    const modifiedString = inputString.replace(
      regex,
      (match, capturedGroup) => {
        return capturedGroup;
      },
    );

    return modifiedString;
  }

  //抽离字符串中的数字
  async extractNumbersFromString(inputString) {
    // 使用正则表达式匹配数字
    const numbers = inputString.match(/\d+/g);

    // 如果没有匹配到数字，返回一个空数组
    if (numbers === null) {
      return [];
    }

    // 将匹配到的数字字符串转换为数字类型
    const numericValues = numbers.map(Number);

    return numericValues;
  }

  async uniqueArrayByProperty(arr, prop) {
    const uniqueMap = new Map();
    const result = [];

    for (const item of arr) {
      const key = item[prop];
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }

    for (const uniqueItem of uniqueMap.values()) {
      result.push(uniqueItem);
    }

    return result;
  }
}
