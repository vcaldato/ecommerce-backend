import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CustomerService } from '../customers/customer.service';
import { ProductService } from '../products/product.service';
import { OrderService } from '../orders/order.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private repository: Repository<Review>,
    private customerService: CustomerService,
    private productService: ProductService,
    private orderService: OrderService,
  ) {}

  async create(
    customerId: string,
    productId: string,
    rating: number,
    comment?: string,
    orderId?: string,
  ): Promise<Review> {
    const customer = await this.customerService.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    const product = await this.productService.findById(productId);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Avaliação deve ser entre 1 e 5 estrelas');
    }

    const existing = await this.repository.findOne({
      where: { customer: { id: customerId }, product: { id: productId } },
    });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment || null;
      if (orderId) {
        const order = await this.orderService.findById(orderId);
        if (order) {
          existing.order = order;
        }
      }
      const saved = await this.repository.save(existing);
      return saved;
    }

    const review = new Review();
    review.customer = customer;
    review.product = product;
    review.rating = rating;
    review.comment = comment || null;

    if (orderId) {
      const order = await this.orderService.findById(orderId);
      if (order) {
        review.order = order;
      }
    }

    const saved = await this.repository.save(review);
    return saved;
  }

  async findByProductId(productId: string): Promise<Review[]> {
    return this.repository.find({
      where: { product: { id: productId } },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomerId(customerId: string): Promise<Review[]> {
    return this.repository.find({
      where: { customer: { id: customerId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getProductRating(productId: string): Promise<{
    average: number;
    count: number;
  }> {
    const reviews = await this.findByProductId(productId);
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      average: sum / reviews.length,
      count: reviews.length,
    };
  }
}

