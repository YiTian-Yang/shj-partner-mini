import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FastifyRequest } from 'fastify';
import { customAlphabet, nanoid } from 'nanoid';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UtilService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  /**
   * 获取请求IP
   */
  getReqIP(req: FastifyRequest): string {
    return (
      // 判断是否有反向代理 IP
      (
        (req.headers['x-forwarded-for'] as string) ||
        // 判断后端的 socket 的 IP
        req.socket.remoteAddress
      ).replace('::ffff:', '')
    );
  }

  /* 判断IP是不是内网 */
  IsLAN(ip: string) {
    ip.toLowerCase();
    if (ip == 'localhost') return true;
    let a_ip = 0;
    if (ip == '') return false;
    const aNum = ip.split('.');
    if (aNum.length != 4) return false;
    a_ip += parseInt(aNum[0]) << 24;
    a_ip += parseInt(aNum[1]) << 16;
    a_ip += parseInt(aNum[2]) << 8;
    a_ip += parseInt(aNum[3]) << 0;
    a_ip = (a_ip >> 16) & 0xffff;
    return (
      a_ip >> 8 == 0x7f ||
      a_ip >> 8 == 0xa ||
      a_ip == 0xc0a8 ||
      (a_ip >= 0xac10 && a_ip <= 0xac1f)
    );
  }

  /* 通过ip获取地理位置 */
  async getLocation(ip: string) {
    if (this.IsLAN(ip)) return '内网IP';
    let { data } = await this.httpService.axiosRef.get(
      `http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`,
      { responseType: 'arraybuffer' },
    );
    data = new TextDecoder('gbk').decode(data);
    data = JSON.parse(data);
    return data.addr.trim().split(' ').at(0);
  }

  /**
   * AES加密
   */
  public aesEncrypt(msg: string, secret: string): string {
    return CryptoJS.AES.encrypt(msg, secret).toString();
  }

  /**
   * AES解密
   */
  public aesDecrypt(encrypted: string, secret: string): string {
    return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
  }

  /**
   * md5加密
   */
  public md5(msg: string): string {
    return CryptoJS.MD5(msg).toString();
  }

  /**
   * 生成一个UUID
   */
  public generateUUID(): string {
    return nanoid();
  }

  /**
   * 生成一个随机的值
   */
  public generateRandomValue(
    length: number,
    placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
  ): string {
    const customNanoid = customAlphabet(placeholder, length);
    return customNanoid();
  }

  /**
   * 生成类似于PP00001 类似的Id
   */
  public generateFormattedString(
    prefix: string,
    length: number,
    currentCount: number,
  ): string {
    if (!length || !currentCount || currentCount < 0) {
      throw new Error('参数填写错误');
    }

    const formattedCount = currentCount.toString().padStart(length, '0');
    return `${prefix}${formattedCount}`;
  }

  /**
   * 校验价格是否满足要求
   * @param maxPrice 最大价格
   * @param decimalPoints 小数点位数
   * @param price 价格
   * @param allowZero 是否允许为0
   * @returns true 表示价格满足要求，false 表示价格不满足要求
   */
  public isPriceValid(
    maxPrice: number,
    decimalPoints: number,
    price: number,
    allowZero?: boolean,
  ): boolean {
    // 检查是否为数字
    if (isNaN(maxPrice) || isNaN(decimalPoints) || isNaN(price)) {
      return false;
    }

    if (allowZero) {
      if (maxPrice <= 0 || decimalPoints <= 0 || price < 0) {
        return false;
      }
    } else {
      if (maxPrice <= 0 || decimalPoints <= 0 || price <= 0) {
        return false;
      }
    }

    // 检查小数点位数是否合法
    const regex = new RegExp(`^\\d+(\\.\\d{1,${decimalPoints}})?$`);
    if (!regex.test(String(price))) {
      return false;
    }

    // 检查价格是否小于等于最大价格
    return price <= maxPrice;
  }
}
