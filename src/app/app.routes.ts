import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Arcade Vault · Portal Retro',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'biblioteca',
    title: 'Biblioteca · Arcade Vault',
    loadComponent: () => import('./pages/library/library').then((m) => m.LibraryPage),
  },
  {
    path: 'biblioteca/:id',
    title: 'Detalle · Arcade Vault',
    loadComponent: () => import('./pages/game-detail/game-detail').then((m) => m.GameDetailPage),
  },
  {
    path: 'biblioteca/:id/jugar',
    title: 'Jugar · Arcade Vault',
    loadComponent: () => import('./pages/game-player/game-player').then((m) => m.GamePlayerPage),
  },
  {
    path: 'salon-de-la-fama',
    title: 'Salón de la Fama · Arcade Vault',
    loadComponent: () => import('./pages/hall-of-fame/hall-of-fame').then((m) => m.HallOfFamePage),
  },
  {
    path: 'acerca-de',
    title: 'Acerca de · Arcade Vault',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage),
  },
  {
    path: 'acceso',
    title: 'Acceso · Arcade Vault',
    loadComponent: () => import('./pages/auth/auth').then((m) => m.AuthPage),
  },
  { path: '**', redirectTo: '' },
];
