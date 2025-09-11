import { Test, TestingModule } from '@nestjs/testing';
import { AdvanceController } from './advance.controller';
import { AdvanceService } from './advance.service';

describe('AdvanceController', () => {
  let controller: AdvanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvanceController],
      providers: [AdvanceService],
    }).compile();

    controller = module.get<AdvanceController>(AdvanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
