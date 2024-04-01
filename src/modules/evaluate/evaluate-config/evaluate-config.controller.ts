import { Controller, Get, Query } from '@nestjs/common';
import { EvaluateConfigService } from './evaluate-config.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchModelEvaluateConfig } from './evaluate-config.dto';
@ApiTags('型号对应问题模块')
@Controller('evaluate-question')
export class EvaluateConfigController {
  constructor(private readonly evaluateGoodService: EvaluateConfigService) {}

  @ApiOperation({ summary: '查询型号对应配置问题以及答案' })
  @Get('getModelEvaluateConfig')
  async getModelEvaluateConfig(@Query() dto: SearchModelEvaluateConfig) {
    return this.evaluateGoodService.getModelEvaluateConfig(dto);
  }
}
