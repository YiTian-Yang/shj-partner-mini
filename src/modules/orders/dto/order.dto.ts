import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/page.dto';

interface paymentInfo {
  paymentStatus?: string;
  paymentType?: string;
  paymentTime?: string;
  payer?: string;
  paymentAmount?: number;
  realName: string;
  receiveAccount: string;
}

interface productInfo {
  // categoryId?: number;
  // brandId?: number;
  modelId: number;
  // valuationPrice?: number;
  // quotePrice?: number;
  // valuationDetails?: string;
}

interface pickupInfo {
  contactPerson: string;
  contactPhone: string;
  pickupAddress: PickupAddress;
  pickupTime: string;
  waybillId?: string;
  parcelId?: string;
  sfId?: string;
  routerInfo?: object;
}

interface PickupAddress {
  province: string;
  city: string;
  area: string;
  address: string;
}
export class CreateOrderDto {
  @ApiProperty({ description: '订单类型' })
  @IsOptional()
  orderType: string;

  // @ApiProperty({ description: '订单渠道' })
  // @IsNotEmpty()
  // orderChannel: string;

  // @ApiProperty({ description: '订单状态' })
  // @IsNotEmpty()
  // orderStatus: string;

  // @ApiProperty({ description: '订单编号' })
  // orderNumber: string;

  // @ApiProperty({ description: '下单时间' })
  // @IsNotEmpty()
  // orderTime: string;

  // @ApiProperty({ description: '交易成功时间' })
  // @IsOptional()
  // transactionSuccessTime: string;

  // @ApiProperty({ description: '交易用户id' })
  // @IsNotEmpty()
  // userId: string;

  @ApiProperty({ description: '商品估价信息' })
  @IsNotEmpty()
  productInfo: productInfo;

  @ApiProperty({ description: '商品估价信息' })
  @IsNotEmpty()
  paymentInfo: paymentInfo;

  @ApiProperty({ description: '商品估价信息' })
  @IsNotEmpty()
  pickupInfo: pickupInfo;
}

export class ChangeStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'orderId不能为空' })
  orderId: string;
}

export class GetOrderByPageDto extends PageOptionsDto {
  @ApiProperty({
    description: '订单状态',
  })
  @IsOptional()
  // @IsNotEmpty()
  orderStatus: string | number;
}

export class updateDto extends ChangeStatusDto {
  @ApiProperty({
    description: '取件时间',
  })
  @IsOptional()
  pickupTm: 'string';

  @ApiProperty({
    description: '取件地址',
  })
  @IsOptional()
  pickupAd: object;

  @ApiProperty({
    description: '联系人信息',
  })
  @IsOptional()
  contactInfo: object;
}
