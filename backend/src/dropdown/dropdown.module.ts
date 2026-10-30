import { Module } from '@nestjs/common';
import { NivelesAcademicosModule } from 'src/niveles-academicos/niveles-academicos.module';
import { DropdownController } from './dropdown.controller';
import { DropdownServices } from './dropdown.service';

@Module({
  imports: [
    NivelesAcademicosModule
  ],
  controllers: [DropdownController],
  providers: [DropdownServices],
  exports: [DropdownServices],
})
export class DropdownModule {}