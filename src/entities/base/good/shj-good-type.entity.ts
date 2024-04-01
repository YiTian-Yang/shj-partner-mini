import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_good_type' })
export default class ShjGoodTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true, name: 'type_custom_id' })
  @ApiProperty()
  typeCustomId: string;

  @Column({ unique: true })
  @ApiProperty()
  typename: string;

  @Column()
  @ApiProperty()
  remark: string;
}
