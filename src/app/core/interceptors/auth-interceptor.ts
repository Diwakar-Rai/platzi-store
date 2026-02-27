import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const accessToken = authService.accessToken();
  const authReq = accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        const refresh$ = authService.refreshAccessToken();
        if (!refresh$) {
          authService.logout();
          return throwError(() => error);
        }
        return refresh$.pipe(
          switchMap((res) => {
            authService.updateTokens(res.access_token, res.refresh_token);
            isRefreshing = false;

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access_token}` },
            });
            return next(retryReq);
          }),
          catchError((err) => {
            isRefreshing = false;
            authService.logout();
            return throwError(() => err);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
