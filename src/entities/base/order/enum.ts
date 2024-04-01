export enum OrderStatus {
  // 已取消
  Cancelled,
  // 待取件
  PendingPickup,
  // 待报价
  WaitingQuote,
  // 待确认
  WaitingConfirm,
  // 交易成功
  SuccessfulTransaction,
}

export enum OrderChannel {
  // C端支付宝
  C_Alipay,
  // C端微信
  C_Weixin,
  // C端抖音
  C_Tiktok,
  // B端商店
  B_Store,
  // B端平台
  Third_Channel,
  // C端蚂蚁回收
  C_Ant,
}

export enum OrderType {
  // 直接回收
  Recycle,
  // 以旧换新
  TradeIn,
  // 上门转快递
  OnSiteToExpress,
}
export enum PaymentStatus {
  // 未打款
  UnPay,
  // 打款失败
  PayFail,
  // 打款成功
  PaySuccess,
}

export enum PaymentType {
  // 线上打款
  AutoPay,
  // 线下打款
  ManualPay,
}

export enum ExpressStatus {
  Unknown,
  // 下单成功
  Success,
  // 下单失败
  fail,
}

export enum OrderStatusImplication {
  // 已取消
  '已取消',
  // 待取件
  '待取件',
  // 待报价
  '待报价',
  // 待确认
  '待确认',
  // 交易成功
  '交易成功',
}

export enum OrderChannelImplication {
  // C端支付宝
  'C端支付宝',
  // C端微信
  'C端微信',
  // C端抖音
  'C端抖音',
  // B端商店
  'B端商店',
  // B端商店
  '三方合作平台',
  // C端蚂蚁回收
  '蚂蚁回收',
}

export enum OrderTypeImplication {
  // 直接回收
  '直接回收',
  // 以旧换新
  '以旧换新',
}

export enum PaymentStatusImplication {
  // 未打款
  '未打款',
  // 打款失败
  '打款失败',
  // 打款成功
  '打款成功',
}

export enum PaymentTypeImplication {
  // 线上打款
  '线上打款',
  // 线下打款
  '线下打款',
}
