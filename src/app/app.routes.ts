import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'cep-search',
    loadComponent: () => import('./features/cep-search/cep-search.component').then(c => c.CepSearchComponent)
  },
  {
    path: 'bank-list',
    loadComponent: () => import('./features/bank-list/bank-list.component').then(c => c.BankListComponent)
  },
  {
    path: 'cnpj-search',
    loadComponent: () => import('./features/cnpj-search/cnpj-search.component').then(c => c.CnpjSearchComponent)
  },
  {
    path: 'taxas-dashboard',
    loadComponent: () => import('./features/taxas-dashboard/taxas-dashboard.component').then(c => c.TaxasDashboardComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
