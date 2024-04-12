import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoFunctionController } from './auto-function.controller';
import { AutoFunctionService } from './auto-function.service';
import ShjPurchaseGood from 'src/entities/base/purchase/shj-purchase-good.entity';
import ShjPurchaseOrder from 'src/entities/base/purchase/shj-purchase-order.entity';
import ShjQualityGood from 'src/entities/base/quality/shj-quality-good.entity';
import ShjQualityOrder from 'src/entities/base/quality/shj-quality-order.entity';
import Order from 'src/entities/base/order/order.entity';

/**
 * 速焕机业务模块，所有API都需要加入/shj前缀
 */
@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        ShjPurchaseGood,
        ShjPurchaseOrder,
        ShjQualityGood,
        ShjQualityOrder,
        Order,
      ],
      'base',
    ),
  ],
  controllers: [AutoFunctionController],
  providers: [AutoFunctionService],
  exports: [AutoFunctionService],
})
export class AutoFunctionModule {}
