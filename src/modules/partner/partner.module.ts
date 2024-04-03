import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ShjPartner from '../../entities/partner/partner/shj-partner.entity';
import { PartnerService } from './partner.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ShjPartner], 'partner')],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
