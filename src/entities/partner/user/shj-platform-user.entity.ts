import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_platform_user' })
export default class ShjPlatformUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({
    type: 'varchar',
    length: 21,
    comment: '用户Id',
    name: 'user_id',
  })
  @ApiProperty()
  userId: string;

  @Column({
    type: 'varchar',
    length: 11,
    comment: '用户手机号',
    name: 'user_phone',
  })
  @ApiProperty()
  userPhone: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 10,
    comment: '注册渠道',
    name: 'registration_channel',
  })
  @ApiProperty()
  registrationChannel: string;

  @Column({ name: 'partner_id', comment: '合作商ID' })
  @ApiProperty()
  partnerId: number;
}
