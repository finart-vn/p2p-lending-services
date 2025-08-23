import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common';
import { CreateLoanRequest } from '@p2p-lending/contracts/loan';

import { PaymentServiceService } from './payment.service';

@Controller()
export class PaymentServiceController {
  private readonly logger = new Logger(PaymentServiceController.name);
  constructor(private readonly paymentServiceService: PaymentServiceService) {}
  @EventPattern(MESSAGE_PATTERNS.EVENTS.LOAN_CREATED)
  handleLoanCreated(@Payload() loan: CreateLoanRequest) {
    this.logger.debug('Loan created:', loan);
  }
}
