import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CustomerService } from '../customers/customer.service';
import { ProductService } from '../products/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private customerService: CustomerService,
    private productService: ProductService,
  ) {}

  async create(
    customerId: string,
    items: Array<{ productId: string; quantity: number }>,
    shipping?: number,
  ): Promise<Order> {
    const customer = await this.customerService.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    const orderItemsData = await Promise.all(
      items.map(async (item) => {
        const product = await this.productService.findById(item.productId);
        if (!product) {
          throw new Error(`Produto ${item.productId} não encontrado`);
        }
        return {
          product,
          quantity: item.quantity,
          value: product.price,
        };
      }),
    );

    const subtotal = orderItemsData.reduce(
      (acc, item) => acc + item.value * item.quantity,
      0,
    );
    const shippingValue = shipping || 0;
    const total = subtotal + shippingValue;

    const order = this.orderRepository.create({
      customer,
      shipping: shippingValue,
      total,
      status: 'NEW',
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = orderItemsData.map((item) =>
      this.orderItemRepository.create({
        order: savedOrder,
        product: item.product,
        quantity: item.quantity,
        value: item.value,
      }),
    );

    await this.orderItemRepository.save(orderItems);

    const createdOrder = await this.findById(savedOrder.id);
    if (!createdOrder) {
      throw new Error('Falha ao recuperar pedido criado');
    }
    return createdOrder;
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['customer', 'itens', 'itens.product'],
    });
  }

  findByCustomerId(customerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customer: { id: customerId } },
      relations: ['customer', 'itens', 'itens.product'],
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'itens', 'itens.product'],
    });
  }
}

