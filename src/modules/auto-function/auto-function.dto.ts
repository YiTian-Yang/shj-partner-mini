import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';
export class AutoCreatePurchaseDto {
  @ApiProperty({
    required: false,
    description: '采购渠道',
  })
  @IsInt()
  purchaseChannel: number;

  @ApiProperty({
    description: '订单编号',
    required: false,
  })
  @IsInt()
  orderId: number;
}
