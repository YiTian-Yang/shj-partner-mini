import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { SfOrderService } from 'src/shared/services/sf-order.service';
import { OrdersController } from './orders.controller';
import { AlipayOrderService } from 'src/shared/services/alipay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Order from 'src/entities/base/order/order.entity';
import PaaymentInfo from 'src/entities/base/order/Payment-info.entity';
import PickupInfo from 'src/entities/base/order/pickup-info.entity';
import ProductInfo from 'src/entities/base/order/product-info.entity';
import ShjGoodModelEntity from 'src/entities/base/good/shj-good-model.entity';
import ShjGoodBrandEntity from 'src/entities/base/good/shj-good-brand.entity';
import ShjGoodTypeEntity from 'src/entities/base/good/shj-good-type.entity';
import { LoggerService } from 'src/shared/logger/logger.service';
import { SmsService } from 'src/shared/services/sms.service';
import ShjMiniProgramList from 'src/entities/partner/user/shj-mini-program-list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Order,
        PaaymentInfo,
        PickupInfo,
        ProductInfo,
        ShjGoodModelEntity,
        ShjGoodBrandEntity,
        ShjGoodTypeEntity,
      ],
      'base',
    ),
    TypeOrmModule.forFeature([ShjMiniProgramList], 'partner'),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    SfOrderService,
    AlipayOrderService,
    LoggerService,
    SmsService,
  ],
})
export class OrdersModule {}
