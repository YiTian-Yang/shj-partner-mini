import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsInt,
} from 'class-validator';
export class CreateCustomerAddress {
  @ApiProperty({
    description: '姓名',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '手机号',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: '省市区',
  })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({
    description: '详情地区',
  })
  @IsString()
  @IsNotEmpty()
  site: string;

  @ApiProperty({
    description: '经度',
  })
  @IsString()
  longitude: string;

  @ApiProperty({
    description: '纬度',
  })
  @IsString()
  latitude: string;
}

export class UpdateCustomerAddress {
  @ApiProperty({
    description: '姓名',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '手机号',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: '省市区',
  })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({
    description: '详情地区',
  })
  @IsString()
  @IsNotEmpty()
  site: string;

  @ApiProperty({
    description: '经度',
  })
  @IsString()
  longitude: string;

  @ApiProperty({
    description: '纬度',
  })
  @IsString()
  latitude: string;

  @ApiProperty({
    description: 'ID',
    required: false,
  })
  @IsInt()
  @Min(0)
  id: number;
}
export class DeleteCustomerAddress {
  @ApiProperty({
    description: 'id',
    required: false,
  })
  @IsInt()
  @Min(0)
  id: number;
}
