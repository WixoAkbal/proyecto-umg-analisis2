import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'tipos-becas',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tipos-becas/tipos-becas').then((m) => m.TiposBecas),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];