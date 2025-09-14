import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { BankService } from '../../core/services/bank.service';
import { IBankData, IBankFilter } from '../../shared/interfaces/bank-data.interface';
import { startWith, map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-bank-list',
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
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss']
})
export class BankListComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  banks: IBankData[] = [];
  filteredBanks: IBankData[] = [];
  displayedColumns: string[] = ['code', 'name', 'fullName', 'ispb'];
  dataSource = new MatTableDataSource<IBankData>();
  
  isLoading = false;
  error = '';
  searchControl = new FormControl('');
  sortByControl = new FormControl('name');
  sortOrderControl = new FormControl('asc');
  
  totalBanks = 0;
  mainBanks: IBankData[] = [];

  // Main banks in Brazil (most common ones)
  private readonly mainBankCodes = [1, 33, 104, 237, 341, 399, 745, 748, 756];

  constructor(
    private bankService: BankService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBanks();
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadBanks(): void {
    this.isLoading = true;
    this.error = '';

    this.bankService.getBanks().subscribe({
      next: (banks) => {
        this.banks = banks;
        this.filteredBanks = banks;
        this.totalBanks = banks.length;
        this.dataSource.data = banks;
        this.loadMainBanks();
        this.isLoading = false;
        
        this.snackBar.open(`${banks.length} bancos carregados com sucesso!`, 'Fechar', {
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

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(searchTerm => searchTerm || '')
    ).subscribe(searchTerm => {
      this.filterBanks();
    });

    // Watch for sort changes
    this.sortByControl.valueChanges.subscribe(() => this.filterBanks());
    this.sortOrderControl.valueChanges.subscribe(() => this.filterBanks());
  }

  filterBanks(): void {
    const filter: IBankFilter = {
      searchTerm: this.searchControl.value || '',
      sortBy: this.sortByControl.value as 'name' | 'code' | 'fullName',
      sortOrder: this.sortOrderControl.value as 'asc' | 'desc'
    };

    this.filteredBanks = this.bankService.filterBanks(this.banks, filter);
    this.dataSource.data = this.filteredBanks;
    
    // Reset paginator to first page
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  loadMainBanks(): void {
    this.mainBanks = this.banks.filter(bank => 
      bank.code != null && this.mainBankCodes.includes(bank.code)
    ).sort((a, b) => a.name.localeCompare(b.name));
  }

  searchMainBank(bankCode: number | null): void {
    if (bankCode != null) {
      this.searchControl.setValue(bankCode.toString());
    }
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.sortByControl.setValue('name');
    this.sortOrderControl.setValue('asc');
  }

  exportToCSV(): void {
    if (this.filteredBanks.length === 0) {
      this.snackBar.open('Nenhum banco para exportar', 'Fechar', {
        duration: 2000
      });
      return;
    }

    const csvContent = this.convertToCSV(this.filteredBanks);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bancos-brasileiros-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.snackBar.open('Lista de bancos exportada com sucesso!', 'Fechar', {
        duration: 3000
      });
    }
  }

  private convertToCSV(banks: IBankData[]): string {
    const headers = ['Código', 'Nome', 'Nome Completo', 'ISPB'];
    const csvArray = [headers];

    banks.forEach(bank => {
      csvArray.push([
        bank.code?.toString() || 'N/A',
        bank.name || 'N/A',
        bank.fullName || 'N/A',
        bank.ispb || 'N/A'
      ]);
    });

    return csvArray.map(row => 
      row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  getBankTypeDescription(name: string): string {
    if (name.toLowerCase().includes('cooperativa')) {
      return 'Cooperativa de Crédito';
    }
    if (name.toLowerCase().includes('financeira')) {
      return 'Financeira';
    }
    if (name.toLowerCase().includes('investimento')) {
      return 'Banco de Investimento';
    }
    if (name.toLowerCase().includes('desenvolvimento')) {
      return 'Banco de Desenvolvimento';
    }
    return 'Banco Comercial';
  }

  isMainBank(code: number | null): boolean {
    return code != null && this.mainBankCodes.includes(code);
  }

  retry(): void {
    this.loadBanks();
  }
}