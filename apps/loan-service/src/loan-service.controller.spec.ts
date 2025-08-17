import { Test, TestingModule } from '@nestjs/testing';
import { LoanServiceController } from './loan-service.controller';
import { LoanServiceService } from './loan-service.service';

describe('LoanServiceController', () => {
  let loanServiceController: LoanServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LoanServiceController],
      providers: [LoanServiceService],
    }).compile();

    loanServiceController = app.get<LoanServiceController>(LoanServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(loanServiceController.getHello()).toBe('Hello World!');
    });
  });
});
