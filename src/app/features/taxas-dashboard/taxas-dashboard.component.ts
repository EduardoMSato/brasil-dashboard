import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TaxasService } from '../../core/services/taxas.service';
import { ITaxaData } from '../../shared/interfaces/taxa-data.interface';
import { Subscription, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

interface ITaxaCard {
  name: string;
  displayName: string;
  value: number;
  icon: string;
  type: 'percentage' | 'currency';
  color: string;
  description: string;
}

@Component({
  selector: 'app-taxas-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule
  ],
  templateUrl: './taxas-dashboard.component.html',
  styleUrls: ['./taxas-dashboard.component.scss']
})
export class TaxasDashboardComponent implements OnInit, OnDestroy {
  taxas: ITaxaData[] = [];
  mainTaxas: ITaxaCard[] = [];
  otherTaxas: ITaxaData[] = [];
  isLoading = false;
  error = '';
  lastUpdated: Date | null = null;
  autoRefresh = false;
  
  private refreshSubscription?: Subscription;

  // Main financial indicators to highlight
  private mainIndicators = [
    { key: 'selic', name: 'SELIC', icon: 'trending_up', color: '#2196F3', description: 'Taxa básica de juros da economia' },
    { key: 'cdi', name: 'CDI', icon: 'account_balance', color: '#4CAF50', description: 'Certificado de Depósito Interbancário' },
    { key: 'ipca', name: 'IPCA', icon: 'assessment', color: '#FF9800', description: 'Índice de Preços ao Consumidor Amplo' },
    { key: 'dolar', name: 'USD', icon: 'attach_money', color: '#F44336', description: 'Dólar Americano' },
    { key: 'euro', name: 'EUR', icon: 'euro_symbol', color: '#9C27B0', description: 'Euro' }
  ];

  constructor(
    private taxasService: TaxasService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTaxas();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadTaxas(): void {
    this.isLoading = true;
    this.error = '';

    this.taxasService.getTaxas().subscribe({
      next: (taxas) => {
        this.taxas = taxas;
        this.processTaxas();
        this.isLoading = false;
        this.lastUpdated = new Date();
        
        this.snackBar.open(`${taxas.length} taxas carregadas com sucesso!`, 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
        this.snackBar.open(error.message, 'Fechar', {
          duration: 4000
        });
      }
    });
  }

  processTaxas(): void {
    this.mainTaxas = [];
    const usedTaxas = new Set<string>();

    // Process main indicators
    this.mainIndicators.forEach(indicator => {
      const taxa = this.findTaxaByKey(indicator.key);
      if (taxa) {
        this.mainTaxas.push({
          name: taxa.nome,
          displayName: indicator.name,
          value: taxa.valor,
          icon: indicator.icon,
          type: this.getTaxaType(taxa.nome),
          color: indicator.color,
          description: indicator.description
        });
        usedTaxas.add(taxa.nome);
      }
    });

    // Get remaining taxas
    this.otherTaxas = this.taxas.filter(taxa => !usedTaxas.has(taxa.nome));
  }

  findTaxaByKey(key: string): ITaxaData | undefined {
    return this.taxas.find(taxa => 
      taxa.nome.toLowerCase().includes(key.toLowerCase())
    );
  }

  getTaxaType(name: string): 'percentage' | 'currency' {
    const currencyKeywords = ['dolar', 'euro', 'peso', 'libra', 'iene', 'usd', 'eur'];
    return currencyKeywords.some(keyword => 
      name.toLowerCase().includes(keyword)
    ) ? 'currency' : 'percentage';
  }

  formatTaxaValue(value: number): string {
    // Format based on value characteristics
    if (typeof value !== 'number') return 'N/A';
    
    // If value is very small (< 1), likely a percentage/rate
    if (Math.abs(value) < 1) {
      return `${(value * 100).toFixed(4)}%`;
    }
    
    // If value looks like currency (> 1), format as currency
    if (value > 1) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      }).format(value);
    }
    
    // Otherwise, format as percentage
    return `${value.toFixed(4)}%`;
  }

  getTaxaUnit(name: string): string {
    if (!name) return '';
    
    const nameLower = name.toLowerCase();
    if (nameLower.includes('dolar') || nameLower.includes('euro') || nameLower.includes('usd') || nameLower.includes('eur')) {
      return '';  // Currency already formatted
    }
    
    if (nameLower.includes('taxa') || nameLower.includes('juros') || nameLower.includes('selic') || nameLower.includes('cdi')) {
      return '% a.a.';
    }
    
    return '';
  }

  trackByTaxa(index: number, taxa: ITaxaData): string {
    return taxa.nome;
  }

  exportTaxas(): void {
    this.exportToCsv();
  }

  showHistory(): void {
    this.snackBar.open('Funcionalidade de histórico em desenvolvimento', 'Fechar', {
      duration: 3000
    });
  }

  getTrendIcon(value: number): string {
    // Simplified trend logic (in real app, would compare with previous values)
    if (value > 10) return 'trending_up';
    if (value > 0) return 'trending_flat';
    return 'trending_down';
  }

  getTrendColor(value: number, type: 'percentage' | 'currency'): string {
    if (type === 'currency') {
      return value > 5 ? '#F44336' : value > 3 ? '#FF9800' : '#4CAF50';
    }
    return value > 15 ? '#F44336' : value > 5 ? '#FF9800' : '#4CAF50';
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    
    if (this.autoRefresh) {
      // Refresh every 5 minutes
      this.refreshSubscription = interval(5 * 60 * 1000).pipe(
        startWith(0),
        switchMap(() => this.taxasService.getTaxas())
      ).subscribe({
        next: (taxas) => {
          this.taxas = taxas;
          this.processTaxas();
          this.lastUpdated = new Date();
        },
        error: (error) => {
          this.snackBar.open('Erro na atualização automática: ' + error.message, 'Fechar', {
            duration: 3000
          });
        }
      });
      
      this.snackBar.open('Atualização automática ativada (a cada 5 minutos)', 'Fechar', {
        duration: 3000
      });
    } else {
      if (this.refreshSubscription) {
        this.refreshSubscription.unsubscribe();
      }
      this.snackBar.open('Atualização automática desativada', 'Fechar', {
        duration: 2000
      });
    }
  }

  refresh(): void {
    this.loadTaxas();
  }

  exportToCsv(): void {
    if (this.taxas.length === 0) {
      this.snackBar.open('Nenhuma taxa para exportar', 'Fechar', {
        duration: 2000
      });
      return;
    }

    const csvContent = this.convertToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `taxas-brasil-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.snackBar.open('Taxas exportadas com sucesso!', 'Fechar', {
        duration: 3000
      });
    }
  }

  private convertToCsv(): string {
    const headers = ['Nome', 'Valor', 'Tipo', 'Data de Atualização'];
    const csvArray = [headers];

    this.taxas.forEach(taxa => {
      csvArray.push([
        taxa.nome,
        taxa.valor.toString(),
        this.getTaxaType(taxa.nome),
        this.lastUpdated?.toLocaleString('pt-BR') || ''
      ]);
    });

    return csvArray.map(row => 
      row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  getLastUpdateText(): string {
    if (!this.lastUpdated) return '';
    
    const now = new Date();
    const diff = now.getTime() - this.lastUpdated.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Atualizado agora';
    if (minutes === 1) return 'Atualizado há 1 minuto';
    if (minutes < 60) return `Atualizado há ${minutes} minutos`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return 'Atualizado há 1 hora';
    if (hours < 24) return `Atualizado há ${hours} horas`;
    
    return this.lastUpdated.toLocaleDateString('pt-BR');
  }

  retry(): void {
    this.loadTaxas();
  }
}