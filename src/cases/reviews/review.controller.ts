import { ReviewService } from './review.service';
import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { Review } from './review.entity';

interface CreateReviewDto {
  customerId: string;
  productId: string;
  rating: number;
  comment?: string;
  orderId?: string;
}

@Controller('reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Post()
  async create(@Body() dto: CreateReviewDto): Promise<Review> {
    return this.service.create(
      dto.customerId,
      dto.productId,
      dto.rating,
      dto.comment,
      dto.orderId,
    );
  }

  @Get('product/:productId')
  async findByProductId(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<Review[]> {
    return this.service.findByProductId(productId);
  }

  @Get('product/:productId/rating')
  async getProductRating(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<{ average: number; count: number }> {
    return this.service.getProductRating(productId);
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<Review[]> {
    return this.service.findByCustomerId(customerId);
  }
}

