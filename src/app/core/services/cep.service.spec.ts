import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CepService } from './cep.service';
import { ICepData } from '../../shared/interfaces/cep-data.interface';

describe('CepService', () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  const mockCepData: ICepData = {
    cep: '01001000',
    state: 'SP',
    city: 'São Paulo',
    district: 'Sé',
    lat: '-23.5489',
    lng: '-46.6388',
    street: 'Praça da Sé',
    service: 'viacep'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CepService]
    });
    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCepData', () => {
    it('should fetch CEP data successfully', () => {
      const cep = '01001-000';

      service.getCepData(cep).subscribe(data => {
        expect(data).toEqual(mockCepData);
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/01001000');
      expect(req.request.method).toBe('GET');
      req.flush(mockCepData);
    });

    it('should clean CEP by removing non-digits', () => {
      const cep = '01.001-000';

      service.getCepData(cep).subscribe();

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/01001000');
      expect(req.request.method).toBe('GET');
      req.flush(mockCepData);
    });

    it('should handle various CEP formats', () => {
      const testCases = [
        { input: '01001000', expected: '01001000' },
        { input: '01001-000', expected: '01001000' },
        { input: '01.001-000', expected: '01001000' },
        { input: ' 01 001 000 ', expected: '01001000' }
      ];

      testCases.forEach(({ input, expected }) => {
        service.getCepData(input).subscribe();
        const req = httpMock.expectOne(`https://brasilapi.com.br/api/cep/v2/${expected}`);
        req.flush(mockCepData);
      });
    });

    it('should return error for CEP with wrong length', () => {
      const shortCep = '12345';

      service.getCepData(shortCep).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('CEP deve conter exatamente 8 dígitos');
        }
      });

      httpMock.expectNone(`https://brasilapi.com.br/api/cep/v2/${shortCep}`);
    });

    it('should handle 404 error', () => {
      const cep = '99999999';

      service.getCepData(cep).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('CEP não encontrado');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/99999999');
      req.flush({}, { status: 404, statusText: 'Not Found' });
    });

    it('should handle 400 error', () => {
      const cep = '01001000';

      service.getCepData(cep).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('CEP inválido');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/01001000');
      req.flush({}, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle connection error', () => {
      const cep = '01001000';

      service.getCepData(cep).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro de conexão. Verifique sua internet.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/01001000');
      req.flush({}, { status: 0, statusText: '' });
    });

    it('should handle server error', () => {
      const cep = '01001000';

      service.getCepData(cep).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro do servidor. Tente novamente mais tarde.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/01001000');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle rate limiting error', () => {
      const cep = '01001000';

      service.getCepData(cep).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Muitas consultas. Aguarde um momento e tente novamente.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/01001000');
      req.flush({}, { status: 429, statusText: 'Too Many Requests' });
    });

    it('should handle generic error', () => {
      const cep = '01001000';

      service.getCepData(cep).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro inesperado ao buscar CEP');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/01001000');
      req.flush({}, { status: 422, statusText: 'Unprocessable Entity' });
    });
  });

  describe('formatCep', () => {
    it('should format CEP correctly', () => {
      expect(service.formatCep('01001000')).toBe('01001-000');
    });

    it('should format CEP with existing formatting', () => {
      expect(service.formatCep('01001-000')).toBe('01001-000');
    });

    it('should handle CEP with dots and other characters', () => {
      expect(service.formatCep('01.001-000')).toBe('01001-000');
    });

    it('should handle empty string', () => {
      expect(service.formatCep('')).toBe('-');
    });

    it('should handle partial CEP', () => {
      expect(service.formatCep('12345')).toBe('12345-');
    });

    it('should handle null or undefined', () => {
      expect(service.formatCep(null as any)).toBe('-');
      expect(service.formatCep(undefined as any)).toBe('-');
    });

    it('should handle CEP longer than 8 digits', () => {
      expect(service.formatCep('010010001234')).toBe('01001000-');
    });
  });

  describe('isValidCep', () => {
    it('should validate correct CEP format', () => {
      expect(service.isValidCep('01001000')).toBeTruthy();
      expect(service.isValidCep('12345678')).toBeTruthy();
    });

    it('should invalidate incorrect CEP format', () => {
      expect(service.isValidCep('')).toBeFalsy();
      expect(service.isValidCep('1234567')).toBeFalsy();
      expect(service.isValidCep('123456789')).toBeFalsy();
      expect(service.isValidCep('abcdefgh')).toBeFalsy();
      expect(service.isValidCep('01001-000')).toBeFalsy(); // Should only accept clean numbers
    });

    it('should handle null or undefined', () => {
      expect(service.isValidCep(null as any)).toBeFalsy();
      expect(service.isValidCep(undefined as any)).toBeFalsy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed response data', () => {
      service.getCepData('01001000').subscribe({
        next: (data) => {
          // Should still return the malformed data as received
          expect(data).toBeNull();
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/01001000');
      req.flush(null);
    });

    it('should handle response with missing fields', () => {
      const incompleteData = {
        cep: '01001000',
        city: 'São Paulo'
        // Missing other fields
      } as ICepData;

      service.getCepData('01001000').subscribe(data => {
        expect(data).toEqual(incompleteData);
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/01001000');
      req.flush(incompleteData);
    });

    it('should handle very long CEP input', () => {
      const longInput = '0100100012345678901234567890';

      service.getCepData(longInput).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('CEP deve conter exatamente 8 dígitos');
        }
      });
    });

    it('should handle CEP with all zeros', () => {
      const cep = '00000000';

      service.getCepData(cep).subscribe();

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/00000000');
      req.flush(mockCepData);
    });

    it('should handle special characters in CEP', () => {
      const cep = '01@001#000';

      service.getCepData(cep).subscribe();

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cep/v2/01001000');
      req.flush(mockCepData);
    });
  });
});