import { Test, TestingModule } from '@nestjs/testing';
import { EstadosRegistroController } from './estados-registro.controller';
import { EstadosRegistroService } from './estados-registro.service';

describe('EstadosRegistroController', () => {
  let controller: EstadosRegistroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadosRegistroController],
      providers: [EstadosRegistroService],
    }).compile();

    controller = module.get<EstadosRegistroController>(EstadosRegistroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
