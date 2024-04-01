import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { alipaySdk } from 'src/config/configuration';
import { UtilService } from 'src/shared/services/util.service';
@Injectable()
export class AlipayOrderService {
  constructor(private utils: UtilService) {}
  //单笔转账
  async singleTransferAccounts(params) {
    if (process.env.SF_ENV == 'sbox') {
      return {
        subMsg: '打款成功',
        code: '10000',
      };
    }
    return await alipaySdk.exec('alipay.fund.trans.uni.transfer', {
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: params.time, //打款时间
      version: '1.0',
      bizContent: {
        out_biz_no: params.orderId, //订单编号
        trans_amount: params.quotePrice, //报价金额
        biz_scene: 'DIRECT_TRANSFER',
        product_code: 'TRANS_ACCOUNT_NO_PWD',
        order_title: params.moneyTitle, //订单标题
        payee_info: {
          identity_type: 'ALIPAY_LOGON_ID', //uid还是手机邮箱
          name: params.realName, //真实姓名
          identity: params.receiveAccount, //手机号邮箱
        },
      },
    });
  }
  /**
   * @param totalAmount 支付金额
   * @param subject 标题
   * @param passbackParams 自定义参数
   * @param buyerOpenId 付款人id
   * @param timeoutExpress 付款单超时时间 默认15天
   * @param hbfqNum 花呗分期数3/6/12
   * @param hbfqSellerPercent 手续费承担方 0：商家/平台 100：用户，不可取中间值
   * @returns 创建支付宝支付单提供小程序支付数据
   */
  async createPayOrder(
    totalAmount: number,
    subject: string,
    passbackParams: string,
    buyerOpenId: string,
    timeoutExpress?: string,
    hbfqNum?: string,
    hbfqSellerPercent?: string,
  ): Promise<any> {
    const notify_url =
      process.env.SF_ENV == 'prod'
        ? 'https://api.suhuanji.com/prod/recycle/receivePayres'
        : 'https://api.suhuanji.com/test/recycle/receivePayres';
    if ((hbfqNum && !hbfqSellerPercent) || (!hbfqNum && hbfqSellerPercent)) {
      throw '花呗分期参数错误!';
    }
    let extend_params, enable_pay_channels;
    if (hbfqNum && hbfqSellerPercent) {
      extend_params = {
        hb_fq_num: hbfqNum,
        hb_fq_seller_percent: hbfqSellerPercent,
      };
      enable_pay_channels = 'pcredit,pcreditpayInstallment';
    }
    const result = await alipaySdk.exec('alipay.trade.create', {
      notify_url: notify_url,
      bizContent: {
        // 商户订单号
        out_trade_no:
          dayjs().format('YYMMDDHHmmss') +
          this.utils.generateRandomValue(16, '0123456789'),
        // 支付金额
        total_amount: totalAmount,
        // 商品标题
        subject: subject,
        // 超时时间
        timeout_express: timeoutExpress || '15d',
        // 商家和支付宝签约的产品码
        product_code: 'JSAPI_PAY',
        // 使用openid替换userid
        buyer_open_id: buyerOpenId,
        passback_params: passbackParams,
        // appid
        op_app_id: '2021004108660185',
        extend_params: extend_params,
        enable_pay_channels: enable_pay_channels,
      },
    });
    if (result.code !== '10000') {
      throw new Error('创建支付单失败，请稍后重试！');
    }
    return result;
  }

  /**
   * @param totalAmount 支付金额
   * @param subject 标题
   * @param passbackParams 自定义参数
   * @param buyerOpenId 付款人id
   * @param timeoutExpress 付款单超时时间 默认15天
   * @param hbfqNum 花呗分期数3/6/12
   * @param hbfqSellerPercent 手续费承担方 0：商家/平台 100：用户，不可取中间值
   * @returns 创建支付宝支付单提供小程序支付数据
   */
  async createPayOrderForCard(
    totalAmount: number,
    subject: string,
    passbackParams: string,
    buyerOpenId: string,
    timeoutExpress?: string,
    fqNum?: string,
    fqSellerPercent?: string,
  ): Promise<any> {
    // 更改为单独的接收接口
    const notify_url =
      process.env.SF_ENV == 'prod'
        ? 'https://api.suhuanji.com/prod/recycle/receivePayres'
        : 'https://api.suhuanji.com/test/recycle/receivePayres';
    if ((fqNum && !fqSellerPercent) || (!fqNum && fqSellerPercent)) {
      throw '分期参数错误!';
    }
    let extend_params, enable_pay_channels;
    if (fqNum && fqSellerPercent) {
      extend_params = {
        fq_num: fqNum,
        fq_seller_percent: fqSellerPercent,
        fq_channels: 'alipayfq_cc',
      };
      // 限制仅支持单通道信用卡
      enable_pay_channels = 'creditCard';
    }
    const result = await alipaySdk.exec('alipay.trade.create', {
      notify_url: notify_url,
      bizContent: {
        // 商户订单号
        out_trade_no:
          dayjs().format('YYMMDDHHmmss') +
          this.utils.generateRandomValue(16, '0123456789'),
        // 支付金额
        total_amount: totalAmount,
        // 商品标题
        subject: subject,
        // 超时时间
        timeout_express: timeoutExpress || '15d',
        // 商家和支付宝签约的产品码
        product_code: 'JSAPI_PAY',
        // 使用openid替换userid
        buyer_open_id: buyerOpenId,
        passback_params: passbackParams,
        // appid
        op_app_id: '2021004108660185',
        extend_params: extend_params,
        enable_pay_channels: enable_pay_channels,
      },
    });
    if (result.code !== '10000') {
      throw new Error('创建支付单失败，请稍后重试！');
    }
    return result;
  }

  /**
   * 查询支付单信息
   * @param tradeNo 支付单号
   * @returns
   */
  async queryPayOrder(tradeNo: string) {
    const queryData = await alipaySdk.exec('alipay.trade.query', {
      bizContent: {
        trade_no: tradeNo,
      },
    });
    if (queryData.code !== '10000') {
      throw new Error('查询支付单详情失败，请重试！');
    }
    return queryData;
  }
  /**
   * 取消支付单
   * @param tradeNo 支付单号
   * @returns
   */
  async cancelPayOrder(tradeNo: string) {
    const result = await alipaySdk.exec('alipay.trade.cancel', {
      bizContent: {
        trade_no: tradeNo,
      },
    });
    if (result.code !== '10000') {
      throw new Error('取消订单失败，请重试！');
    }
    return result;
  }

  /**
   * 退款
   * @param outTradeNo 支付单商家订单号，不能与支付单号同时为空
   * @param tradeNo 支付单号，不能与商家单号同时为空
   * @returns
   */
  async refund(refundAmount: number, tradeNo?: string, outTradeNo?: string) {
    const result = await alipaySdk.exec('alipay.trade.refund', {
      bizContent: {
        refund_amount: +refundAmount,
        trade_no: tradeNo,
        out_trade_no: outTradeNo,
      },
    });
    if (result.code !== '10000') {
      throw new Error('订单退款失败，请重试！');
    }
    return result;
  }

  //换取授权访问令牌
  async getAuthToken(params) {
    return await alipaySdk.exec('alipay.system.oauth.token', {
      charset: 'utf-8',
      sign_type: 'RSA2',
      version: '1.0',
      timestamp: params.time,
      grant_type: 'authorization_code',
      code: params.code,
    });
  }

  //行业服务标准化订单数据回流
  async commerceIndustryOrderSync(params) {
    const data: any = {
      charset: 'utf-8',
      sign_type: 'RSA2',
      version: '1.0',
      timestamp: params.time,
      bizContent: {
        merchant_order_no: params.orderId,
        openId: params.openId,
        service_code: '2023090321000924146420',
        service_type: 'DIGITAL_RECYCLING',
        order_source: 'ALIPAY_APPLETS',
        order_create_time: params.time,
        order_modify_time: params.updateTime,
        order_detail_url: `alipays://platformapi/startapp?appId=2021004108660185&page=my/order/order-detail?orderId=${
          params.orderId
        }&isOnsite=${params.channel === 'OFFLINE' ? 'true' : 'false'}`,
        order_amount: parseFloat(params.price.toString()),
        status: params.status,
        industry_info: {
          service_product_info: {
            goods_name: params.goodName, //回收名称
            goods_desc: params.goodDesc, //服务描述 XX回收
            quantity: params.quantity, //发送能量的数量
            energy_goods_type: params.type, //laptop（笔记本）camera（相机）cellphone（手机）cans（易拉罐）paper（废纸）
          },
          service_provider_info: {
            platform_name: '速换机',
            platform_phone: '18217646232',
          },
          service_performance_info: {
            send_green_energy: params.flag, //是否发送能量
            appointment_time: {
              start_time: params.startTime,
              end_time: params.endTime,
            },
            order_channel: params.channel, //OFFLINE 线下 ONLINE 线上
          },
          service_staff_info: {
            company_name: params.companyName, //服务姓名
            phone: params.phone, //服务电话
          },
        },
      },
    };
    if (params.recordId) {
      data.bizContent.record_id = params.recordId;
    }
    if (params.accessToken) {
      data.auth_token = params.accessToken;
    }
    if (params.orderSource) {
      data.bizContent.order_source = params.orderSource;
      data.bizContent.industry_info.assess_info = {
        order_source_app_id: params.orderSourceAppId,
        product_code: params.productCode,
        estimate_result_id: params.estimateResultId,
      };
    }

    if (process.env.SF_ENV == 'prod') {
      return await alipaySdk.exec('alipay.commerce.industry.order.sync', data);
    } else {
      return { subMsg: '回流成功', code: '10000', recordId: '11111111' };
    }
  }

  //查询森林能量
  //换取授权访问令牌
  async getForestEnergy() {
    return await alipaySdk.exec('alipay.eco.activity.recycle.query', {
      charset: 'utf-8',
      sign_type: 'RSA2',
      version: '1.0',
      timestamp: '2023-12-27 13:57:00',
      bizContent: {
        out_biz_no: '20231227016671400506733733693751',
      },
    });
  }
}
