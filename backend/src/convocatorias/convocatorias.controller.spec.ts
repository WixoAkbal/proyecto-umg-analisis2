import { Test, TestingModule } from '@nestjs/testing';
import { ConvocatoriasController } from './convocatorias.controller';
import { ConvocatoriasService } from './convocatorias.service';

describe('ConvocatoriasController', () => {
  let controller: ConvocatoriasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvocatoriasController],
      providers: [ConvocatoriasService],
    }).compile();

    controller = module.get<ConvocatoriasController>(ConvocatoriasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
