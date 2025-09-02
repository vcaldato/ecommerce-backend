import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateService } from '../cities/services/state.service';
import { StateController } from '../cities/controllers/state.controller';
import { State } from '../cities/entities/state.entity';
import { City } from './entities/city.entity';
import { CityService } from './services/city.service';
import { CityController } from './controllers/city.controller';

@Module({
  imports: [TypeOrmModule.forFeature([State, City])],
  providers: [StateService, CityService],
  controllers: [StateController, CityController],
})
export class CityModule {}
