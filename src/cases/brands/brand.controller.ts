import { BrandService } from './brand.service';
import { Brand } from './brand.entity';
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
} from '@nestjs/common';

@Controller('categories')
export class BrandController {
  constructor(private readonly service: BrandService) {}

  @Get()
  findAll(): Promise<Brand[]> {
    //Retorna todas as categorias
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Brand> {
    const found = await this.service.findById(id); //

    if (!found) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    return found;
  }

  @Post()
  create(@Body() brand: Brand): Promise<Brand> {
    return this.service.save(brand);
  }

  @Put(':id')
  async cupdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    brand: Brand,
  ): Promise<Brand> {
    const found = await this.service.findById(id);

    if (!found) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    brand.id = id;

    return this.service.save(brand);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const found = await this.service.findById(id);

    if (!found) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return this.service.remove(id);
  }
}
