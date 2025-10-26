import { Test, TestingModule } from '@nestjs/testing';
import { PlanificationController } from './planification.controller';
import { PlanificationService } from './planification.service';

describe('PlanificationController', () => {
  let controller: PlanificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanificationController],
      providers: [PlanificationService],
    }).compile();

    controller = module.get<PlanificationController>(PlanificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
