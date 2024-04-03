import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { AUTHORIZE_KEY_METADATA } from 'src/common/contants/decorator.contants';
import { ApiException } from 'src/common/exceptions/api.exception';
import { RedisService } from 'src/shared/services/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import ShjPartner from '../entities/partner/partner/shj-partner.entity';
import { Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import { PartnerService } from '../modules/partner/partner.service';
@Injectable()
export class PartnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private redisService: RedisService,
    private partnerService: PartnerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检测是否是开放类型的，例如获取验证码类型的接口不需要校验，可以加入@Authorize可自动放过
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    // const url = request.url;
    // 检测是否是开放类型的，例如获取验证码类型的接口不需要校验，可以加入@Authorize可自动放过
    const authorize = this.reflector.get<boolean>(
      AUTHORIZE_KEY_METADATA,
      context.getHandler(),
    );
    if (authorize) {
      return true;
    }
    const key = request.headers['partner-key'] as string;
    if (isEmpty(key)) {
      throw new ApiException(11001);
    }
    const partnerInfo = await this.partnerService.getPartnerInfo(key);
    if (isEmpty(partnerInfo)) {
      throw new ApiException(11001);
    }
    return true;
  }
}
