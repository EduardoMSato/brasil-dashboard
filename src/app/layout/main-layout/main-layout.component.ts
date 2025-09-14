import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent, NavigationItem } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  title = '🇧🇷 Brasil Dashboard';
  sidenavOpened = true;

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

  toggleSidenav(drawer: any): void {
    if (drawer.opened) {
      drawer.close();
      this.sidenavOpened = false;
    } else {
      drawer.open();
      this.sidenavOpened = true;
    }
  }

  onNavigationClick(drawer: any): void {
    // Close drawer on mobile after navigation
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        drawer.close();
      }
    });
  }
}