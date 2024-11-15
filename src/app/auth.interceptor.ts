import { HttpInterceptorFn, HttpRequest, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, switchMap, throwError } from "rxjs";
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  // Eğer istek public ise (public sayfa gibi), interceptor'ı bypass et
  if (req.context.get(IS_PUBLIC)) {
    return next(req);
  }

  const accessToken = localStorage.getItem('accessToken');
  
  // Eğer kullanıcı giriş yaptıysa token ekle
  if (accessToken) {
    const authRequest = addAuthorizationHeader(req, accessToken);
    return next(authRequest).pipe(
      catchError((error) => {
        console.log( error.status)
        if (error instanceof HttpErrorResponse && error.status === 401) {
         
          console.log("Token süresi dolmuşsa ve refresh token geçerliyse yeni token al", error.status)
          return authSvc.refreshToken().pipe(
            switchMap((newAccessToken) => {
              if (newAccessToken) {
                const authRequestWithNewToken = addAuthorizationHeader(req, newAccessToken.data.accessToken);
                return next(authRequestWithNewToken);
              } else {
                authSvc.logout();
                console.log("patladı")
                return throwError(() => new Error('Refresh token is invalid'));
              }
            })
          );
        }
        return throwError(() => error);
      })
    );
  } else {
    // Token yoksa login sayfasına yönlendir

    return throwError(() => new Error('User is not authenticated'));
  }
};

const addAuthorizationHeader = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
};

export const IS_PUBLIC = new HttpContextToken(() => false);
