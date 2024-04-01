import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_good_model_detail' })
export default class ShjGoodModelDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'model_id' })
  @ApiProperty()
  modelId: number;

  @Column({ name: 'model_detail_img' })
  @ApiProperty()
  modelDetailImg: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;
}
