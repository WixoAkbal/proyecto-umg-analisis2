import { Test, TestingModule } from '@nestjs/testing';
import { EstadosSolicitudesController } from './estados-solicitudes.controller';
import { EstadosSolicitudesService } from './estados-solicitudes.service';

describe('EstadosSolicitudesController', () => {
  let controller: EstadosSolicitudesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadosSolicitudesController],
      providers: [EstadosSolicitudesService],
    }).compile();

    controller = module.get<EstadosSolicitudesController>(EstadosSolicitudesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
