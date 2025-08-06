// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   Logger,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   private readonly logger = new Logger(LoggingInterceptor.name);

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     // TODO: Implement request/response logging logic
//     const request = context.switchToHttp().getRequest();
//     const method = request.method;
//     const url = request.url;
//     const now = Date.now();

//     return next.handle().pipe(
//       tap(() => {
//         // TODO: Add detailed logging implementation
//         const duration = Date.now() - now;
//         this.logger.log(`${method} ${url} - ${duration}ms`);
//       }),
//     );
//   }
// }
