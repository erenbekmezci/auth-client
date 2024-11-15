import {Routes} from '@angular/router';
import {authGuard} from "./auth.guard";
import {accountGuard} from "./account.guard";


export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(mod => mod.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(mod => mod.LoginComponent),
    canActivate: [accountGuard]
  },

];