import { Test, TestingModule } from '@nestjs/testing';
import { ComitesMiembrosController } from './comites-miembros.controller';
import { ComitesMiembrosService } from './comites-miembros.service';

describe('ComitesMiembrosController', () => {
  let controller: ComitesMiembrosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComitesMiembrosController],
      providers: [ComitesMiembrosService],
    }).compile();

    controller = module.get<ComitesMiembrosController>(ComitesMiembrosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
