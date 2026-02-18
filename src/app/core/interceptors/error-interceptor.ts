import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('Global HTTP Error', error);
      let message = 'An unexpected error occured.';
      if (error.status === 0) {
        message = 'Unable to connect to server.';
      }
      if (error.status >= 500) {
        message = 'Server error. Please try again later.';
      }
      if (error.status === 404) {
        message = 'Requested resource not found.';
      }

      return throwError(() => ({ ...error, userMessage: message }));
    }),
  );
};
