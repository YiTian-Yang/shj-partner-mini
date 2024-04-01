import { Module } from '@nestjs/common';
import { CustomerAddressService } from './customer-address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddressController } from './customer-address.controller';
import ShjCustomerAddress from 'src/entities/partner/user/customer-address.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ShjCustomerAddress], 'base')],
  controllers: [CustomerAddressController],
  providers: [CustomerAddressService],
})
export class CustomerAddressModule {}
