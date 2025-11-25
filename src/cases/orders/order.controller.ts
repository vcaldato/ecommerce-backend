import { OrderService } from './order.service';
import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { Order } from './entities/order.entity';

interface CreateOrderDto {
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
  shipping?: number;
}

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.service.create(dto.customerId, dto.items, dto.shipping);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.service.findAll();
  }

  @Get('customer/:customerId')
  findByCustomerId(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<Order[]> {
    return this.service.findByCustomerId(customerId);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<Order | null> {
    return this.service.findById(id);
  }
}

