import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = new Map<string, boolean>();

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loadingKey = this.getLoadingKey(req);
    
    // Set loading to true
    this.loadingService.setLoading(loadingKey, true);
    this.activeRequests.set(req.url, true);

    return next.handle(req).pipe(
      finalize(() => {
        // Set loading to false when request completes
        this.activeRequests.delete(req.url);
        this.loadingService.setLoading(loadingKey, false);
      })
    );
  }

  private getLoadingKey(req: HttpRequest<any>): string {
    // Create a loading key based on the API endpoint
    if (req.url.includes('/cep/')) return 'cep';
    if (req.url.includes('/banks')) return 'banks';
    if (req.url.includes('/cnpj/')) return 'cnpj';
    if (req.url.includes('/taxas')) return 'taxas';
    return 'general';
  }
}