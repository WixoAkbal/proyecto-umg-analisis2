import { Test, TestingModule } from '@nestjs/testing';
import { ComitesMiembrosService } from './comites-miembros.service';

describe('ComitesMiembrosService', () => {
  let service: ComitesMiembrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComitesMiembrosService],
    }).compile();

    service = module.get<ComitesMiembrosService>(ComitesMiembrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
