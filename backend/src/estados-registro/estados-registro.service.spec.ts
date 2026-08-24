import { Test, TestingModule } from '@nestjs/testing';
import { EstadosRegistroService } from './estados-registro.service';

describe('EstadosRegistroService', () => {
  let service: EstadosRegistroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadosRegistroService],
    }).compile();

    service = module.get<EstadosRegistroService>(EstadosRegistroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
