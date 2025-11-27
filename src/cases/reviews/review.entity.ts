import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Customer } from '../customers/customer.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/entities/order.entity';

@Entity('review')
@Unique(['customer', 'product'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, { nullable: false })
  customer: Customer;

  @ManyToOne(() => Product, { eager: true, nullable: false })
  product: Product;

  @ManyToOne(() => Order, { nullable: true })
  order: Order | null;

  @Column('int', { nullable: false })
  rating: number;

  @Column('text', { nullable: true })
  comment: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

