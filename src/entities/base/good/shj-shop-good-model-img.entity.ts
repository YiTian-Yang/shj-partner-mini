import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ImgType } from './eunm';

@Entity({ name: 'shj_shop_good_model_img' })
export default class ShjShopGoodModelImgEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'good_id', comment: '商品ID' })
  @ApiProperty()
  goodId: number;

  @Column({ name: 'good_img', comment: '商品图片名称' })
  @ApiProperty()
  goodImg: string;

  @Column({ name: 'img_type', comment: '图片类型', default: ImgType.Unknown })
  @ApiProperty()
  imgType: ImgType;
}
