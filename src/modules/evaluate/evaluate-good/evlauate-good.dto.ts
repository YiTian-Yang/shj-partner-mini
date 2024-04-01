import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/page.dto';

export class SearchAllBrandDto {
  @ApiProperty({
    description: '类目ID',
  })
  @IsString()
  @IsNotEmpty()
  typeId: string;
}

export class SearchModelByPageDto extends PageOptionsDto {
  @ApiProperty({
    description: '类目ID',
  })
  @IsString()
  @IsNotEmpty()
  typeId: string;

  @ApiProperty({
    description: '品牌ID',
  })
  @IsString()
  @IsNotEmpty()
  brandId: string;
}

export class SearchLocalModelDto {
  @ApiProperty({
    description: '本机名称',
  })
  @IsString()
  @IsNotEmpty()
  modelName: string;
}

export class SearchModelDto extends PageOptionsDto {
  @ApiProperty({
    description: '搜索机型',
  })
  @IsString()
  @IsNotEmpty()
  modelName: string;
}
