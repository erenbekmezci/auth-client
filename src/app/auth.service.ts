import { DestroyRef, inject, Injectable,WritableSignal,signal } from '@angular/core';
import { environment } from './environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User,Login,LoginError,LoginSuccess,LoginResponse } from './index';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IS_PUBLIC} from "./auth.interceptor";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrlm = environment.apiUrl;
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly CONTEXT = {context : new HttpContext().set(IS_PUBLIC,true)};

  constructor(private http:HttpClient , private router : Router) {
 

  }

  get user(): WritableSignal<User | null> {
    console.log("getuser");
    const token = localStorage.getItem('accessToken');
    return signal(token ? this.jwtHelper.decodeToken(token) : null);
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return token ? true : false;
    //return !this.jwtHelper.isTokenExpired();
  }


  
  

  storeTokens(data: LoginSuccess): void {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }

  

  login(body: Login): Observable<LoginResponse> {


    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/CreateToken`, body, this.CONTEXT)
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            // Handle invalid credentials
            console.error('Invalid credentials');
          }
          return of();
        }),
        tap(response => {


          if(response.isSuccess)
          {
          console.log("login is success" , response.data);

            const loginSuccessData = response.data;
            this.storeTokens(loginSuccessData);
            //this.scheduleTokenRefresh(loginSuccessData.token);
            this.router.navigate(['/']);
          }
          else
          {
            console.log('Login failed:', response.errorMessage);

          }
        
        })
      );
  }


  logout(): void {
    // if you don't have any backend route to invalidate the refresh token
    // then just remove localStorage items and redirect to login route
    const refresh_token = localStorage.getItem('refreshToken');
    this.http.post<LoginResponse>(`${this.apiUrlm}/Auth/RevokeRefreshToken`, {token : refresh_token}, this.CONTEXT)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
      });
  }

  refreshToken(): Observable<LoginResponse | null> {
    console.log("ahmet");
    const refresh_token = localStorage.getItem('refreshToken');
    
    // Eğer refresh token yoksa null döndür
    if (!refresh_token) {
      return of(null);
    }
  
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/Auth/CreateTokenByRefreshToken`, 
      { token: refresh_token }, 
      this.CONTEXT
    ).pipe(
      catchError(() => {
        console.log("hata")
        return of(null)
  }), // catchError ile hata durumunda null döndür
      tap(response => {
        // response'u kontrol et ve login başarıyla gerçekleşmişse tokenları sakla
        if (response && response.isSuccess) {
          const loginSuccessData = response.data;
          this.storeTokens(loginSuccessData);
        }
      })
    );
  }
  
}
