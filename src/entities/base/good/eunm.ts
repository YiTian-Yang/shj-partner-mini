export enum AttributeType {
  // 未知 保留位
  Unknown,
  // 销售属性
  Sale,
}

export enum IsRecovery {
  // 禁用
  Disabled,
  // 启用
  Enabled,
}

export enum IsRetail {
  // 禁用
  Disabled,
  // 启用
  Enabled,
}

export enum SaleStatus {
  // 未知 保留位
  Unknown,
  // 上架 （售卖中）
  Sale,
  // 下架 （仓库中）
  UnSale,
  // 强制下架 （仓库中）
  ForceUnSale,
}

export enum UploadType {
  // 未知 保留位
  Unknown,
  // 平台模板
  Platform,
  // 自定义
  Custom,
}

export enum SellChannel {
  // 未知 保留位
  Unknown,
  // 卖给平台
  Platform,
  // 不卖给平台
  Self,
}

export enum AttributeStatus {
  // 未知 保留位
  Unknown,
  // 停用
  Stop,
  // 启用
  Open,
}

export enum ImgType {
  // 未知 保留位
  Unknown,
  // 主图
  Main,
  // 自定义商详图片
  Detail,
}

// 花呗分期配置
export enum HbConfig {
  // 未知 保留位
  Unknown,
  // 平台贴息
  Platform,
  // 商家贴息
  Shop,
  // 用户贴息
  User,
}
