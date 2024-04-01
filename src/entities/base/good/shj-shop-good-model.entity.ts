import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { UploadType, SaleStatus, SellChannel, HbConfig } from './eunm';

@Entity({ name: 'shj_shop_good_model' })
export default class ShjShopGoodModelEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'good_custom_id', comment: '商品自定义ID' })
  @ApiProperty()
  goodCustomId: string;

  @Column({ name: 'model_id', comment: '型号ID' })
  @ApiProperty()
  modelId: number;

  @Column({ name: 'good_name', comment: '商品名称' })
  @ApiProperty()
  goodName: string;

  @Column({ name: 'shop_id', comment: '门店ID' })
  @ApiProperty()
  shopId: string;

  @Column({
    name: 'sale_status',
    comment: '上架状态',
    type: 'tinyint',
    default: SaleStatus.Unknown,
  })
  @ApiProperty()
  saleStatus: SaleStatus;

  @Column({
    name: 'force_down_reason',
    comment: '强制下架原因',
    nullable: true,
  })
  @ApiProperty()
  forceDownReason: string;

  @Column({
    name: 'upload_type',
    comment: '上传方式',
    type: 'tinyint',
    default: UploadType.Unknown,
  })
  @ApiProperty()
  uploadType: UploadType;

  @Column({
    name: 'sell_channel',
    comment: '卖给平台',
    type: 'tinyint',
    default: SellChannel.Unknown,
  })
  @ApiProperty()
  sellChannel: SellChannel;

  @Column({
    name: 'hb_3',
    comment: '花呗3期分期设置',
    type: 'tinyint',
    default: HbConfig.Platform,
  })
  @ApiProperty()
  hb3: HbConfig;

  @Column({
    name: 'hb_6',
    comment: '花呗6期分期设置',
    type: 'tinyint',
    default: HbConfig.Unknown,
  })
  @ApiProperty()
  hb6: HbConfig;

  @Column({
    name: 'hb_12',
    comment: '花呗12期分期设置',
    type: 'tinyint',
    default: HbConfig.Unknown,
  })
  @ApiProperty()
  hb12: HbConfig;

  @Column({
    name: 'xy_3',
    comment: '信用卡3期分期设置',
    type: 'tinyint',
    default: HbConfig.Platform,
  })
  @ApiProperty()
  xy3: HbConfig;

  @Column({
    name: 'xy_6',
    comment: '信用卡期分期设置',
    type: 'tinyint',
    default: HbConfig.Unknown,
  })
  @ApiProperty()
  xy6: HbConfig;

  @Column({
    name: 'xy_12',
    comment: '信用卡12期分期设置',
    type: 'tinyint',
    default: HbConfig.Unknown,
  })
  @ApiProperty()
  xy12: HbConfig;
}
