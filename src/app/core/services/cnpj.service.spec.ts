import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CnpjService } from './cnpj.service';
import { ICnpjData } from '../../shared/interfaces/cnpj-data.interface';

describe('CnpjService', () => {
  let service: CnpjService;
  let httpMock: HttpTestingController;

  const mockCnpjData: ICnpjData = {
    cnpj: '00000000000191',
    identificador_matriz_filial: 1,
    descricao_matriz_filial: 'Matriz',
    razao_social: 'Banco do Brasil S.A.',
    nome_fantasia: 'Banco do Brasil',
    situacao_cadastral: 'ATIVA',
    data_situacao_cadastral: '2023-01-01',
    motivo_situacao_cadastral: 'Situação normal',
    codigo_natureza_juridica: 2046,
    data_inicio_atividade: '1808-10-12',
    cnae_fiscal: 6421200,
    cnae_fiscal_descricao: 'Bancos comerciais',
    descricao_tipo_de_logradouro: 'SAUN',
    logradouro: 'Quadra 5 Lote B',
    numero: 'S/N',
    complemento: 'Torres I, II, III, IV e V',
    bairro: 'Asa Norte',
    cep: '70040912',
    uf: 'DF',
    codigo_municipio: 5300108,
    municipio: 'Brasília',
    ddd_telefone_1: '6133493000',
    capital_social: 1000000000,
    porte: '05',
    opcao_pelo_simples: false,
    opcao_pelo_mei: false,
    qualificacao_do_responsavel: 5
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CnpjService]
    });
    service = TestBed.inject(CnpjService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCnpjData', () => {
    it('should fetch CNPJ data successfully', () => {
      const cnpj = '00.000.000/0001-91';

      service.getCnpjData(cnpj).subscribe(data => {
        expect(data).toEqual(mockCnpjData);
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cnpj/v1/00000000000191');
      expect(req.request.method).toBe('GET');
      req.flush(mockCnpjData);
    });

    it('should clean CNPJ by removing non-digits', () => {
      const cnpj = '00.000.000/0001-91';

      service.getCnpjData(cnpj).subscribe();

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cnpj/v1/00000000000191');
      expect(req.request.method).toBe('GET');
      req.flush(mockCnpjData);
    });

    it('should return error for CNPJ with wrong length', () => {
      const cnpj = '123456';

      service.getCnpjData(cnpj).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('CNPJ deve conter exatamente 14 dígitos');
        }
      });

      httpMock.expectNone('https://brasilapi.com.br/api/cnpj/v1/123456');
    });

    it('should return error for invalid CNPJ', () => {
      const cnpj = '11111111111111'; // All same digits

      service.getCnpjData(cnpj).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('CNPJ inválido');
        }
      });

      httpMock.expectNone('https://brasilapi.com.br/api/cnpj/v1/11111111111111');
    });

    it('should handle 404 error', () => {
      const cnpj = '00000000000191';

      service.getCnpjData(cnpj).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('CNPJ não encontrado');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cnpj/v1/00000000000191');
      req.flush({}, { status: 404, statusText: 'Not Found' });
    });

    it('should handle 400 error', () => {
      const cnpj = '00000000000191';

      service.getCnpjData(cnpj).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('CNPJ inválido');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cnpj/v1/00000000000191');
      req.flush({}, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 429 error (rate limit)', () => {
      const cnpj = '00000000000191';

      service.getCnpjData(cnpj).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Muitas consultas. Aguarde um momento e tente novamente.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cnpj/v1/00000000000191');
      req.flush({}, { status: 429, statusText: 'Too Many Requests' });
    });

    it('should handle connection error', () => {
      const cnpj = '00000000000191';

      service.getCnpjData(cnpj).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro de conexão. Verifique sua internet.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cnpj/v1/00000000000191');
      req.flush({}, { status: 0, statusText: '' });
    });

    it('should handle server error', () => {
      const cnpj = '00000000000191';

      service.getCnpjData(cnpj).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro do servidor. Tente novamente mais tarde.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/cnpj/v1/00000000000191');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('isValidCnpj', () => {
    it('should validate correct CNPJ', () => {
      // Using reflection to test private method
      const result = (service as any).isValidCnpj('00000000000191');
      expect(result).toBeTruthy();
    });

    it('should invalidate CNPJ with all same digits', () => {
      const result = (service as any).isValidCnpj('11111111111111');
      expect(result).toBeFalsy();
    });

    it('should invalidate CNPJ with wrong check digits', () => {
      const result = (service as any).isValidCnpj('00000000000199');
      expect(result).toBeFalsy();
    });

    it('should invalidate CNPJ with wrong length', () => {
      const result = (service as any).isValidCnpj('123456');
      expect(result).toBeFalsy();
    });

    it('should validate other known valid CNPJs', () => {
      const validCnpjs = [
        '33000167000101', // Petrobras
        '60701190000104', // Itaú
        '60746948000112'  // Bradesco
      ];

      validCnpjs.forEach(cnpj => {
        const result = (service as any).isValidCnpj(cnpj);
        expect(result).toBeTruthy();
      });
    });
  });

  describe('formatCnpj', () => {
    it('should format CNPJ correctly', () => {
      const cnpj = '00000000000191';
      const formatted = service.formatCnpj(cnpj);
      expect(formatted).toBe('00.000.000/0001-91');
    });

    it('should format CNPJ with existing formatting', () => {
      const cnpj = '00.000.000/0001-91';
      const formatted = service.formatCnpj(cnpj);
      expect(formatted).toBe('00.000.000/0001-91');
    });

    it('should format partial CNPJ', () => {
      const cnpj = '0000000000019';
      const formatted = service.formatCnpj(cnpj);
      expect(formatted).toBe('0000000000019'); // Should not format incomplete CNPJ
    });

    it('should handle empty string', () => {
      const cnpj = '';
      const formatted = service.formatCnpj(cnpj);
      expect(formatted).toBe('');
    });
  });

  describe('CNPJ validation edge cases', () => {
    it('should validate Banco do Brasil CNPJ', () => {
      const result = (service as any).isValidCnpj('00000000000191');
      expect(result).toBeTruthy();
    });

    it('should validate complex CNPJ calculation', () => {
      // Test CNPJ validation algorithm with step-by-step verification
      const cnpj = '11222333000181';
      const result = (service as any).isValidCnpj(cnpj);
      expect(result).toBeTruthy();
    });
  });
});