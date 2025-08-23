import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ROUTING_KEYS } from '@p2p-lending/common';
import { CreateLoanRequest } from '@p2p-lending/contracts/loan';

import { PaymentServiceService } from './payment-service.service';

@Controller()
export class PaymentServiceController {
  private readonly logger = new Logger(PaymentServiceController.name);
  constructor(private readonly paymentServiceService: PaymentServiceService) {}
  @EventPattern(ROUTING_KEYS.LOAN)
  handleLoanCreated(@Payload() loan: CreateLoanRequest) {
    this.logger.debug('Loan created:', loan);
  }
}
