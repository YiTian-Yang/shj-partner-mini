import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { EvaluateGoodService } from './evaluate-good.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  SearchAllBrandDto,
  SearchLocalModelDto,
  SearchModelByPageDto,
  SearchModelDto,
} from './evlauate-good.dto';

@ApiTags('商品模块')
@Controller('evaluate-good')
export class EvaluateGoodController {
  constructor(private readonly evaluateGoodService: EvaluateGoodService) {}

  @ApiOperation({ summary: '查询类目下所有品牌' })
  @Get('getAllBrand')
  async getAllBrand(@Query() dto: SearchAllBrandDto) {
    return this.evaluateGoodService.findAllBrand(dto);
  }

  @ApiOperation({ summary: '查询所有类目' })
  @Get('getAllType')
  async getAllType() {
    return this.evaluateGoodService.findAllType();
  }

  @ApiOperation({ summary: '分页查询品牌下的型号' })
  @Get('getModelByPage')
  async getModelByPage(@Query() dto: SearchModelByPageDto) {
    const { list, total } = await this.evaluateGoodService.findModelByPage(dto);
    return {
      list,
      pagination: {
        size: dto.limit,
        page: dto.page,
        total,
      },
    };
  }

  @ApiOperation({ summary: '查询所有推荐型号' })
  @Get('getRecommendModelAll')
  async getRecommendModelAll() {
    return await this.evaluateGoodService.getRecommendModelAll();
  }

  @ApiOperation({ summary: '查询本机型号对应型号' })
  @Get('getModelByLocalName')
  async getModelByLocalName(@Query() dto: SearchLocalModelDto) {
    return await this.evaluateGoodService.getModelByLocalName(dto);
  }

  @ApiOperation({ summary: '查询型号旧机回收' })
  @Post('getModelName')
  async getModelName(@Body() dto: SearchModelDto) {
    const { list, total } = await this.evaluateGoodService.getModelName(dto);
    return {
      list,
      pagination: {
        size: dto.limit,
        page: dto.page,
        total,
      },
    };
  }
}
