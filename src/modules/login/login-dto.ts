import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    description: '小程序登录授权码',
  })
  @IsString()
  code: string;
  @ApiProperty({
    description: '当前小程序环境',
  })
  @IsOptional()
  mpEnvVersion: string;
}

export class LoginWithPhoneDto {
  @ApiProperty({
    required: true,
    description: '手机号授权码',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
  @ApiProperty({
    required: true,
    description: '平台openid',
  })
  @IsString()
  @IsNotEmpty()
  openid: string;

  @ApiProperty({
    required: true,
    description: '平台unionid',
  })
  @IsString()
  @IsNotEmpty()
  unionid: string;

  @ApiProperty({
    required: true,
    description: '平台标识',
  })
  @IsString()
  @IsNotEmpty()
  channel: string;
}
