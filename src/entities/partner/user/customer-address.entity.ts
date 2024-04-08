import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'shj_customer_address' })
export default class ShjCustomerAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'name' })
  @ApiProperty()
  name: string;

  @Column({ name: 'phone' })
  @ApiProperty()
  phone: string;

  @Column({ name: 'region' }) //省市区
  @ApiProperty()
  region: string;

  @Column({ name: 'site' }) //详细地址
  @ApiProperty()
  site: string;

  @Column({ name: 'longitude', nullable: true }) //经度
  @ApiProperty()
  longitude: string;

  @Column({ name: 'latitude', nullable: true }) //纬度
  @ApiProperty()
  latitude: string;

  @Column({ name: 'user_id' })
  @ApiProperty()
  userId: string;
}
