import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './login-dto';
import { UtilService } from 'src/shared/services/util.service';
import { PlatformService } from './platform/platform.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/shared/services/redis.service';
import ShjMiniProgramList from 'src/entities/partner/user/shj-mini-program-list.entity';
import ShjPlatformUser from 'src/entities/partner/user/shj-platform-user.entity';
import { ApiException } from 'src/common/exceptions/api.exception';
import { PartnerService } from '../partner/partner.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(ShjMiniProgramList, 'partner')
    private readonly shjPlatformList: Repository<ShjMiniProgramList>,
    @InjectRepository(ShjPlatformUser, 'partner')
    private readonly shjPlatformUser: Repository<ShjPlatformUser>,
    private utilsService: UtilService,
    private platformService: PlatformService,
    private redisService: RedisService,
    private jwtService: JwtService,
    private partnerService: PartnerService,
  ) {}
  // 处理小程序登录
  async login(channel: string, loginDto: LoginDto) {
    let result;
    if (channel && channel.length) {
      result = await this.platformService[channel + 'Login'](loginDto);
    }
    return result;
  }

  // 手机号登录处理
  async loginWithPhone(loginWithPhoneDto, header) {
    console.log('phoneNumberDto', loginWithPhoneDto);
    let userInfo;
    if (loginWithPhoneDto.channel === 'weixin') {
      const channel = '微信';
      const res = await this.platformService.wx_loginWithPhone(
        loginWithPhoneDto.code,
      );
      // if (res.phone_info && res.phone_info.phoneNumber) {
      //   userInfo = await this.userRegister(
      //     res.phone_info.phoneNumber,
      //     channel,
      //     loginWithPhoneDto,
      //   );
      // }
    } else if (loginWithPhoneDto.channel === 'alipay') {
      const channel = '支付宝';
      const res = await this.platformService.ali_loginWithPhone(
        loginWithPhoneDto.code,
      );
      if (res && res.length) {
        userInfo = await this.userRegister(
          res,
          channel,
          header['partner-key'],
          loginWithPhoneDto,
        );
      }
    }
    if (userInfo && userInfo.userId) {
      const jwtSign = this.jwtService.sign({
        uid: userInfo.userId.toString(),
      });
      // Token设置过期时间 24小时
      await this.redisService
        .getRedis()
        .set(
          `${loginWithPhoneDto.channel}:user:token:${userInfo.userId}`,
          jwtSign,
        );
      return { token: jwtSign, ...userInfo };
    }
    throw new ApiException(11005);
  }

  // 用户注册
  async userRegister(
    phoneNumber: string,
    channel: string,
    partnerKey: string,
    loginWithPhoneDto,
  ) {
    const userInfo = await this.shjPlatformUser.findOne({
      where: {
        userPhone: phoneNumber,
      },
      select: ['userId', 'userPhone', 'registrationChannel'],
    });
    // 已注册直接返回用户信息
    if (userInfo && userInfo.userId) {
      // 查询当前平台信息是否存在  不存在保存至数据库
      const platform = await this.shjPlatformList.find({
        where: {
          parentId: userInfo.userId,
          // openId: loginWithPhoneDto.openid,
          platform: channel,
        },
      });
      if (!platform.length) {
        await this.createPlatformInfo(
          channel,
          loginWithPhoneDto,
          userInfo.userId,
        );
      }
      return userInfo;
    }
    const user = new ShjPlatformUser();
    user.userId = this.utilsService.generateRandomValue(
      20,
      '1234567890abcdefg',
    );
    const partnerInfo = await this.partnerService.getPartnerInfo(partnerKey);
    user.registrationChannel = channel;
    user.userPhone = phoneNumber;
    user.partnerId = partnerInfo.id;
    const result = await this.shjPlatformUser.save(user);
    await this.createPlatformInfo(channel, loginWithPhoneDto, user.userId);
    return {
      userId: result.userId,
      userPhone: result.userPhone,
      registrationChannel: result.registrationChannel,
    };
  }
  // 插入用户平台信息
  async createPlatformInfo(channel: string, platformInfo, parentId: string) {
    const channelInfo = new ShjMiniProgramList();
    channelInfo.openId = platformInfo.openid;
    channelInfo.unionId = platformInfo.unionid;
    channelInfo.platform = channel;
    channelInfo.parentId = parentId;
    return await this.shjPlatformList.save(channelInfo);
  }

  // 退出登录
  async logOut(headers) {
    const tokenInfo = await this.jwtService.verify(headers.token);
    console.log(tokenInfo);
    // 清除token缓存
    await this.redisService
      .getRedis()
      .del(`${headers.channel}:user:token:${tokenInfo.uid}`);
  }

  // 线上取token
  async getWxTokenOnline() {
    const data = await this.platformService.getWxAccessToken();
    return data;
  }
}
