import { Test, TestingModule } from '@nestjs/testing';
import { EstadosConvocatoriasService } from './estados-convocatorias.service';

describe('EstadosConvocatoriasService', () => {
  let service: EstadosConvocatoriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadosConvocatoriasService],
    }).compile();

    service = module.get<EstadosConvocatoriasService>(EstadosConvocatoriasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
