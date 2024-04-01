import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/page.dto';


interface productInfo {
  categoryId: string;
  brandId: string;
  modelId: string;
  valuationPrice: number;
  quotePrice: number;
  valuationDetails: string;
}

interface pickupInfo {
  contactPerson: string;
  contactPhone: string;
  pickupAddress: string;
  pickupTime: string;
  waybillNumber?: string;
  parcelNumber?: string;
}

export class GetOrderByPageDto extends PageOptionsDto {
  @ApiProperty({
    description: '订单状态',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'orderlistType不能为空' })
  orderStatus: number;
}
