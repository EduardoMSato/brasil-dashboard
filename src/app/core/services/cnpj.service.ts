import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICnpjData } from '../../shared/interfaces/cnpj-data.interface';

@Injectable({
  providedIn: 'root'
})
export class CnpjService {
  private readonly baseUrl = 'https://brasilapi.com.br/api/cnpj/v1';

  constructor(private http: HttpClient) {}

  getCnpjData(cnpj: string): Observable<ICnpjData> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
      return throwError(() => new Error('CNPJ deve conter exatamente 14 dígitos'));
    }

    if (!this.isValidCnpj(cleanCnpj)) {
      return throwError(() => new Error('CNPJ inválido'));
    }

    return this.http.get<ICnpjData>(`${this.baseUrl}/${cleanCnpj}`).pipe(
      catchError(this.handleError)
    );
  }

  private isValidCnpj(cnpj: string): boolean {
    if (cnpj.length !== 14) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cnpj)) return false;

    // Validate check digits
    let sum = 0;
    let weight = 2;

    // First check digit
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }

    const remainder1 = sum % 11;
    const digit1 = remainder1 < 2 ? 0 : 11 - remainder1;

    if (parseInt(cnpj.charAt(12)) !== digit1) return false;

    // Second check digit
    sum = 0;
    weight = 2;

    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }

    const remainder2 = sum % 11;
    const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;

    return parseInt(cnpj.charAt(13)) === digit2;
  }

  formatCnpj(cnpj: string): string {
    const clean = cnpj.replace(/\D/g, '');
    return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro inesperado ao buscar CNPJ';
    
    if (error.status === 404) {
      errorMessage = 'CNPJ não encontrado';
    } else if (error.status === 400) {
      errorMessage = 'CNPJ inválido';
    } else if (error.status === 429) {
      errorMessage = 'Muitas consultas. Aguarde um momento e tente novamente.';
    } else if (error.status === 0) {
      errorMessage = 'Erro de conexão. Verifique sua internet.';
    } else if (error.status >= 500) {
      errorMessage = 'Erro do servidor. Tente novamente mais tarde.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}