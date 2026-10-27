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
      {
        path: 'solicitudes',
        loadComponent: () => import('./pages/solicitudes/solicitudes').then((m) => m.Solicitudes),
      },
      {
        path: 'evaluaciones',
        loadComponent: () =>
          import('./pages/evaluaciones/evaluaciones').then((m) => m.Evaluaciones),
      },
      {
        path: 'comites',
        loadComponent: () => import('./pages/comites/comites').then((m) => m.Comites),
      },
      {
        path: 'autorizaciones',
        loadComponent: () =>
          import('./pages/autorizaciones/autorizaciones').then((m) => m.Autorizaciones),
      },
      {
        path: 'reportes',
        loadComponent: () => import('./pages/reportes/reportes').then((m) => m.Reportes),
      },
      {
        path: 'mis-solicitudes',
        loadComponent: () =>
          import('./pages/mis-solicitudes/mis-solicitudes').then((m) => m.MisSolicitudes),
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./pages/notificaciones/notificaciones').then((m) => m.Notificaciones),
      },
      {
        path: 'catalogos/niveles-academicos',
        data: { titulo: 'Niveles académicos', endpoint: 'niveles-academicos' },
        loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo),
      },
      {
        path: 'catalogos/tipos-documentos',
        data: { titulo: 'Tipos de documentos', endpoint: 'tipos-documentos' },
        loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo),
      },
      {
        path: 'catalogos/estados-convocatorias',
        data: { titulo: 'Estados de convocatoria', endpoint: 'estados-convocatorias' },
        loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo),
      },
      {
        path: 'catalogos/estados-solicitudes',
        data: { titulo: 'Estados de solicitud', endpoint: 'estados-solicitudes' },
        loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo),
      },
      { path: '', redirectTo: 'tipos-becas', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
