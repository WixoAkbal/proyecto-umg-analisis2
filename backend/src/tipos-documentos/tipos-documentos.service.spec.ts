import { Test, TestingModule } from '@nestjs/testing';
import { TiposDocumentosService } from './tipos-documentos.service';

describe('TiposDocumentosService', () => {
  let service: TiposDocumentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiposDocumentosService],
    }).compile();

    service = module.get<TiposDocumentosService>(TiposDocumentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
