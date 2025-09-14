import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICepData } from '../../shared/interfaces/cep-data.interface';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly baseUrl = 'https://brasilapi.com.br/api/cep/v2';

  constructor(private http: HttpClient) {}

  getCepData(cep: string): Observable<ICepData> {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return throwError(() => new Error('CEP deve conter exatamente 8 dígitos'));
    }

    return this.http.get<ICepData>(`${this.baseUrl}/${cleanCep}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro inesperado ao buscar CEP';
    
    if (error.status === 404) {
      errorMessage = 'CEP não encontrado';
    } else if (error.status === 400) {
      errorMessage = 'CEP inválido';
    } else if (error.status === 0) {
      errorMessage = 'Erro de conexão. Verifique sua internet.';
    } else if (error.status >= 500) {
      errorMessage = 'Erro do servidor. Tente novamente mais tarde.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}