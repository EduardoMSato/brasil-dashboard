import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, switchMap, startWith } from 'rxjs/operators';
import { ITaxaData } from '../../shared/interfaces/taxa-data.interface';

@Injectable({
  providedIn: 'root'
})
export class TaxasService {
  private readonly baseUrl = 'https://brasilapi.com.br/api/taxas/v1';

  constructor(private http: HttpClient) {}

  getTaxas(): Observable<ITaxaData[]> {
    return this.http.get<ITaxaData[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getTaxasWithAutoRefresh(intervalMinutes: number = 30): Observable<ITaxaData[]> {
    return timer(0, intervalMinutes * 60 * 1000).pipe(
      switchMap(() => this.getTaxas())
    );
  }

  getTaxaByName(taxas: ITaxaData[], nome: string): ITaxaData | undefined {
    return taxas.find(taxa => 
      taxa.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  getMainTaxas(taxas: ITaxaData[]): ITaxaData[] {
    const mainNames = ['selic', 'cdi', 'ipca', 'dolar', 'euro'];
    return taxas.filter(taxa =>
      mainNames.some(name => taxa.nome.toLowerCase().includes(name))
    );
  }

  formatTaxaValue(value: number, tipo: 'percentage' | 'currency' = 'percentage'): string {
    if (tipo === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value / 100);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro inesperado ao carregar taxas';
    
    if (error.status === 0) {
      errorMessage = 'Erro de conexão. Verifique sua internet.';
    } else if (error.status === 429) {
      errorMessage = 'Muitas consultas. Aguarde um momento e tente novamente.';
    } else if (error.status >= 500) {
      errorMessage = 'Erro do servidor. Tente novamente mais tarde.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}