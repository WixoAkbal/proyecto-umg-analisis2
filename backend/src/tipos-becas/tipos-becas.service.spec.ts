import { Test, TestingModule } from '@nestjs/testing';
import { TiposBecasService } from './tipos-becas.service';

describe('TiposBecasService', () => {
  let service: TiposBecasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiposBecasService],
    }).compile();

    service = module.get<TiposBecasService>(TiposBecasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
