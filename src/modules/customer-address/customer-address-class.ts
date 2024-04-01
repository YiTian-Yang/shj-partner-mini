import { ApiProperty } from '@nestjs/swagger';

export class accountInfo {
  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  site: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;
}
