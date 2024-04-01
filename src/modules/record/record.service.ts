import { Injectable } from '@nestjs/common';
import { RedisService } from '../../shared/services/redis.service';

@Injectable()
export class RecordService {
  constructor(private redisService: RedisService) {}

  async getExpressRecord() {
    const expressRecord: [] = JSON.parse(
      await this.redisService.getRedis().get('record::express'),
    );
    return expressRecord.sort(() => Math.random() - 0.5).slice(0, 50);
  }

  async getRecycleRecord() {
    const recycleRecord = JSON.parse(
      await this.redisService.getRedis().get('record::recycle'),
    );
    return recycleRecord.sort(() => Math.random() - 0.5).slice(0, 50);
  }
}
