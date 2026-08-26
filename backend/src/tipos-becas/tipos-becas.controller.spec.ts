import { Test, TestingModule } from '@nestjs/testing';
import { TiposBecasController } from './tipos-becas.controller';
import { TiposBecasService } from './tipos-becas.service';

describe('TiposBecasController', () => {
  let controller: TiposBecasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposBecasController],
      providers: [TiposBecasService],
    }).compile();

    controller = module.get<TiposBecasController>(TiposBecasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
