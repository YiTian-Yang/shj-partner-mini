import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_shop_good_model_recent' })
export default class ShjShopGoodModelRecentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'model_id', comment: '型号ID' })
  @ApiProperty()
  modelId: number;

  @Column({ name: 'shop_id', comment: '门店ID' })
  @ApiProperty()
  shopId: string;
}
