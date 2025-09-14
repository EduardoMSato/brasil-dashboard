import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';

import { CnpjService } from '../../core/services/cnpj.service';
import { ICnpjData, ICnpjPartner } from '../../shared/interfaces/cnpj-data.interface';

@Component({
  selector: 'app-cnpj-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule
  ],
  templateUrl: './cnpj-search.component.html',
  styleUrls: ['./cnpj-search.component.scss']
})
export class CnpjSearchComponent implements OnInit {
  cnpjForm: FormGroup;
  cnpjData: ICnpjData | null = null;
  isLoading = false;
  error = '';
  searchHistory: string[] = [];

  // Sample CNPJs for testing
  sampleCnpjs = [
    { name: 'Banco do Brasil', cnpj: '00000000000191' },
    { name: 'Petrobras', cnpj: '33000167000101' },
    { name: 'Vale S.A.', cnpj: '33592510000154' },
    { name: 'Itaú Unibanco', cnpj: '60701190000104' },
    { name: 'Bradesco', cnpj: '60746948000112' }
  ];

  constructor(
    private fb: FormBuilder,
    public cnpjService: CnpjService,
    private snackBar: MatSnackBar
  ) {
    this.cnpjForm = this.fb.group({
      cnpj: ['', [
        Validators.required,
        Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/)
      ]]
    });
  }

  ngOnInit(): void {
    this.loadSearchHistory();
  }

  onSearch(): void {
    if (this.cnpjForm.valid) {
      const cnpj = this.cnpjForm.get('cnpj')?.value;
      this.searchCnpj(cnpj);
    } else {
      this.snackBar.open('Por favor, digite um CNPJ válido', 'Fechar', {
        duration: 3000
      });
    }
  }

  searchCnpj(cnpj: string): void {
    this.isLoading = true;
    this.error = '';
    this.cnpjData = null;

    this.cnpjService.getCnpjData(cnpj).subscribe({
      next: (data) => {
        this.cnpjData = data;
        this.isLoading = false;
        this.addToHistory(cnpj);
        this.snackBar.open('CNPJ encontrado com sucesso!', 'Fechar', {
          duration: 2000
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

  searchSample(cnpj: string): void {
    this.cnpjForm.get('cnpj')?.setValue(this.cnpjService.formatCnpj(cnpj));
    this.searchCnpj(cnpj);
  }

  onCnpjInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 14) {
      if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      }
      if (value.length > 6) {
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      }
      if (value.length > 10) {
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
      }
      if (value.length > 15) {
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
      }
    }
    
    this.cnpjForm.get('cnpj')?.setValue(value);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Não informado';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  }

  formatCurrency(value: number): string {
    if (value === null || value === undefined || value === 0) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getStatusClass(status: string): string {
    if (!status || typeof status !== 'string') return 'status-unknown';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('ativa')) return 'status-active';
    if (statusLower.includes('suspensa')) return 'status-suspended';
    if (statusLower.includes('cancelada')) return 'status-canceled';
    return 'status-unknown';
  }

  getPorteDescription(porte: string): string {
    if (!porte) return 'Não informado';
    
    const porteMap: { [key: string]: string } = {
      '01': 'Microempresa',
      '02': 'Pequena Empresa',
      '03': 'Média Empresa',
      '04': 'Grande Empresa',
      '05': 'Empresa de Grande Porte'
    };
    
    return porteMap[porte] || porte;
  }

  clearForm(): void {
    this.cnpjForm.reset();
    this.cnpjData = null;
    this.error = '';
  }

  private addToHistory(cnpj: string): void {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    // Remove duplicates and add to beginning
    this.searchHistory = this.searchHistory.filter(item => item !== cleanCnpj);
    this.searchHistory.unshift(cleanCnpj);
    
    // Keep only last 5 searches
    if (this.searchHistory.length > 5) {
      this.searchHistory = this.searchHistory.slice(0, 5);
    }
    
    // Save to localStorage
    localStorage.setItem('cnpj-history', JSON.stringify(this.searchHistory));
  }

  private loadSearchHistory(): void {
    const history = localStorage.getItem('cnpj-history');
    if (history) {
      this.searchHistory = JSON.parse(history);
    }
  }

  searchFromHistory(cnpj: string): void {
    this.cnpjForm.get('cnpj')?.setValue(this.cnpjService.formatCnpj(cnpj));
    this.searchCnpj(cnpj);
  }

  clearHistory(): void {
    this.searchHistory = [];
    localStorage.removeItem('cnpj-history');
    this.snackBar.open('Histórico limpo com sucesso!', 'Fechar', {
      duration: 2000
    });
  }
}