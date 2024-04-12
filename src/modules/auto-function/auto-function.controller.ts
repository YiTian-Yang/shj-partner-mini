import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AutoCreatePurchaseDto } from './auto-function.dto';
import { AutoFunctionService } from './auto-function.service';

@ApiTags('自动创建任务')
@Controller('/auto-function')
export class AutoFunctionController {
  constructor(private readonly autoFunctionService: AutoFunctionService) {}

  @ApiOperation({ summary: '创建入库单' })
  @Post('autoCreatePurchase')
  async autoCreatePurchase(@Body() dto: AutoCreatePurchaseDto): Promise<any> {
    return await this.autoFunctionService.autoCreatePurchase(dto);
  }
}
