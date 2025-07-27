// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
//   timestamp: string;
//   path: string;
// }

// @Injectable()
// export class ResponseInterceptor<T>
//   implements NestInterceptor<T, ApiResponse<T>>
// {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Observable<ApiResponse<T>> {
//     // TODO: Implement response formatting logic
//     return next.handle().pipe(
//       map((data) => ({
//         success: true,
//         data,
//         timestamp: new Date().toISOString(),
//         path: context.switchToHttp().getRequest().url,
//       })),
//     );
//   }
// }
