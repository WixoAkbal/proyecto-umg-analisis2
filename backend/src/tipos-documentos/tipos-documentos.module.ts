import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposDocumentosService } from './tipos-documentos.service';
import { TiposDocumentosController } from './tipos-documentos.controller';
import { TiposDocumento } from './entities/tipos-documento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiposDocumento])],
  controllers: [TiposDocumentosController],
  providers: [TiposDocumentosService],
})
export class TiposDocumentosModule {}