import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CustomerService } from '../customers/customer.service';
import { ProductService } from '../products/product.service';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private repository: Repository<Favorite>,
    private customerService: CustomerService,
    private productService: ProductService,
  ) {}

  async add(customerId: string, productId: string): Promise<Favorite> {
    const customer = await this.customerService.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    const product = await this.productService.findById(productId);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    const existing = await this.repository.findOne({
      where: { customer: { id: customerId }, product: { id: productId } },
    });

    if (existing) {
      return existing;
    }

    const favorite = this.repository.create({
      customer,
      product,
    });

    return this.repository.save(favorite);
  }

  async remove(customerId: string, productId: string): Promise<void> {
    await this.repository.delete({
      customer: { id: customerId },
      product: { id: productId },
    });
  }

  async findByCustomerId(customerId: string): Promise<Favorite[]> {
    return this.repository.find({
      where: { customer: { id: customerId } },
      relations: ['product', 'product.category', 'product.brand'],
      order: { id: 'DESC' },
    });
  }

  async isFavorite(customerId: string, productId: string): Promise<boolean> {
    const favorite = await this.repository.findOne({
      where: { customer: { id: customerId }, product: { id: productId } },
    });
    return !!favorite;
  }
}

