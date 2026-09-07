import { Test, TestingModule } from '@nestjs/testing';
import { NivelesAcademicosController } from './niveles-academicos.controller';
import { NivelesAcademicosService } from './niveles-academicos.service';

describe('NivelesAcademicosController', () => {
  let controller: NivelesAcademicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NivelesAcademicosController],
      providers: [NivelesAcademicosService],
    }).compile();

    controller = module.get<NivelesAcademicosController>(NivelesAcademicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
