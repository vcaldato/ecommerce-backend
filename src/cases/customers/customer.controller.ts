import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
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

@Controller('customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get()
  findAll(): Promise<Customer[]> {
    //Retorna todas as categorias
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Customer> {
    const found = await this.service.findById(id); //

    if (!found) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    return found;
  }

  @Post()
  create(@Body() customer: Customer): Promise<Customer> {
    return this.service.save(customer);
  }

  @Put(':id')
  async cupdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    customer: Customer,
  ): Promise<Customer> {
    const found = await this.service.findById(id);

    if (!found) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    customer.id = id;

    return this.service.save(customer);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const found = await this.service.findById(id);

    if (!found) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    return this.service.remove(id);
  }
}
