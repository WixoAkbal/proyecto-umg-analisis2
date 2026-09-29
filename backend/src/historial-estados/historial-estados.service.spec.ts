import { Test, TestingModule } from '@nestjs/testing';
import { HistorialEstadosService } from './historial-estados.service';

describe('HistorialEstadosService', () => {
  let service: HistorialEstadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialEstadosService],
    }).compile();

    service = module.get<HistorialEstadosService>(HistorialEstadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
