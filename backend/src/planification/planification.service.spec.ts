import { Test, TestingModule } from '@nestjs/testing';
import { PlanificationService } from './planification.service';

describe('PlanificationService', () => {
  let service: PlanificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanificationService],
    }).compile();

    service = module.get<PlanificationService>(PlanificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
