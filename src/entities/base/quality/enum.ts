export enum QualityStatus {
  // 未知 保留位
  Unknown,
  // 待质检
  WaitingTest,
  // 已完成
  Finished,
}

export enum QualityChannel {
  // 未知 保留位
  Unknown,
  // C端快递
  C_Express,
  // B端
  Business,
}

export enum ProductStatus {
  // 未知，保留位
  Unknown,
  // 待确认
  WaitingConfirm,
  // 已同意
  Agreed,
  //  已拒绝
  Rejected,
}
