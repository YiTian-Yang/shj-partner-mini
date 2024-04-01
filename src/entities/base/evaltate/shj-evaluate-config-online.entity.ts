import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
@Entity({ name: 'shj_evaluate_config_online' })
export default class ShjEvaluateConfigOnlineEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true, name: 'model_id' })
  @ApiProperty()
  modelId: number;

  @Column({
    nullable: true,
    name: 'max_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  @ApiProperty()
  maxPrice: number;

  @Column({
    nullable: true,
    name: 'min_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  @ApiProperty()
  minPrice: number;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;
}
