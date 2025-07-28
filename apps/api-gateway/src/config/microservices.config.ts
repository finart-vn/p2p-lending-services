import {
  ClientProviderOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { RmqQueue, RmqService } from '@p2p-lending/common/enums';
import { getRmqOptions } from '@p2p-lending/config/rmq.config';

export interface MicroserviceConfig {
  transport: Transport;
  options: RmqOptions;
}

export const microservicesConfig = {
  // TODO: Configure auth service connection
  authService: {
    name: RmqService.AUTH,
    ...getRmqOptions(RmqQueue.AUTH),
  } as ClientProviderOptions,

  // TODO: Configure user service connection
  userService: {
    name: RmqService.USER,
    ...getRmqOptions(RmqQueue.USER),
  } as ClientProviderOptions,

  // TODO: Configure other microservices as needed
  // loanService: { ... },
  // paymentService: { ... },
  // notificationService: { ... },
};

export const getMicroserviceConfig = (
  serviceName: keyof typeof microservicesConfig,
): ClientProviderOptions => {
  return microservicesConfig[serviceName];
};
