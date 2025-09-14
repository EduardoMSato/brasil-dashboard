import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CepService } from '../../core/services/cep.service';
import { BankService } from '../../core/services/bank.service';
import { CnpjService } from '../../core/services/cnpj.service';
import { TaxasService } from '../../core/services/taxas.service';
import { ICepData } from '../../shared/interfaces/cep-data.interface';
import { IBankData } from '../../shared/interfaces/bank-data.interface';
import { ICnpjData } from '../../shared/interfaces/cnpj-data.interface';
import { ITaxaData } from '../../shared/interfaces/taxa-data.interface';

interface ApiStatus {
  name: string;
  icon: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  route?: string;
  data?: any;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="header-section">
        <h1>🇧🇷 Brasil Dashboard</h1>
        <p>Dashboard integrado com 4 APIs brasileiras para demonstração técnica</p>
      </div>

      <!-- API Status Overview -->
      <div class="api-status-grid">
        <mat-card *ngFor="let api of apiStatuses" class="api-status-card" [ngClass]="api.status">
          <mat-card-header>
            <mat-card-title>
              <span class="api-icon">{{ api.icon }}</span>
              {{ api.name }}
            </mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="status-indicator">
              <mat-progress-spinner 
                *ngIf="api.status === 'loading'" 
                mode="indeterminate" 
                diameter="30">
              </mat-progress-spinner>
              
              <mat-icon 
                *ngIf="api.status === 'success'" 
                class="status-icon success">
                check_circle
              </mat-icon>
              
              <mat-icon 
                *ngIf="api.status === 'error'" 
                class="status-icon error">
                error
              </mat-icon>
            </div>
            
            <p class="status-message">{{ api.message }}</p>
            
            <!-- Sample Data Preview -->
            <div *ngIf="api.status === 'success' && api.data" class="data-preview">
              <ng-container [ngSwitch]="api.name">
                <!-- CEP Preview -->
                <div *ngSwitchCase="'CEP API'">
                  <small><strong>{{ api.data.street }}</strong></small><br>
                  <small>{{ api.data.city }} - {{ api.data.state }}</small>
                </div>
                
                <!-- Banks Preview -->
                <div *ngSwitchCase="'Banks API'">
                  <small><strong>{{ api.data?.length || 0 }} bancos carregados</strong></small><br>
                  <small>Ex: {{ api.data?.[0]?.name }}</small>
                </div>
                
                <!-- CNPJ Preview -->
                <div *ngSwitchCase="'CNPJ API'">
                  <small><strong>{{ api.data.nome_fantasia }}</strong></small><br>
                  <small>{{ api.data.razao_social }}</small>
                </div>
                
                <!-- Taxas Preview -->
                <div *ngSwitchCase="'Taxas API'">
                  <small><strong>{{ api.data?.length || 0 }} taxas disponíveis</strong></small><br>
                  <small>Ex: {{ api.data?.[0]?.nome }}</small>
                </div>
              </ng-container>
            </div>
          </mat-card-content>
          
          <mat-card-actions *ngIf="api.route">
            <button 
              mat-raised-button 
              color="primary" 
              [routerLink]="api.route"
              [disabled]="api.status === 'loading'">
              <mat-icon>open_in_new</mat-icon>
              Explorar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>🚀 Acesso Rápido às Funcionalidades</h2>
        
        <div class="actions-grid">
          <mat-card class="action-card" routerLink="/cep-search">
            <mat-card-content>
              <mat-icon class="action-icon">place</mat-icon>
              <h3>Consulta CEP</h3>
              <p>Busque informações completas de endereços brasileiros</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" routerLink="/bank-list">
            <mat-card-content>
              <mat-icon class="action-icon">account_balance</mat-icon>
              <h3>Lista de Bancos</h3>
              <p>Explore todos os bancos brasileiros cadastrados</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" routerLink="/cnpj-search">
            <mat-card-content>
              <mat-icon class="action-icon">business</mat-icon>
              <h3>Consulta CNPJ</h3>
              <p>Acesse dados completos de empresas brasileiras</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" routerLink="/taxas-dashboard">
            <mat-card-content>
              <mat-icon class="action-icon">trending_up</mat-icon>
              <h3>Taxas Financeiras</h3>
              <p>Acompanhe cotações e taxas atualizadas</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- System Info -->
      <mat-card class="system-info">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>info</mat-icon>
            Informações do Sistema
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <strong>Framework:</strong>
              <span>Angular {{ angularVersion }}</span>
            </div>
            
            <div class="info-item">
              <strong>APIs Integradas:</strong>
              <span>Brasil API (4 endpoints)</span>
            </div>
            
            <div class="info-item">
              <strong>Última Atualização:</strong>
              <span>{{ lastUpdated | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            
            <div class="info-item">
              <strong>Status do Sistema:</strong>
              <span class="system-status" [ngClass]="systemStatus">
                {{ systemStatusText }}
              </span>
            </div>
          </div>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-button (click)="refreshAllAPIs()">
            <mat-icon>refresh</mat-icon>
            Atualizar Todas as APIs
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header-section {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        color: #003D7A;
        font-size: 2.5rem;
        margin: 0 0 0.5rem 0;
        font-weight: 600;
      }

      p {
        color: #666;
        font-size: 1.1rem;
        margin: 0;
      }
    }

    .api-status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .api-status-card {
      transition: all 0.3s ease;
      border-radius: 12px;
      overflow: hidden;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      &.loading {
        border-left: 4px solid #FFD700;
      }

      &.success {
        border-left: 4px solid #27AE60;
      }

      &.error {
        border-left: 4px solid #E74C3C;
      }

      .api-icon {
        font-size: 1.2rem;
        margin-right: 0.5rem;
      }

      .status-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 0;

        .status-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;

          &.success { color: #27AE60; }
          &.error { color: #E74C3C; }
        }
      }

      .status-message {
        text-align: center;
        color: #666;
        margin: 0.5rem 0;
      }

      .data-preview {
        background: #f8f9fa;
        padding: 0.75rem;
        border-radius: 6px;
        margin-top: 1rem;
        text-align: center;

        small {
          color: #333;
          line-height: 1.4;
        }
      }
    }

    .quick-actions {
      margin-bottom: 3rem;

      h2 {
        color: #003D7A;
        text-align: center;
        margin-bottom: 2rem;
        font-size: 1.8rem;
      }
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 12px;
      text-align: center;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0, 61, 122, 0.15);
        background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
      }

      .action-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #003D7A;
        margin-bottom: 1rem;
      }

      h3 {
        color: #003D7A;
        margin: 0 0 0.5rem 0;
        font-size: 1.3rem;
      }

      p {
        color: #666;
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.5;
      }
    }

    .system-info {
      border-radius: 12px;

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          strong {
            color: #003D7A;
            font-size: 0.9rem;
          }

          span {
            color: #333;
            font-size: 1rem;
          }

          .system-status {
            font-weight: 600;

            &.operational { color: #27AE60; }
            &.degraded { color: #F39C12; }
            &.down { color: #E74C3C; }
          }
        }
      }
    }

    // Responsive Design
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 15px;
      }

      .header-section h1 {
        font-size: 2rem;
      }

      .api-status-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }

      .action-card .action-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  apiStatuses: ApiStatus[] = [
    {
      name: 'CEP API',
      icon: '📍',
      status: 'loading',
      message: 'Verificando conexão...',
      route: '/cep-search'
    },
    {
      name: 'Banks API',
      icon: '🏦',
      status: 'loading',
      message: 'Carregando bancos...',
      route: '/bank-list'
    },
    {
      name: 'CNPJ API',
      icon: '🏢',
      status: 'loading',
      message: 'Testando consultas...',
      route: '/cnpj-search'
    },
    {
      name: 'Taxas API',
      icon: '💰',
      status: 'loading',
      message: 'Obtendo cotações...',
      route: '/taxas-dashboard'
    }
  ];

  angularVersion = '17+';
  lastUpdated = new Date();
  systemStatus = 'operational';
  systemStatusText = 'Operacional';

  constructor(
    private cepService: CepService,
    private bankService: BankService,
    private cnpjService: CnpjService,
    private taxasService: TaxasService
  ) {}

  ngOnInit(): void {
    this.testAllAPIs();
  }

  testAllAPIs(): void {
    this.testCepAPI();
    this.testBanksAPI();
    this.testCnpjAPI();
    this.testTaxasAPI();
  }

  private testCepAPI(): void {
    const cepApi = this.apiStatuses.find(api => api.name === 'CEP API')!;
    
    this.cepService.getCepData('01001000').subscribe({
      next: (data) => {
        cepApi.status = 'success';
        cepApi.message = 'Conectado e funcionando';
        cepApi.data = data;
        this.updateSystemStatus();
      },
      error: (error) => {
        cepApi.status = 'error';
        cepApi.message = 'Erro: ' + error.message;
        this.updateSystemStatus();
      }
    });
  }

  private testBanksAPI(): void {
    const banksApi = this.apiStatuses.find(api => api.name === 'Banks API')!;
    
    this.bankService.getBanks().subscribe({
      next: (data) => {
        banksApi.status = 'success';
        banksApi.message = `${data.length} bancos carregados`;
        banksApi.data = data;
        this.updateSystemStatus();
      },
      error: (error) => {
        banksApi.status = 'error';
        banksApi.message = 'Erro: ' + error.message;
        this.updateSystemStatus();
      }
    });
  }

  private testCnpjAPI(): void {
    const cnpjApi = this.apiStatuses.find(api => api.name === 'CNPJ API')!;
    
    // Test with Banco do Brasil CNPJ
    this.cnpjService.getCnpjData('00000000000191').subscribe({
      next: (data) => {
        cnpjApi.status = 'success';
        cnpjApi.message = 'Consultas funcionando';
        cnpjApi.data = data;
        this.updateSystemStatus();
      },
      error: (error) => {
        cnpjApi.status = 'error';
        cnpjApi.message = 'Erro: ' + error.message;
        this.updateSystemStatus();
      }
    });
  }

  private testTaxasAPI(): void {
    const taxasApi = this.apiStatuses.find(api => api.name === 'Taxas API')!;
    
    this.taxasService.getTaxas().subscribe({
      next: (data) => {
        taxasApi.status = 'success';
        taxasApi.message = `${data.length} taxas disponíveis`;
        taxasApi.data = data;
        this.updateSystemStatus();
      },
      error: (error) => {
        taxasApi.status = 'error';
        taxasApi.message = 'Erro: ' + error.message;
        this.updateSystemStatus();
      }
    });
  }

  private updateSystemStatus(): void {
    const loadingApis = this.apiStatuses.filter(api => api.status === 'loading').length;
    const errorApis = this.apiStatuses.filter(api => api.status === 'error').length;
    const successApis = this.apiStatuses.filter(api => api.status === 'success').length;

    if (loadingApis > 0) {
      this.systemStatus = 'operational';
      this.systemStatusText = 'Verificando conexões...';
    } else if (errorApis === 0) {
      this.systemStatus = 'operational';
      this.systemStatusText = 'Todas as APIs funcionando';
    } else if (errorApis < this.apiStatuses.length / 2) {
      this.systemStatus = 'degraded';
      this.systemStatusText = 'Algumas APIs com problemas';
    } else {
      this.systemStatus = 'down';
      this.systemStatusText = 'Problemas de conectividade';
    }

    this.lastUpdated = new Date();
  }

  refreshAllAPIs(): void {
    // Reset all statuses to loading
    this.apiStatuses.forEach(api => {
      api.status = 'loading';
      api.message = 'Verificando conexão...';
      api.data = undefined;
    });

    this.systemStatus = 'operational';
    this.systemStatusText = 'Atualizando...';
    
    // Test all APIs again
    this.testAllAPIs();
  }
}