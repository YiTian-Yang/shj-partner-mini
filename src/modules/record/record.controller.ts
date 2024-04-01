import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecordService } from './record.service';

@ApiTags('记录模块')
@Controller('record')
export class RecordController {
  constructor(private recordService: RecordService) {}

  @ApiOperation({ summary: '查询快递回收记录' })
  @Get('getExpressRecord')
  async getExpressRecord() {
    return await this.recordService.getExpressRecord();
  }

  @ApiOperation({ summary: '查询回收记录' })
  @Get('getRecycleRecord')
  async getRecycleRecord() {
    return await this.recordService.getRecycleRecord();
  }
}
