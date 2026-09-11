import { Test, TestingModule } from '@nestjs/testing';
import { ComitesController } from './comites.controller';
import { ComitesService } from './comites.service';

describe('ComitesController', () => {
  let controller: ComitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComitesController],
      providers: [ComitesService],
    }).compile();

    controller = module.get<ComitesController>(ComitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
