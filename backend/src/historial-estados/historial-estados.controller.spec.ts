import { Test, TestingModule } from '@nestjs/testing';
import { HistorialEstadosController } from './historial-estados.controller';
import { HistorialEstadosService } from './historial-estados.service';

describe('HistorialEstadosController', () => {
  let controller: HistorialEstadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialEstadosController],
      providers: [HistorialEstadosService],
    }).compile();

    controller = module.get<HistorialEstadosController>(HistorialEstadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
