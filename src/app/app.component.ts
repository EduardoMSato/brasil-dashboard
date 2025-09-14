import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface NavigationItem {
  name: string;
  route: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterModule,
    CommonModule, 
    MatToolbarModule,
    MatButtonModule, 
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '🇧🇷 Brasil Dashboard';
  
  navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
      description: 'Visão geral do sistema'
    },
    {
      name: 'Consulta CEP',
      route: '/cep-search',
      icon: 'place',
      description: 'Buscar endereços por CEP'
    },
    {
      name: 'Lista de Bancos',
      route: '/bank-list',
      icon: 'account_balance',
      description: 'Explorar bancos brasileiros'
    },
    {
      name: 'Consulta CNPJ',
      route: '/cnpj-search',
      icon: 'business',
      description: 'Buscar dados de empresas'
    },
    {
      name: 'Taxas Financeiras',
      route: '/taxas-dashboard',
      icon: 'trending_up',
      description: 'Acompanhar cotações'
    }
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
