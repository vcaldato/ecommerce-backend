import { ProductService } from './product.service';
import { Product } from './product.entity';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CategoryService } from '../categories/category.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly CategoryService: CategoryService,
    private readonly service: ProductService,
  ) {}

  @Get()
  async findAll(
    @Query('categoryId', new ParseUUIDPipe({ optional: true }))
    categoryId?: string,
  ): Promise<Product[]> {
    if (!categoryId) {
      return this.service.findAll();
    }
    const category = await this.CategoryService.findById(categoryId);
    if (!category) {
      throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);
    }
    return this.service.findAll(category);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    const found = await this.service.findById(id); //

    if (!found) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }

    return found;
  }

  @Post()
  create(@Body() product: Product): Promise<Product> {
    return this.service.save(product);
  }

  @Put(':id')
  async cupdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    product: Product,
  ): Promise<Product> {
    const found = await this.service.findById(id);

    if (!found) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }

    product.id = id;

    return this.service.save(product);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const found = await this.service.findById(id);

    if (!found) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }

    return this.service.remove(id);
  }
}
