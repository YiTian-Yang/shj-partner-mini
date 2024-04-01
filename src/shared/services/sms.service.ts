import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';
import * as url from 'url';
import * as querystring from 'querystring';
import * as crypto from 'crypto';
import * as util from 'util';
import axios from 'axios';
import { SmsConfig } from 'src/config/configuration';

@Injectable()
export class SmsService {
  buildRequestBody(
    sender,
    receiver,
    templateId,
    templateParas,
    statusCallBack,
    signature,
  ) {
    if (null !== signature && signature.length > 0) {
      return querystring.stringify({
        from: sender,
        to: receiver,
        templateId: templateId,
        templateParas: templateParas,
        statusCallback: statusCallBack,
        signature: signature,
      });
    }

    return querystring.stringify({
      from: sender,
      to: receiver,
      templateId: templateId,
      templateParas: templateParas,
      statusCallback: statusCallBack,
    });
  }

  buildWsseHeader(appKey, appSecret) {
    const time = new Date(Date.now()).toISOString().replace(/.[0-9]+Z/, 'Z'); // Created
    const nonce = crypto.randomBytes(64).toString('hex'); // Nonce
    const passwordDigestBase64Str = crypto
      .createHash('sha256')
      .update(nonce + time + appSecret)
      .digest('base64'); // PasswordDigest
    const wsseHeader = util.format(
      'UsernameToken Username="%s",PasswordDigest="%s",Nonce="%s",Created="%s"',
      appKey,
      passwordDigestBase64Str,
      nonce,
      time,
    );
    return wsseHeader;
  }

  async sendSms(receiver: string, templateId: string, templateParas: string[]) {
    if (process.env.SF_ENV == 'sbox') {
      return {
        subMsg: '发送成功',
        code: '10000',
      };
    }
    const options = {
      url: SmsConfig.realUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'WSSE realm="SDP",profile="UsernameToken",type="Appkey"',
        'X-WSSE': this.buildWsseHeader(SmsConfig.appKey, SmsConfig.appSecret),
      },
      rejectUnauthorized: false,
    };

    const body = this.buildRequestBody(
      SmsConfig.sender,
      receiver,
      templateId,
      JSON.stringify(templateParas),
      SmsConfig.statusCallBack,
      SmsConfig.signature,
    );
    try {
      const reqs = await axios({
        ...options,
        data: body,
      });
      return reqs;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }
}
