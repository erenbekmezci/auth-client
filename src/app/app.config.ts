import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {JwtModule} from "@auth0/angular-jwt";
import { authInterceptor } from './auth.interceptor';
import {APP_INITIALIZER} from '@angular/core';
import {AuthService} from './auth.service'

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes) ,
    
    provideHttpClient(withInterceptors([authInterceptor])),

    importProvidersFrom([

      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('accessToken')
        }
      })

    ])
    //,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializerFactory,
    //   multi: true,
    //   deps: [AuthService]
    // },

  
  ]
};

export function initializerFactory(authService: AuthService) {
  return () => authService.refreshToken();
}