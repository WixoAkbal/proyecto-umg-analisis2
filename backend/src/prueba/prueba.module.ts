import { Module } from '@nestjs/common';
import { PruebaController } from './prueba.controller';
import { PruebaService } from './prueba.service';

@Module({
  controllers: [PruebaController],
  providers: [PruebaService]
})
export class PruebaModule {}
