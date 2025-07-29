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
  authService: {
    name: RmqService.AUTH,
    ...getRmqOptions(RmqQueue.AUTH),
  } as ClientProviderOptions,

  userService: {
    name: RmqService.USER,
    ...getRmqOptions(RmqQueue.USER),
  } as ClientProviderOptions,
};

export const getMicroserviceConfig = (
  serviceName: keyof typeof microservicesConfig,
): ClientProviderOptions => {
  return microservicesConfig[serviceName];
};
