import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_partner' })
export default class ShjPartner extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'partner_name', unique: true, comment: '分收平台名称' })
  @ApiProperty()
  partnerName: string;

  @Column({ name: 'key', unique: true, comment: 'key值 用于判断分收平台' })
  @ApiProperty()
  key: string;

  @Column({ name: 'cer_url', comment: '证书路径', nullable: true })
  @ApiProperty()
  cerUrl: string;
}
