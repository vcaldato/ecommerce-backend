import { FavoriteService } from './favorite.service';
import { Controller, Get, Post, Delete, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { Favorite } from './favorite.entity';

interface AddFavoriteDto {
  customerId: string;
  productId: string;
}

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  @Post()
  async add(@Body() dto: AddFavoriteDto): Promise<Favorite> {
    return this.service.add(dto.customerId, dto.productId);
  }

  @Delete(':customerId/:productId')
  async remove(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<void> {
    return this.service.remove(customerId, productId);
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<Favorite[]> {
    return this.service.findByCustomerId(customerId);
  }

  @Get('customer/:customerId/product/:productId')
  async isFavorite(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<{ isFavorite: boolean }> {
    const isFavorite = await this.service.isFavorite(customerId, productId);
    return { isFavorite };
  }
}

