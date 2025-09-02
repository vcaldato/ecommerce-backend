import { Product } from 'src/cases/products/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

enum OrderStatus {
  NEW = 'NEW',
  SEPARATION = 'SEPARATION',
  ENVOICED = 'ENVOICED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELADO',
}

@Entity('order-item')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Product, { eager: true, nullable: false })
  product: Product;

  @Column({ nullable: false })
  quantity: number;

  @Column('decimal', { nullable: true, precision: 10, scale: 2 })
  value: number;
}
