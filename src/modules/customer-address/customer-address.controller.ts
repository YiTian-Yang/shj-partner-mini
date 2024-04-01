import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Header,
  Headers,
} from '@nestjs/common';
import { CustomerAddressService } from './customer-address.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CreateCustomerAddress,
  DeleteCustomerAddress,
  UpdateCustomerAddress,
} from './customer-address.dto';
import { JwtService } from '@nestjs/jwt';
@ApiTags('收货地址')
@Controller('customer-address')
@UseGuards(AuthGuard)
export class CustomerAddressController {
  constructor(
    private readonly customerAddressService: CustomerAddressService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: '新增收货地址' })
  @Post('add')
  async getModelEvaluateConfig(
    @Headers() headers,
    @Body() createCustomerAddress: CreateCustomerAddress,
  ) {
    const user = this.jwtService.verify(headers['token']).uid;
    return await this.customerAddressService.create(
      createCustomerAddress,
      user,
    );
  }

  @ApiOperation({ summary: '编辑地址' })
  @Post('update')
  async update(
    @Headers() headers,
    @Body() updateCustomerAddress: UpdateCustomerAddress,
  ) {
    const user = this.jwtService.verify(headers['token']).uid;
    return await this.customerAddressService.update(
      updateCustomerAddress,
      user,
    );
  }

  @ApiOperation({ summary: '删除地址' })
  @Post('delete')
  async delete(
    @Headers() headers,
    @Body() deleteCustomerAddress: DeleteCustomerAddress,
  ) {
    const user = this.jwtService.verify(headers['token']).uid;

    return await this.customerAddressService.delete(
      deleteCustomerAddress,
      user,
    );
  }

  @ApiOperation({ summary: '查询该用户所有地址' })
  @Get()
  findAll(@Headers() headers) {
    const user = this.jwtService.verify(headers['token']).uid;
    return this.customerAddressService.findAll(user);
  }

  @ApiOperation({ summary: '查询编辑地址' })
  @Get('getSite/:id')
  findOne(@Headers() headers, @Param('id') id: number) {
    const user = this.jwtService.verify(headers['token']).uid;
    return this.customerAddressService.findOne(user, id);
  }
}
