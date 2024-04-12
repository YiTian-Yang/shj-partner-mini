import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { AlipayOrderService } from '../../shared/services/alipay.service';
import { OrdersService } from './orders.service';
import { LoggerService } from 'src/shared/logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import {
  CreateOrderDto,
  GetOrderByPageDto,
  ChangeStatusDto,
  updateDto,
} from './dto/order.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('回收订单')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private alipayOrderService: AlipayOrderService,
    private jwtService: JwtService,
    private logger: LoggerService,
  ) {}
  @ApiOperation({ summary: '创建回收订单' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Headers() Headers, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto, Headers);
  }

  @ApiOperation({ summary: '分页获取回收订单' })
  @UseGuards(AuthGuard)
  @Post('/getOrdersBypage')
  getOrdersBypage(@Headers() Headers, @Body() params: GetOrderByPageDto) {
    return this.ordersService.getOrdersBypage(params, Headers);
  }

  @ApiOperation({ summary: '取消回收订单' })
  @UseGuards(AuthGuard)
  @Post('/cancelOrder')
  cancelOrder(@Body() params: ChangeStatusDto) {
    return this.ordersService.cancelOrder(params);
  }

  @ApiOperation({ summary: '同意回收订单报价' })
  @UseGuards(AuthGuard)
  @Post('/agreePrice')
  async agreePrice(@Body() params: ChangeStatusDto, @Headers() header) {
    const data = await this.ordersService.agreePrice(params);
    try {
      await this.ordersService.createPurchase(params.orderId);
    } catch (error) {
      this.logger.error({
        context: '创建采购单失败',
        error: error,
      });
    }
    return data;
  }

  @ApiOperation({ summary: '拒绝回收订单报价' })
  @UseGuards(AuthGuard)
  @Post('/rejectPrice')
  rejectPrice(@Body() params: ChangeStatusDto) {
    return this.ordersService.rejectPrice(params);
  }

  @ApiOperation({ summary: '获取回收订单详情' })
  @UseGuards(AuthGuard)
  @Post('/getOrderInfo')
  getOrderInfo(@Body() params: ChangeStatusDto) {
    return this.ordersService.getOrderInfo(params);
  }

  @ApiOperation({ summary: '更改取件时间' })
  @UseGuards(AuthGuard)
  @Post('/editPickupTm')
  editPickupTm(@Body() params: updateDto) {
    return this.ordersService.editPickupTm(params);
  }

  @ApiOperation({ summary: '更改取件地址' })
  @UseGuards(AuthGuard)
  @Post('/editPickupAd')
  editPickupAd(@Body() params: updateDto) {
    return this.ordersService.editPickupAd(params);
  }

  @ApiOperation({ summary: '获取用户订单数量' })
  @UseGuards(AuthGuard)
  @Post('/getOrderCount')
  getOrderCount(@Headers() Headers) {
    return this.ordersService.getOrderCount(Headers);
  }

  @ApiOperation({ summary: '保存取消原因' })
  @UseGuards(AuthGuard)
  @Post('/saveCancelReason')
  saveCancelReason(@Body() Body) {
    return this.ordersService.saveCancelReason(Body);
  }
}
