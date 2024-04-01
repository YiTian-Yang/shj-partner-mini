import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import AlipaySdk from 'alipay-sdk';

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
  appId: '2021004108660185',
  privateKey:
    'MIIEpAIBAAKCAQEAr0BLECh7kJhYzAZBUYq/27cT2/Pye9L5apWdjzU4zQl68Q3MBXewbUXuCmSz70u0NlEwQbunLF+A+alDcU1pgwT/aBnDyLMKUBKFbG6H6g9WN7bv+BOSwXiCf46sR1VKfZbxLcRlmW60y1MCfrsxG6exwpHujiTADLdR4oGu4ZwmadBY8uqWEMJfOh0arhEi+iyf9SaUxfrrVnz1mWjFKo1PN3JrkXub4Ge/Ip/PmXKT1UQf3Pl9aqH2X7n4J7LqQzuBzanC6xANqe8Xa6v9OcCQw+TGPGCnYcLPLoz4RVvQ6tYPmrZlptw7+HtHdrzEpVZ1gBpwU9ds7cMN7ZhhawIDAQABAoIBAAZbNZ3Dah/ndqkHvQzBFI5aiIzcvznAgC1eedV836+IHX5qurCkE7ES7TxRRLl0LHgf37kynjCc0ie7/Oc6II6Q+taCwLghzkjzMwWoyKMzpTPmHbQIubTsswb/XL5FmKsPc3XufqTfAA2z2A5SqchP/8GH23gqWxDbAUxO2dHy8VGSFpEeEJFNDMFIbXY0Aj2WbntOUklPdPh5KjRoI0t01pZn/uMEqIUm2CvGiSa5bbBWGu9J0j7eZSHl9SRajo+pr4s9urWMDiUqL9EGcU04r7lrJNk5sKkdp8IGmtNJtznEnlWCt2UDnF4o+srKLGuwca2vbWcWCNnkLEHTfDECgYEA/SzE0MFFm/ir0fq3kuTA400tfFa7rD4hTALL24HUizcnmYkGUPHAZyFUBNimNRZ6Mc9z0+l87Y56zkX+XgC1p0UpE5GkqJXcw5KEeinj3ZzHxqg2G/rZt0jdi4ZZR4UUCTB0ybsuLgnxdf9edjNzvFG1ow7R2UeQSIvb9ELj4tkCgYEAsTTsf/yWr9mp/D/Ox5V1rhxI58Q9t/+H9NjmjiE8KTGGcgUqKSlrV+BspvGxj5sj2UVFOnYmxrZIHMKz1/AYaTOt7OVmk1tBwRMuMoEwO6aqf5G7/a7Iiel5XRu5QMGDto1FXjL+Q+ttzTatyP6vUt53bRWDRsHPmm2jqjLdM+MCgYEAuG1tbljsmWM73znRkotbS/nDwcj4689SuCltUZkxOLzT9w+Pb1W8gCQSLXmZEiEuoKxrxxpWrELXiP4J/3Zq3dAOzTeSiFCrQjiwksGDQcPc8AVHbXh+Mvs8kFAtJ2F1KACJgw785ALQR9HggSCYFb48H+1CxxJPs9lWQIids3kCgYBggAqedAX3Q1hPVswbYefQ5fRJylM15QC7tHZxReYGJMMrSma4PacIFt30V8AzDPALvK5DdN4O7mr8xoa7fDM+7vazAAXJDzQSmYhZ1oJWqZ9Fky5Fqq3odG0z6AoNGpTIj8wLzUcr44RK8ZDX2OHPBfkRPVrc6GROm5A5+jL9swKBgQCWjYjQ2BPXAn7Yu2SUGItUCwxfWTHNwbzQgU2mfgWrtE+thd7NnPy+nPD6ZrZx7MLo/uPZ6IWmcRFurX3lA42YWxhFUQwc0iD9Pe1MsXs/wlnuIUo/RDSUU37s4b8nJtpJyRjj96cNtpieMHQ1tFw5NGN2csr+1sitekwqocOnqw==',
  // 传入支付宝根证书、支付宝公钥证书和应用公钥证书。
  // alipayRootCertPath: join(__dirname, 'cert/alipayRootCert.crt'),
  // 支付宝根证书
  // alipayRootCertPath: './cert/alipayRootCert.crt',
  // alipayPublicCertPath: join(__dirname, 'cert/alipayCertPublicKey_RSA2.crt'),
  // 支付宝公钥证书
  // alipayPublicCertPath: './cert/alipayCertPublicKey_RSA2.crt',
  // appCertPath: join(__dirname, 'cert/appCertPublicKey_2021004108660185.crt'),
  // 应用公玥证书
  // appCertPath: './cert/appCertPublicKey_2021004108660185.crt',
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
