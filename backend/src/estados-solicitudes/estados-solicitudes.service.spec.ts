import { Test, TestingModule } from '@nestjs/testing';
import { EstadosSolicitudesService } from './estados-solicitudes.service';

describe('EstadosSolicitudesService', () => {
  let service: EstadosSolicitudesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadosSolicitudesService],
    }).compile();

    service = module.get<EstadosSolicitudesService>(EstadosSolicitudesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
