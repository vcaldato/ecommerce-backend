import { StateService } from '../services/state.service';
import { State } from '../entities/state.entity';
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

@Controller('states')
export class StateController {
  constructor(private readonly service: StateService) {}

  @Get()
  findAll(): Promise<State[]> {
    //Retorna todas as categorias
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<State> {
    const found = await this.service.findById(id); //

    if (!found) {
      throw new HttpException('State not found', HttpStatus.NOT_FOUND);
    }

    return found;
  }

  @Post()
  create(@Body() state: State): Promise<State> {
    return this.service.save(state);
  }

  @Put(':id')
  async cupdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    state: State,
  ): Promise<State> {
    const found = await this.service.findById(id);

    if (!found) {
      throw new HttpException('State not found', HttpStatus.NOT_FOUND);
    }

    state.id = id;

    return this.service.save(state);
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
