import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ShjPartner from '../../entities/partner/partner/shj-partner.entity';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(ShjPartner, 'partner')
    private readonly shjPartner: Repository<ShjPartner>,
  ) {}

  async getPartnerInfo(key: string) {
    return this.shjPartner.findOneBy({
      key,
    });
  }
}
