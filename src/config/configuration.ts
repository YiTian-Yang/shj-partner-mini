import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import AlipaySdk from 'alipay-sdk';
import { join } from 'path';

export const getConfiguration = () =>
  ({
    jwt: {
      secret: process.env.JWT_SECRET || '123456',
    },
    database: {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number.parseInt(process.env.MYSQL_PORT, 10),
      username: process.env.MYSQL_USERNAME,
      password:
        process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
      migrations: ['dist/src/migrations/**/*.js'],
      autoLoadEntities: true,
      synchronize: process.env.TYPEORM_AUTO === 'true',
      logging: ['error'],
      timezone: '+08:00', // 东八区
      cli: {
        migrationsDir: 'src/migrations',
      },
    } as MysqlConnectionOptions,
    databasePartner: {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number.parseInt(process.env.MYSQL_PORT, 10),
      username: process.env.MYSQL_USERNAME,
      password:
        process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
      database: process.env.MYSQL_DATABASE_PARTNER,
      entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
      migrations: ['dist/src/migrations/**/*.js'],
      autoLoadEntities: true,
      /** https://typeorm.io/migrations */
      synchronize: process.env.TYPEORM_AUTO === 'true',
      logging: ['error'],
      timezone: '+08:00', // 东八区
      cli: {
        migrationsDir: 'src/migrations',
      },
    } as MysqlConnectionOptions,
    logger: {
      timestamp: false,
      dir: process.env.LOGGER_DIR,
      maxFileSize: process.env.LOGGER_MAX_SIZE,
      maxFiles: process.env.LOGGER_MAX_FILES,
      errorLogName: process.env.LOGGER_ERROR_FILENAME,
      appLogName: process.env.LOGGER_APP_FILENAME,
    },
    redis: {
      host: process.env.REDIS_HOST, // default value
      port: parseInt(process.env.REDIS_PORT, 10), // default value
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB,
    },
    // swagger
    swagger: {
      enable: process.env.SWAGGER_ENABLE === 'true',
      path: process.env.SWAGGER_PATH,
      title: process.env.SWAGGER_TITLE,
      desc: process.env.SWAGGER_DESC,
      version: process.env.SWAGGER_VERSION,
    },
    qqMap: {
      // 腾讯地图相关
      baseMapUrl: 'https://apis.map.qq.com',
      baseMapKey: 'VB4BZ-3G3CJ-RLSF7-DEEGI-JCIZO-I2BB5',
    },
  } as const);

export type ConfigurationType = ReturnType<typeof getConfiguration>;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type ConfigurationKeyPaths = Record<NestedKeyOf<ConfigurationType>, any>;

// 支付宝sdk配置
export const alipaySdk = new AlipaySdk({
  appId: '2021004138653287',
  privateKey:
    'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCR++WamwoC4seBF4gXqGe7feu7+lDxgym24t1o7IDo7+gxgfohnXopGq0a+HftnG39df3Nvux49Zp1zDhdnnSGfaos8nFWfmKNCzvFHQ3pEVAuyB0EhW8VOp+rYGu6xG1JFV0LJbAWyogleLXlLvqY2zcuy3+2vO0EyTgBsT+riHniuejKpC1Mv2iB9ulXn/JFXknqriYrws0NVRVHiNcb4jq4teD4bRsJTKYJve3Y2wBRFi9jlPHwhksQjkFqKq16Ok/jDQVte86zV3o6MxHewzf6/AiXWhkzsqIlXEKVr/vpOA4DlHx9SEkr6lhasLkoTJCCD5xdkmUWvCDw3korAgMBAAECggEASja5yfhJhaAOdlUlLYnCenGQdvbRUYYxnbUFhEK/YiwcaZa/N3mcUesq14w7Q8ODsxfZ2E/YXcHWLU6N1SIp8PlPmxwBfEwyA6wTTajwmmzfy3iWL+c5ypwL8g7JlaAoQsAmlfUp6Nw7jHkqV4GjijPfgN2ZZqfzArzcyRd329Z064ARGe/ww/B6Q8+jfbcgvTUCmz7ceeQqbwIQV7w/t6gHP4BDX0ir08DY+8Qd+qvsBlA+Wb5CF4cQ5ItDrWbNIILCPNZVXmU804FpQlrrgQquwUOKsdbxvk4G5vEUmN7s9q5mj2RQAJWo6FD9KIFM/ryyKaxCdcDq0zodVwMmSQKBgQDoK+N4AGOBG4eh9NQBBmvxCtNiV5XFACImNtcDK/BK8WxZS2Gcv7V2F799/vitjpz3h8rGVrrDye4LxHH8PZS0vzw879gkf4WyK21vkZPf2CQtB++ioge7KWxF+UeCBbmj3QVC0aUZWmxwXP/WKVdsE7t3eUsmD6iwacEK2GNSpwKBgQCg94EblbICrIhiaBYDBfOG3q1r5wV6yj0TRwpZvMYQCwU8wJI2x0gXLrluqqFmkIDgssOCm0QkAoSqcVZJ4wp0E1Vm5fSSVZpfjvFre80ThYhWvBtzepGVuusu0qZc8005vPvSfRFkfzpYgztUl/BeJUv1xUcVydlhiUhRtI6Q3QKBgDoYWVf6yOtShzLof3AuOi5bph9SiUB9Uw465Lx/byZhmNoTOb6uXerJ8HnHplRPfkmWKhBNPXime7FoG5mhkydTPvCEl5IycrLtmPm09MqrXAoElVsdrk+QAu7TfKg1ZIlzUdCxgt2AOeg37TCasaxyl5NCv6Irgut52vsqwFe7AoGACtJY9bfMre1XhfYldLKTur+BvT1c2vJ5xLAD/CB62F1FTt5Ldi9To2tawBvsme6hG3opNsClhh49ORBBktoWu9MI7NAM70GeDUqY5HcARI23qs0es1bMLtrQMOesk5cv2+/epjoOT0lWbNj1xiwo1st/HdjTfJ2DZdFK8WNIKmkCgYA9a5mKjKqFIsyMP2W+oM3Mrp/CuFmEujWoBq1vMQq+M9VnU2Ekzbh46bRsHOSQVrA7JPQvLStTWNKgxISRK4WFx4ciieZxfUCDmXhHg1EQ6c1cY1vrVC5sClSVlUrSiXV9Bm8kWEnTJT20xP/yZR0M2Hj0nnlTDhwB43gA0qNx4w==',
  // 传入支付宝根证书、支付宝公钥证书和应用公钥证书。
  // alipayRootCertPath: join(__dirname, 'cert/alipayRootCert.crt'),
  // 支付宝根证书
  alipayRootCertPath: './cert/alipayRootCert.crt',
  // alipayPublicCertPath: join(__dirname, 'cert/alipayCertPublicKey_RSA2.crt'),
  // 支付宝公钥证书
  alipayPublicCertPath: './cert/alipayCertPublicKey_RSA2.crt',
  // appCertPath: join(__dirname, 'cert/appCertPublicKey_2021004108660185.crt'),
  // 应用公玥证书
  appCertPath: './cert/appCertPublicKey_2021004138653287.crt',
});

// 微信小程序配置
export const WxConfig = {
  appId: 'wxf6c8d95454d97e2c',
  secret: 'a5ea2922970a566c0516914f83b974b4',
  loginBase: 'https://api.weixin.qq.com/sns/jscode2session',
  accessTokenBase: 'https://api.weixin.qq.com/cgi-bin/token',
  getPhoneNumberBase:
    'https://api.weixin.qq.com/wxa/business/getuserphonenumber',
  // 微信支付设置
  mchid: '1660243654',
  notifyTestUrl: 'https://api.suhuanji.com/test/recycle/wepayNotify',
  notifyProdUrl: 'https://api.suhuanji.com/prod/recycle/wepayNotify',
  refundNotifyUrl: 'https://api.suhuanji.com/test/recycle/refundNotify',
  privateKey: 'cert/wepay/apiclient_key.pem', //签名私钥
  certSerial: '1A1EEE383526C400E4C8C1188420E7FB74D71D2D', //证书序列号
  v2Key: 'dsfjkhhjskfhds45345jksdjfhdsjkrh',
  v3Key: 'dsfjkhhjskfhds45345jksdjfhdsjkrh',
};

// 顺丰快递配置
export const SFConfig = () => ({
  // 真实请求地址
  realUrl:
    process.env.SF_ENV == 'prod'
      ? 'https://bspgw.sf-express.com/std/service'
      : 'https://sfapi-sbox.sf-express.com/std/service',
  // 真实token地址
  realTokenUrl:
    process.env.SF_ENV == 'prod'
      ? 'https://sfapi.sf-express.com/oauth2/accessToken'
      : 'https://sfapi-sbox.sf-express.com/oauth2/accessToken',
  // 合作者id
  partnerID: 'XHKJPUGG4U8',
  realSecret:
    process.env.SF_ENV == 'prod'
      ? 'GOAFpMLLa9HXACaZdh1L98mfg9HYt4T5'
      : 'cj7o0ESjvRgvTeg4G1Qcz8uFxYMCKBl7',
  monthlyCard: process.env.SF_ENV == 'prod' ? '0210903742' : '7551234567',
  // 收件地址
  deliveryAddress: {
    address: '上海市静安区梅园路360号环龙商场3296',
    company: '琛旭网络科技（上海）有限公司',
    contact: '速换机C端',
    contactType: 2,
    country: 'CN',
    tel: '17143250000',
  },
});

// 顺店通配置
export const SDT_config = {
  SDT_sbox: {
    url: 'https://united-store-uat-ms.sf-express.com/zt/hd-united-store-openserver/',
    custumerId: '176235',
    custumerNo: 'CXWLKJ',
    appId: '176235',
    appName: '琛旭网络科技（上海）有限公司',
    appSecret: '7417cb0b68b351e8',
    customNumber: '9999999999',
  },
  SDT_prod: {
    url: 'https://united-store-ms.sf-express.com/zt/hd-united-store-openserver/',
    custumerId: '605564',
    custumerNo: 'CXWLKJ',
    appId: '605564',
    appName: '琛旭网络科技（上海）有限公司',
    appSecret: '22d60423b514c236',
    customNumber: '0210903742',
  },
};

export const SmsConfig = {
  // 填写你的实际值
  realUrl:
    'https://smsapi.cn-north-4.myhuaweicloud.com:443/sms/batchSendSms/v1',
  appKey: '91K9hvSoRPx4HlU1LhQ96B4Ra2Wc',
  appSecret: 'Jq7HPmhoEfWlAavlahE2xETWP6Uw',
  //国内短信签名通道号
  sender: '8823091128903',
  signature: '速换机', // 签名名称
  //选填,短信状态报告接收地址,推荐使用域名,为空或者不填表示不接收状态报告
  statusCallBack: '',
};

export const LbsConfig = {
  url: 'https://apis.map.qq.com/',
  key: 'VB4BZ-3G3CJ-RLSF7-DEEGI-JCIZO-I2BB5',
};

export const JobConfig = () => ({
  url: process.env.JOB_URL,
  appKey: '28889649108274852173407303117513',
  appSecret: '826CD7DD815AEFF7554D021DA53E22DA',
});
