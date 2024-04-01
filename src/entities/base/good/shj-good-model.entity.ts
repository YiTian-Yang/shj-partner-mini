import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { IsRecovery, IsRetail } from './eunm';
@Entity({ name: 'shj_good_model' })
export default class ShjGoodModelEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true, name: 'model_custom_id' })
  @ApiProperty()
  modelCustomId: string;

  @Column({ name: 'type_id' })
  @ApiProperty()
  typeId: number;

  @Column({ name: 'brand_id' })
  @ApiProperty()
  brandId: number;

  @Column({
    type: 'tinyint',
    name: 'is_recovery',
    default: IsRecovery.Enabled,
  })
  @ApiProperty()
  isRecovery: IsRecovery;

  @Column({
    type: 'tinyint',
    name: 'is_retail',
    default: IsRetail.Disabled,
  })
  @ApiProperty()
  isRetail: IsRetail;

  @Column({ name: 'model_name' })
  @ApiProperty()
  modelName: string;

  @Column({ name: 'model_img', nullable: true })
  @ApiProperty()
  modelImg: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;
}
