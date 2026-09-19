import { Test, TestingModule } from '@nestjs/testing';
import { TiposDocumentosController } from './tipos-documentos.controller';
import { TiposDocumentosService } from './tipos-documentos.service';

describe('TiposDocumentosController', () => {
  let controller: TiposDocumentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposDocumentosController],
      providers: [TiposDocumentosService],
    }).compile();

    controller = module.get<TiposDocumentosController>(TiposDocumentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
