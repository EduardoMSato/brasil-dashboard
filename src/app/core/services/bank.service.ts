import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IBankData, IBankFilter } from '../../shared/interfaces/bank-data.interface';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private readonly baseUrl = 'https://brasilapi.com.br/api/banks/v1';

  constructor(private http: HttpClient) {}

  getBanks(): Observable<IBankData[]> {
    return this.http.get<IBankData[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  filterBanks(banks: IBankData[], filter: IBankFilter): IBankData[] {
    let filtered = banks;

    // Apply search filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(bank =>
        bank.name.toLowerCase().includes(searchLower) ||
        bank.fullName.toLowerCase().includes(searchLower) ||
        bank.code.toString().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filter.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'fullName':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'code':
          aValue = a.code;
          bValue = b.code;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return filter.sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return filter.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro inesperado ao carregar bancos';
    
    if (error.status === 0) {
      errorMessage = 'Erro de conexão. Verifique sua internet.';
    } else if (error.status >= 500) {
      errorMessage = 'Erro do servidor. Tente novamente mais tarde.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}