import { Module } from '@nestjs/common';
import { LoanServiceController } from './loan-service.controller';
import { LoanServiceService } from './loan-service.service';

@Module({
  imports: [],
  controllers: [LoanServiceController],
  providers: [LoanServiceService],
})
export class LoanServiceModule {}
