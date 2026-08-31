import { Test, TestingModule } from '@nestjs/testing';
import { NivelesAcademicosService } from './niveles-academicos.service';

describe('NivelesAcademicosService', () => {
  let service: NivelesAcademicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NivelesAcademicosService],
    }).compile();

    service = module.get<NivelesAcademicosService>(NivelesAcademicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
