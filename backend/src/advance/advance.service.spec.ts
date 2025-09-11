import { Test, TestingModule } from '@nestjs/testing';
import { AdvanceService } from './advance.service';

describe('AdvanceService', () => {
  let service: AdvanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvanceService],
    }).compile();

    service = module.get<AdvanceService>(AdvanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
