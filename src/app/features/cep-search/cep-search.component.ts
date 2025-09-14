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

import { CepService } from '../../core/services/cep.service';
import { ICepData } from '../../shared/interfaces/cep-data.interface';

@Component({
  selector: 'app-cep-search',
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
    MatDividerModule
  ],
  templateUrl: './cep-search.component.html',
  styleUrls: ['./cep-search.component.scss']
})
export class CepSearchComponent implements OnInit {
  cepForm: FormGroup;
  cepData: ICepData | null = null;
  isLoading = false;
  error = '';
  searchHistory: ICepData[] = [];

  constructor(
    private fb: FormBuilder,
    private cepService: CepService,
    private snackBar: MatSnackBar
  ) {
    this.cepForm = this.fb.group({
      cep: ['', [
        Validators.required,
        Validators.pattern(/^\d{5}-?\d{3}$/)
      ]]
    });
  }

  ngOnInit(): void {
    this.loadSearchHistory();
  }

  onSearch(): void {
    if (this.cepForm.valid) {
      const cep = this.cepForm.get('cep')?.value;
      this.searchCep(cep);
    } else {
      this.snackBar.open('Por favor, digite um CEP válido (formato: 00000-000)', 'Fechar', {
        duration: 3000
      });
    }
  }

  searchCep(cep: string): void {
    this.isLoading = true;
    this.error = '';
    this.cepData = null;

    this.cepService.getCepData(cep).subscribe({
      next: (data) => {
        this.cepData = data;
        this.isLoading = false;
        this.addToHistory(data);
        this.snackBar.open('CEP encontrado com sucesso!', 'Fechar', {
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

  formatCep(cep: string): string {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  onCepInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{0,3})$/, '$1-$2');
    }
    this.cepForm.get('cep')?.setValue(value);
  }

  clearForm(): void {
    this.cepForm.reset();
    this.cepData = null;
    this.error = '';
  }

  searchFromHistory(cep: string): void {
    this.cepForm.get('cep')?.setValue(this.formatCep(cep));
    this.searchCep(cep);
  }

  private addToHistory(cepData: ICepData): void {
    // Remove duplicates and add to beginning
    this.searchHistory = this.searchHistory.filter(item => item.cep !== cepData.cep);
    this.searchHistory.unshift(cepData);
    
    // Keep only last 5 searches
    if (this.searchHistory.length > 5) {
      this.searchHistory = this.searchHistory.slice(0, 5);
    }
    
    // Save to localStorage
    localStorage.setItem('cep-history', JSON.stringify(this.searchHistory));
  }

  private loadSearchHistory(): void {
    const history = localStorage.getItem('cep-history');
    if (history) {
      this.searchHistory = JSON.parse(history);
    }
  }

  clearHistory(): void {
    this.searchHistory = [];
    localStorage.removeItem('cep-history');
    this.snackBar.open('Histórico limpo com sucesso!', 'Fechar', {
      duration: 2000
    });
  }
}