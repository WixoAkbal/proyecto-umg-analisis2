import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'tipos-becas',
        loadComponent: () => import('./pages/tipos-becas/tipos-becas').then((m) => m.TiposBecas),
      },
      {
        path: 'convocatorias',
        loadComponent: () =>
          import('./pages/convocatorias/convocatorias').then((m) => m.Convocatorias),
      },
      { path: '', redirectTo: 'tipos-becas', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];