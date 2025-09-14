import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IApiError } from '../../shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  createError(error: HttpErrorResponse, endpoint: string): IApiError {
    return {
      code: this.getErrorCode(error),
      message: this.getErrorMessage(error),
      details: error.error,
      timestamp: new Date(),
      endpoint,
      httpStatus: error.status,
      retryable: this.isRetryable(error)
    };
  }

  private getErrorCode(error: HttpErrorResponse): string {
    if (error.status === 0) return 'NETWORK_ERROR';
    if (error.status === 404) return 'NOT_FOUND';
    if (error.status === 400) return 'BAD_REQUEST';
    if (error.status === 429) return 'RATE_LIMIT';
    if (error.status >= 500) return 'SERVER_ERROR';
    return 'UNKNOWN_ERROR';
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'Erro de conexão. Verifique sua internet.';
      case 400:
        return 'Dados inválidos fornecidos.';
      case 404:
        return 'Dados não encontrados.';
      case 429:
        return 'Muitas consultas. Aguarde um momento.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Erro do servidor. Tente novamente mais tarde.';
      default:
        return error.error?.message || 'Erro inesperado.';
    }
  }

  private isRetryable(error: HttpErrorResponse): boolean {
    // Retry for network errors and server errors, but not for client errors
    return error.status === 0 || error.status >= 500;
  }

  logError(error: IApiError): void {
    if (error.retryable) {
      console.warn('Retryable error:', error);
    } else {
      console.error('Non-retryable error:', error);
    }
  }
}