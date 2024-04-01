import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_shop_good_model_sort' })
export default class ShjShopGoodModelSortEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'good_id' })
  @ApiProperty()
  goodId: number;

  @Column({ name: 'good_sort' })
  @ApiProperty()
  goodSort: number;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;
}
