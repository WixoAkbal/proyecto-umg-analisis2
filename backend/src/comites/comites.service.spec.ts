import { Test, TestingModule } from '@nestjs/testing';
import { ComitesService } from './comites.service';

describe('ComitesService', () => {
  let service: ComitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComitesService],
    }).compile();

    service = module.get<ComitesService>(ComitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
