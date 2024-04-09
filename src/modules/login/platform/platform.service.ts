import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { alipaySdk, WxConfig } from 'src/config/configuration';
import { LoginDto } from '../login-dto';
import { RedisService } from 'src/shared/services/redis.service';
import { UtilService } from 'src/shared/services/util.service';
import { ApiException } from 'src/common/exceptions/api.exception';

@Injectable()
export class PlatformService {
  constructor(
    private redisService: RedisService,
    private utilsService: UtilService,
  ) {}
  // 支付宝小程序登录
  async alipayLogin(logindto: LoginDto) {
    const result = await alipaySdk.exec('alipay.system.oauth.token', {
      grant_type: 'authorization_code',
      code: logindto.code,
    });
    if (result && result.openId && result.unionId) {
      await this.redisService
        .getRedis()
        .set(
          `alipay:loginInfo:${result.openId}`,
          result.toString(),
          'EX',
          60 * 60 * 24 * 7,
        );
      //获取成功
      return result;
    }
    return { message: '登陆失败!', data: result };
  }

  // 微信登录逻辑处理
  async weixinLogin(wxLoginDto: LoginDto) {
    console.log(wxLoginDto);
    //微信授权验证,通过code获取openid
    const result = await axios({
      url: WxConfig.loginBase,
      method: 'GET',
      params: {
        appId: WxConfig.appId,
        secret: WxConfig.secret,
        js_code: wxLoginDto.code,
        grant_type: 'authorization_code',
      },
    });
    //微信返回数据,多端1后台一定配置unionid
    if (result.data && result.data.openid && result.data.unionid) {
      // 把微信unioid openid放入redis
      await this.redisService
        .getRedis()
        .set(
          `wx:loginInfo:${result.data.openid}`,
          result.data.toString(),
          'EX',
          60 * 60 * 24 * 7,
        );
      //获取成功
      return result.data;
    }
    return { message: '登陆失败!', data: result.data };
  }

  async tiktokLogin(ttLoginDto: LoginDto) {
    // this.loginTt(ttLoginDto).then(() =>{})
    return '抖音登陆';
  }

  // 微信端获取手机号
  async wx_loginWithPhone(code) {
    let accessToken;
    try {
      accessToken = await this.getWxAccessToken();
    } catch (error) {
      console.log(error);
    }
    //微信授权验证,通过code获取openid
    const result = await axios({
      url: WxConfig.getPhoneNumberBase + `?access_token=${accessToken}`,
      method: 'POST',
      data: {
        code: code,
      },
    });
    // 处理登录/注册逻辑返回用户信息
    if (result.data.phone_info && result.data.phone_info.phoneNumber) {
      return result.data;
    }
    return {
      code: result.data.errCode,
      message: result.data.errcode,
    };
  }

  // 处理支付宝手机号解密
  async ali_loginWithPhone(code) {
    // 解密手机号
    let key: any = 'O481Wd6xkIPtk4gJSAM8hg=='; // 解密的key
    let crypted = code; // 密文
    crypted = Buffer.from(crypted, 'base64').toString('binary');
    key = Buffer.from(key, 'base64');
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    // console.log(decoded);
    const res = JSON.parse(decoded);
    // 处理登录/注册逻辑返回用户信息
    if (res.mobile) {
      return res.mobile;
    }
    return {
      message: res.msg,
      errCode: res.code,
    };
  }
  // 解析抖音小程序手机号
  async getTtPhoneNumber(code: string) {}
  // 获取微信accessToken
  async getWxAccessToken() {
    if (process.env.SF_ENV == 'sbox') {
      try {
        const res = await axios({
          method: 'POST',
          url: 'https://api.suhuanji.com/partner/prod/login/getWxTokenOnline',
        });
        return res?.data?.data;
      } catch (error) {
        console.log(error);
        throw new ApiException(100001);
      }
    }
    const ACCESS_TOKEN = await this.redisService
      .getRedis()
      .get('wx:accessToken');
    if (ACCESS_TOKEN && ACCESS_TOKEN.length) {
      return ACCESS_TOKEN;
    } else {
      // 从微信获取小程序accessToken
      const ACCESS_DATA = await axios({
        url: WxConfig.accessTokenBase,
        method: 'GET',
        params: {
          appId: WxConfig.appId,
          secret: WxConfig.secret,
          grant_type: 'client_credential',
        },
      });
      await this.redisService
        .getRedis()
        .set(
          'wx:accessToken',
          ACCESS_DATA.data.access_token,
          'EX',
          ACCESS_DATA.data.expires_in - 100,
        );
      return ACCESS_DATA.data.access_token;
    }
  }
}
