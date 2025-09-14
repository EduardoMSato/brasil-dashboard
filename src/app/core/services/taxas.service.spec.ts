import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaxasService } from './taxas.service';
import { ITaxaData } from '../../shared/interfaces/taxa-data.interface';

describe('TaxasService', () => {
  let service: TaxasService;
  let httpMock: HttpTestingController;

  const mockTaxasData: ITaxaData[] = [
    { nome: 'SELIC', valor: 11.75 },
    { nome: 'CDI', valor: 11.65 },
    { nome: 'IPCA', valor: 4.62 },
    { nome: 'USD', valor: 5.15 },
    { nome: 'EUR', valor: 5.45 },
    { nome: 'IGP-M', valor: 2.8 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaxasService]
    });
    service = TestBed.inject(TaxasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTaxas', () => {
    it('should fetch taxas data successfully', () => {
      service.getTaxas().subscribe(data => {
        expect(data).toEqual(mockTaxasData);
        expect(data.length).toBe(6);
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/taxas/v1');
      expect(req.request.method).toBe('GET');
      req.flush(mockTaxasData);
    });

    it('should handle connection error', () => {
      service.getTaxas().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro de conexão. Verifique sua internet.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/taxas/v1');
      req.flush({}, { status: 0, statusText: '' });
    });

    it('should handle rate limit error', () => {
      service.getTaxas().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Muitas consultas. Aguarde um momento e tente novamente.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/taxas/v1');
      req.flush({}, { status: 429, statusText: 'Too Many Requests' });
    });

    it('should handle server error', () => {
      service.getTaxas().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro do servidor. Tente novamente mais tarde.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/taxas/v1');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle generic error', () => {
      service.getTaxas().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro inesperado ao carregar taxas');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/taxas/v1');
      req.flush({}, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getTaxaByName', () => {
    it('should find taxa by exact name', () => {
      const result = service.getTaxaByName(mockTaxasData, 'SELIC');
      expect(result).toEqual({ nome: 'SELIC', valor: 11.75 });
    });

    it('should find taxa by partial name (case insensitive)', () => {
      const result = service.getTaxaByName(mockTaxasData, 'selic');
      expect(result).toEqual({ nome: 'SELIC', valor: 11.75 });
    });

    it('should find taxa by partial match', () => {
      const result = service.getTaxaByName(mockTaxasData, 'USD');
      expect(result).toEqual({ nome: 'USD', valor: 5.15 });
    });

    it('should return undefined for non-existent taxa', () => {
      const result = service.getTaxaByName(mockTaxasData, 'BITCOIN');
      expect(result).toBeUndefined();
    });

    it('should handle empty array', () => {
      const result = service.getTaxaByName([], 'SELIC');
      expect(result).toBeUndefined();
    });
  });

  describe('getMainTaxas', () => {
    it('should return main financial indicators', () => {
      const result = service.getMainTaxas(mockTaxasData);
      
      expect(result.length).toBe(5); // selic, cdi, ipca, usd, eur
      expect(result.find(t => t.nome === 'SELIC')).toBeTruthy();
      expect(result.find(t => t.nome === 'CDI')).toBeTruthy();
      expect(result.find(t => t.nome === 'IPCA')).toBeTruthy();
      expect(result.find(t => t.nome === 'USD')).toBeTruthy();
      expect(result.find(t => t.nome === 'EUR')).toBeTruthy();
    });

    it('should return empty array when no main taxas exist', () => {
      const customTaxas = [
        { nome: 'BITCOIN', valor: 100000 },
        { nome: 'GOLD', valor: 2000 }
      ];
      
      const result = service.getMainTaxas(customTaxas);
      expect(result.length).toBe(0);
    });

    it('should handle partial matches', () => {
      const customTaxas = [
        { nome: 'SELIC OVER', valor: 11.75 },
        { nome: 'CDI DI1', valor: 11.65 }
      ];
      
      const result = service.getMainTaxas(customTaxas);
      expect(result.length).toBe(2);
    });
  });

  describe('formatTaxaValue', () => {
    it('should format percentage values correctly', () => {
      const result = service.formatTaxaValue(11.75, 'percentage');
      expect(result).toMatch(/11,75%|11.75%/); // Account for different locale formats
    });

    it('should format currency values correctly', () => {
      const result = service.formatTaxaValue(5.15, 'currency');
      expect(result).toContain('R$');
      expect(result).toContain('5,15');
    });

    it('should default to percentage format', () => {
      const result = service.formatTaxaValue(4.62);
      expect(result).toMatch(/4,62%|4.62%/);
    });

    it('should handle zero values', () => {
      const percentResult = service.formatTaxaValue(0, 'percentage');
      const currencyResult = service.formatTaxaValue(0, 'currency');
      
      expect(percentResult).toMatch(/0,00%|0.00%/);
      expect(currencyResult).toContain('R$');
      expect(currencyResult).toContain('0,00');
    });

    it('should handle negative values', () => {
      const percentResult = service.formatTaxaValue(-2.5, 'percentage');
      const currencyResult = service.formatTaxaValue(-1.5, 'currency');
      
      expect(percentResult).toContain('-');
      expect(currencyResult).toContain('-');
    });

    it('should handle very small values', () => {
      const result = service.formatTaxaValue(0.01, 'percentage');
      expect(result).toMatch(/0,01%|0.01%/);
    });

    it('should handle very large values', () => {
      const percentResult = service.formatTaxaValue(1000, 'percentage');
      const currencyResult = service.formatTaxaValue(1000, 'currency');
      
      expect(percentResult).toContain('1000');
      expect(currencyResult).toContain('1.000');
    });
  });

  describe('getTaxasWithAutoRefresh', () => {
    it('should create observable that emits taxas data', (done) => {
      let emissionCount = 0;
      
      service.getTaxasWithAutoRefresh(0.01).subscribe(data => { // Very short interval for testing
        emissionCount++;
        expect(data).toEqual(mockTaxasData);
        
        if (emissionCount === 1) {
          done();
        }
      });

      // Expect at least one HTTP request
      const req = httpMock.expectOne('https://brasilapi.com.br/api/taxas/v1');
      req.flush(mockTaxasData);
    });

    it('should handle errors in auto-refresh', (done) => {
      service.getTaxasWithAutoRefresh(0.01).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro de conexão. Verifique sua internet.');
          done();
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/taxas/v1');
      req.flush({}, { status: 0, statusText: '' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed response data', () => {
      service.getTaxas().subscribe(data => {
        expect(Array.isArray(data)).toBeTruthy();
        expect(data.length).toBe(0);
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/taxas/v1');
      req.flush(null); // Malformed response
    });

    it('should handle response with mixed data types', () => {
      const mixedData = [
        { nome: 'SELIC', valor: 11.75 },
        { nome: 'INVALID', valor: 'invalid' }, // Invalid valor type
        { nome: 'CDI', valor: 11.65 }
      ] as any;

      service.getTaxas().subscribe(data => {
        expect(data).toEqual(mixedData);
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/taxas/v1');
      req.flush(mixedData);
    });
  });
});