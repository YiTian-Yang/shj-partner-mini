import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCustomerAddress,
  DeleteCustomerAddress,
  UpdateCustomerAddress,
} from './customer-address.dto';
import ShjCustomerAddress from 'src/entities/partner/user/customer-address.entity';
import { ApiException } from 'src/common/exceptions/api.exception';

@Injectable()
export class CustomerAddressService {
  constructor(
    @InjectRepository(ShjCustomerAddress, 'partner')
    private readonly shjCustomerAddress: Repository<ShjCustomerAddress>,
  ) {}

  async create(
    createCustomerAddress: CreateCustomerAddress,
    user: string,
  ): Promise<void> {
    const data = await this.shjCustomerAddress.find({
      where: {
        userId: user,
      },
    });
    if (
      createCustomerAddress.name.trim() === '' ||
      !createCustomerAddress.phone ||
      !createCustomerAddress.region.trim() ||
      !createCustomerAddress.site.trim()
    ) {
      throw new ApiException(21007);
    }

    if (!isWithinLimits(createCustomerAddress.name, 30)) {
      throw new ApiException(21008);
    }
    if (!isWithinLimits(createCustomerAddress.site, 128)) {
      throw new ApiException(21008);
    }
    if (data.length >= 30) {
      throw new ApiException(21001);
    }
    if (
      !(
        createCustomerAddress.phone.length === 11 &&
        /^\d+$/.test(createCustomerAddress.phone)
      )
    ) {
      throw new ApiException(21003);
    }

    await this.shjCustomerAddress.insert({
      name: createCustomerAddress.name,
      phone: createCustomerAddress.phone,
      region: createCustomerAddress.region,
      site: createCustomerAddress.site,
      longitude: createCustomerAddress.latitude,
      latitude: createCustomerAddress.latitude,
      userId: user,
    });
  }

  async update(
    updateCustomerAddress: UpdateCustomerAddress,
    user: string,
  ): Promise<void> {
    const obj = await this.shjCustomerAddress.find({
      where: {
        userId: user,
      },
    });

    const flag = obj.some((item) => {
      return item.id == updateCustomerAddress.id;
    });

    if (!flag) {
      throw new ApiException(21006);
    }
    if (
      updateCustomerAddress.name.trim() === '' ||
      !updateCustomerAddress.phone.trim() ||
      !updateCustomerAddress.region.trim() ||
      !updateCustomerAddress.site.trim()
    ) {
      throw new ApiException(21007);
    }
    if (!isWithinLimits(updateCustomerAddress.name, 30)) {
      throw new ApiException(21008);
    }
    if (!isWithinLimits(updateCustomerAddress.site, 128)) {
      throw new ApiException(21008);
    }
    if (
      !(
        updateCustomerAddress.phone.length === 11 &&
        /^\d+$/.test(updateCustomerAddress.phone)
      )
    ) {
      throw new ApiException(21003);
    }
    await this.shjCustomerAddress.update(
      { id: updateCustomerAddress.id },
      {
        name: updateCustomerAddress.name,
        phone: updateCustomerAddress.phone,
        region: updateCustomerAddress.region,
        site: updateCustomerAddress.site,
        longitude: updateCustomerAddress.longitude,
        latitude: updateCustomerAddress.latitude,
      },
    );
  }

  async delete(
    deleteCustomerAddress: DeleteCustomerAddress,
    user: string,
  ): Promise<void> {
    const data = await this.shjCustomerAddress.find({
      where: {
        userId: user,
      },
    });

    const flag = data.some((item) => {
      return item.id == deleteCustomerAddress.id;
    });

    if (!flag) {
      throw new ApiException(21006);
    }
    await this.shjCustomerAddress.delete({ id: deleteCustomerAddress.id });
  }

  async findAll(userId: string) {
    return await this.shjCustomerAddress.find({
      where: {
        userId: userId,
      },
      order: {
        id: 'DESC',
      },
    });
  }
  async findOne(user: string, id: number) {
    const obj = await this.shjCustomerAddress.find({
      where: {
        userId: user,
      },
    });

    const flag = obj.some((item) => {
      return item.id == id;
    });

    if (!flag) {
      throw new ApiException(21006);
    }
    return await this.shjCustomerAddress.findOne({
      where: {
        id: id,
      },
    });
  }
}

function isWithinLimits(inputString, num) {
  // 计算字节长度
  const byteLength = new TextEncoder().encode(inputString).length;
  // 计算汉字个数
  const chineseCharacterCount =
    inputString.match(/[\u4e00-\u9fa5]/g)?.length || 0;

  return byteLength <= num * 2 && chineseCharacterCount <= num;
}
