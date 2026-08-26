import { Test, TestingModule } from '@nestjs/testing';
import { EstadosConvocatoriasController } from './estados-convocatorias.controller';
import { EstadosConvocatoriasService } from './estados-convocatorias.service';

describe('EstadosConvocatoriasController', () => {
  let controller: EstadosConvocatoriasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadosConvocatoriasController],
      providers: [EstadosConvocatoriasService],
    }).compile();

    controller = module.get<EstadosConvocatoriasController>(EstadosConvocatoriasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
