import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_mini_program_list' })
export default class ShjMiniProgramList extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({
    type: 'varchar',
    length: 11,
    comment: '平台',
  })
  @ApiProperty()
  platform: string;

  @Column({ nullable: true, type: 'varchar', name: 'open_id' })
  @ApiProperty()
  openId: string;

  @Column({ nullable: true, type: 'varchar', name: 'union_id' })
  @ApiProperty()
  unionId: string;

  @Column({ nullable: true, type: 'varchar', name: 'parent_id' })
  @ApiProperty()
  parentId: string;
}
