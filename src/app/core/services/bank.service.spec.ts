import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BankService } from './bank.service';
import { IBankData, IBankFilter } from '../../shared/interfaces/bank-data.interface';

describe('BankService', () => {
  let service: BankService;
  let httpMock: HttpTestingController;

  const mockBanksData: IBankData[] = [
    { ispb: '00000000', name: 'Banco do Brasil', code: 1, fullName: 'Banco do Brasil S.A.' },
    { ispb: '00000208', name: 'Banco Inter', code: 77, fullName: 'Banco Inter S.A.' },
    { ispb: '00360305', name: 'Banco Santander', code: 33, fullName: 'Banco Santander (Brasil) S.A.' },
    { ispb: '60701190', name: 'Itaú Unibanco', code: 341, fullName: 'Itaú Unibanco S.A.' },
    { ispb: '60746948', name: 'Banco Bradesco', code: 237, fullName: 'Banco Bradesco S.A.' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BankService]
    });
    service = TestBed.inject(BankService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBanks', () => {
    it('should fetch banks data successfully', () => {
      service.getBanks().subscribe(data => {
        expect(data).toEqual(mockBanksData);
        expect(data.length).toBe(5);
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/banks/v1');
      expect(req.request.method).toBe('GET');
      req.flush(mockBanksData);
    });

    it('should handle connection error', () => {
      service.getBanks().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro de conexão. Verifique sua internet.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/banks/v1');
      req.flush({}, { status: 0, statusText: '' });
    });

    it('should handle rate limit error', () => {
      service.getBanks().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Muitas consultas. Aguarde um momento e tente novamente.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/banks/v1');
      req.flush({}, { status: 429, statusText: 'Too Many Requests' });
    });

    it('should handle server error', () => {
      service.getBanks().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro do servidor. Tente novamente mais tarde.');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/banks/v1');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle generic error', () => {
      service.getBanks().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro inesperado ao carregar bancos');
        }
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/banks/v1');
      req.flush({}, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getBankByCode', () => {
    it('should find bank by code', () => {
      const result = service.getBankByCode(mockBanksData, 1);
      expect(result).toEqual(mockBanksData[0]);
    });

    it('should return undefined for non-existent code', () => {
      const result = service.getBankByCode(mockBanksData, 999);
      expect(result).toBeUndefined();
    });

    it('should handle empty array', () => {
      const result = service.getBankByCode([], 1);
      expect(result).toBeUndefined();
    });

    it('should handle null/undefined arrays', () => {
      expect(service.getBankByCode(null as any, 1)).toBeUndefined();
      expect(service.getBankByCode(undefined as any, 1)).toBeUndefined();
    });
  });

  describe('getBankByName', () => {
    it('should find bank by exact name', () => {
      const result = service.getBankByName(mockBanksData, 'Banco do Brasil');
      expect(result).toEqual(mockBanksData[0]);
    });

    it('should find bank by partial name (case insensitive)', () => {
      const result = service.getBankByName(mockBanksData, 'brasil');
      expect(result).toEqual(mockBanksData[0]);
    });

    it('should find bank by full name', () => {
      const result = service.getBankByName(mockBanksData, 'Banco do Brasil S.A.');
      expect(result).toEqual(mockBanksData[0]);
    });

    it('should return undefined for non-existent name', () => {
      const result = service.getBankByName(mockBanksData, 'NonExistent Bank');
      expect(result).toBeUndefined();
    });

    it('should handle empty string', () => {
      const result = service.getBankByName(mockBanksData, '');
      expect(result).toBeUndefined();
    });

    it('should handle null/undefined name', () => {
      expect(service.getBankByName(mockBanksData, null as any)).toBeUndefined();
      expect(service.getBankByName(mockBanksData, undefined as any)).toBeUndefined();
    });
  });

  describe('filterBanks', () => {
    it('should filter banks by search term (name)', () => {
      const filter: IBankFilter = {
        searchTerm: 'Inter',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Banco Inter');
    });

    it('should filter banks by search term (code)', () => {
      const filter: IBankFilter = {
        searchTerm: '341',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Itaú Unibanco');
    });

    it('should filter banks by search term (full name)', () => {
      const filter: IBankFilter = {
        searchTerm: 'S.A.',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result.length).toBe(5); // All banks have S.A. in fullName
    });

    it('should sort banks by name ascending', () => {
      const filter: IBankFilter = {
        searchTerm: '',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result[0].name).toBe('Banco Bradesco');
      expect(result[1].name).toBe('Banco do Brasil');
    });

    it('should sort banks by name descending', () => {
      const filter: IBankFilter = {
        searchTerm: '',
        sortBy: 'name',
        sortOrder: 'desc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result[0].name).toBe('Itaú Unibanco');
      expect(result[4].name).toBe('Banco Bradesco');
    });

    it('should sort banks by code ascending', () => {
      const filter: IBankFilter = {
        searchTerm: '',
        sortBy: 'code',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result[0].code).toBe(1);
      expect(result[4].code).toBe(341);
    });

    it('should sort banks by code descending', () => {
      const filter: IBankFilter = {
        searchTerm: '',
        sortBy: 'code',
        sortOrder: 'desc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result[0].code).toBe(341);
      expect(result[4].code).toBe(1);
    });

    it('should sort banks by full name', () => {
      const filter: IBankFilter = {
        searchTerm: '',
        sortBy: 'fullName',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result[0].fullName).toBe('Banco Bradesco S.A.');
      expect(result[1].fullName).toBe('Banco do Brasil S.A.');
    });

    it('should handle empty search term', () => {
      const filter: IBankFilter = {
        searchTerm: '',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result.length).toBe(mockBanksData.length);
    });

    it('should handle case insensitive search', () => {
      const filter: IBankFilter = {
        searchTerm: 'BANCO DO BRASIL',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Banco do Brasil');
    });

    it('should return empty array for no matches', () => {
      const filter: IBankFilter = {
        searchTerm: 'NonExistentBank',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(mockBanksData, filter);
      expect(result.length).toBe(0);
    });

    it('should handle null/undefined filter', () => {
      const result1 = service.filterBanks(mockBanksData, null as any);
      const result2 = service.filterBanks(mockBanksData, undefined as any);
      
      expect(result1.length).toBe(mockBanksData.length);
      expect(result2.length).toBe(mockBanksData.length);
    });

    it('should handle empty banks array', () => {
      const filter: IBankFilter = {
        searchTerm: 'test',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = service.filterBanks([], filter);
      expect(result.length).toBe(0);
    });
  });

  describe('getMainBanks', () => {
    it('should return main banks based on predefined codes', () => {
      // Add more banks with main bank codes
      const extendedMockData = [
        ...mockBanksData,
        { ispb: '00000000', name: 'Caixa Econômica', code: 104, fullName: 'Caixa Econômica Federal' },
        { ispb: '00000000', name: 'Banco Original', code: 212, fullName: 'Banco Original S.A.' }
      ];

      const result = service.getMainBanks(extendedMockData);
      
      // Should include banks with codes: 1, 33, 104, 237, 341 (from our mock data)
      expect(result.length).toBeGreaterThan(0);
      expect(result.find(b => b.code === 1)).toBeTruthy(); // BB
      expect(result.find(b => b.code === 33)).toBeTruthy(); // Santander
      expect(result.find(b => b.code === 104)).toBeTruthy(); // Caixa
      expect(result.find(b => b.code === 237)).toBeTruthy(); // Bradesco
      expect(result.find(b => b.code === 341)).toBeTruthy(); // Itaú
    });

    it('should return empty array when no main banks exist', () => {
      const nonMainBanks = [
        { ispb: '12345678', name: 'Small Bank', code: 999, fullName: 'Small Bank Ltd.' }
      ];

      const result = service.getMainBanks(nonMainBanks);
      expect(result.length).toBe(0);
    });

    it('should handle empty array', () => {
      const result = service.getMainBanks([]);
      expect(result.length).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed response data', () => {
      service.getBanks().subscribe(data => {
        expect(data).toBeNull();
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/banks/v1');
      req.flush(null);
    });

    it('should handle response with mixed data types', () => {
      const mixedData = [
        { ispb: '00000000', name: 'Valid Bank', code: 1, fullName: 'Valid Bank S.A.' },
        { ispb: 12345, name: null, code: 'invalid', fullName: undefined }, // Invalid types
        { ispb: '00000208', name: 'Another Valid', code: 77, fullName: 'Another Valid S.A.' }
      ] as any;

      service.getBanks().subscribe(data => {
        expect(data).toEqual(mixedData);
      });

      const req = httpMock.expectOne('https://brasilapi.com.br/api/banks/v1');
      req.flush(mixedData);
    });

    it('should handle special characters in bank names during filtering', () => {
      const banksWithSpecialChars = [
        { ispb: '00000000', name: 'Banco & Trust', code: 1, fullName: 'Banco & Trust S.A.' },
        { ispb: '00000208', name: 'Bank+Plus', code: 77, fullName: 'Bank+Plus Ltd.' }
      ];

      const filter: IBankFilter = {
        searchTerm: '&',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(banksWithSpecialChars, filter);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Banco & Trust');
    });

    it('should handle very large bank lists', () => {
      const largeBankList = Array.from({ length: 1000 }, (_, i) => ({
        ispb: `${i.toString().padStart(8, '0')}`,
        name: `Bank ${i}`,
        code: i,
        fullName: `Bank ${i} S.A.`
      }));

      const filter: IBankFilter = {
        searchTerm: 'Bank 50',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = service.filterBanks(largeBankList, filter);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(bank => bank.name.includes('Bank 50'))).toBeTruthy();
    });
  });
});