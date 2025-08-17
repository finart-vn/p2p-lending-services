import { Injectable } from '@nestjs/common';

@Injectable()
export class LoanServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
