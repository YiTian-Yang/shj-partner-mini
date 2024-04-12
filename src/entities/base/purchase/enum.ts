export enum PurchaseStatus {
  // 未知 保留位
  Unknown,
  // 待入库
  WaitingInStorage,
  // 已完成
  Finished,
}

export enum PurchaseChannel {
  // 未知 保留位
  Unknown,
  // C端快递
  C_Express,
  // B端
  Business,
  //线下
  Offline,
}

export enum InventorySourceType {
  // 未知 保留位
  Unknown,
  // 采购
  Purchase,
  // 退货
  SalesReturn,
}
