import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { of, throwError } from 'rxjs';

import { BankListComponent } from './bank-list.component';
import { BankService } from '../../core/services/bank.service';
import { IBankData, IBankFilter } from '../../shared/interfaces/bank-data.interface';

describe('BankListComponent', () => {
  let component: BankListComponent;
  let fixture: ComponentFixture<BankListComponent>;
  let bankService: jasmine.SpyObj<BankService>;

  const mockBanksData: IBankData[] = [
    { ispb: '00000000', name: 'Banco do Brasil', code: 1, fullName: 'Banco do Brasil S.A.' },
    { ispb: '00000208', name: 'Banco Inter', code: 77, fullName: 'Banco Inter S.A.' },
    { ispb: '00360305', name: 'Banco Santander', code: 33, fullName: 'Banco Santander (Brasil) S.A.' },
    { ispb: '60701190', name: 'Itaú Unibanco', code: 341, fullName: 'Itaú Unibanco S.A.' },
    { ispb: '60746948', name: 'Banco Bradesco', code: 237, fullName: 'Banco Bradesco S.A.' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BankService', ['getBanks', 'filterBanks']);

    await TestBed.configureTestingModule({
      imports: [
        BankListComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatSelectModule,
        MatChipsModule
      ],
      providers: [
        { provide: BankService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankListComponent);
    component = fixture.componentInstance;
    bankService = TestBed.inject(BankService) as jasmine.SpyObj<BankService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.banks).toEqual([]);
    expect(component.filteredBanks).toEqual([]);
    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBe('');
    expect(component.totalBanks).toBe(0);
    expect(component.searchControl.value).toBe('');
    expect(component.sortByControl.value).toBe('name');
    expect(component.sortOrderControl.value).toBe('asc');
  });

  describe('loadBanks', () => {
    it('should load banks successfully', () => {
      bankService.getBanks.and.returnValue(of(mockBanksData));
      spyOn(component, 'loadMainBanks');
      spyOn(component['snackBar'], 'open');

      component.loadBanks();

      expect(component.banks).toEqual(mockBanksData);
      expect(component.filteredBanks).toEqual(mockBanksData);
      expect(component.totalBanks).toBe(5);
      expect(component.dataSource.data).toEqual(mockBanksData);
      expect(component.isLoading).toBeFalsy();
      expect(component.loadMainBanks).toHaveBeenCalled();
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        '5 bancos carregados com sucesso!',
        'Fechar',
        { duration: 3000 }
      );
    });

    it('should handle load error', () => {
      const errorMessage = 'Erro ao carregar bancos';
      bankService.getBanks.and.returnValue(throwError(() => new Error(errorMessage)));
      spyOn(component['snackBar'], 'open');

      component.loadBanks();

      expect(component.error).toBe(errorMessage);
      expect(component.isLoading).toBeFalsy();
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        errorMessage,
        'Fechar',
        { duration: 4000 }
      );
    });
  });

  describe('filterBanks', () => {
    beforeEach(() => {
      component.banks = mockBanksData;
      bankService.filterBanks.and.returnValue(mockBanksData.slice(0, 2));
    });

    it('should filter banks and update data source', () => {
      component.searchControl.setValue('Brasil');
      component.sortByControl.setValue('name');
      component.sortOrderControl.setValue('asc');

      component.filterBanks();

      expect(bankService.filterBanks).toHaveBeenCalledWith(mockBanksData, {
        searchTerm: 'Brasil',
        sortBy: 'name',
        sortOrder: 'asc'
      });
      expect(component.filteredBanks.length).toBe(2);
      expect(component.dataSource.data.length).toBe(2);
    });

    it('should handle null search term', () => {
      component.searchControl.setValue(null);

      component.filterBanks();

      expect(bankService.filterBanks).toHaveBeenCalledWith(mockBanksData, {
        searchTerm: '',
        sortBy: 'name',
        sortOrder: 'asc'
      });
    });
  });

  describe('loadMainBanks', () => {
    it('should load main banks correctly', () => {
      component.banks = mockBanksData;

      component.loadMainBanks();

      expect(component.mainBanks.length).toBeGreaterThan(0);
      // Check if main banks include some of the common codes (1, 33, 237, 341)
      const mainBankCodes = component.mainBanks.map(bank => bank.code);
      expect(mainBankCodes).toContain(1); // BB
      expect(mainBankCodes).toContain(33); // Santander
    });

    it('should sort main banks by name', () => {
      component.banks = mockBanksData;

      component.loadMainBanks();

      const names = component.mainBanks.map(bank => bank.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });
  });

  describe('searchMainBank', () => {
    it('should set search control with bank code', () => {
      component.searchMainBank(237);

      expect(component.searchControl.value).toBe('237');
    });
  });

  describe('clearSearch', () => {
    it('should reset all form controls', () => {
      component.searchControl.setValue('test');
      component.sortByControl.setValue('code');
      component.sortOrderControl.setValue('desc');

      component.clearSearch();

      expect(component.searchControl.value).toBe('');
      expect(component.sortByControl.value).toBe('name');
      expect(component.sortOrderControl.value).toBe('asc');
    });
  });

  describe('exportToCSV', () => {
    beforeEach(() => {
      // Mock document and URL methods
      spyOn(document, 'createElement').and.returnValue({
        setAttribute: jasmine.createSpy(),
        click: jasmine.createSpy(),
        style: {},
        download: true
      } as any);
      spyOn(document.body, 'appendChild');
      spyOn(document.body, 'removeChild');
      spyOn(URL, 'createObjectURL').and.returnValue('mock-url');
    });

    it('should export filtered banks to CSV', () => {
      component.filteredBanks = mockBanksData.slice(0, 2);
      spyOn(component['snackBar'], 'open');

      component.exportToCSV();

      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'Lista de bancos exportada com sucesso!',
        'Fechar',
        { duration: 3000 }
      );
    });

    it('should show error when no banks to export', () => {
      component.filteredBanks = [];
      spyOn(component['snackBar'], 'open');

      component.exportToCSV();

      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'Nenhum banco para exportar',
        'Fechar',
        { duration: 2000 }
      );
    });
  });

  describe('getBankTypeDescription', () => {
    it('should return correct bank type for cooperativa', () => {
      expect(component.getBankTypeDescription('Cooperativa de Crédito ABC')).toBe('Cooperativa de Crédito');
    });

    it('should return correct bank type for financeira', () => {
      expect(component.getBankTypeDescription('Financeira XYZ')).toBe('Financeira');
    });

    it('should return correct bank type for banco de investimento', () => {
      expect(component.getBankTypeDescription('Banco de Investimento ABC')).toBe('Banco de Investimento');
    });

    it('should return correct bank type for banco de desenvolvimento', () => {
      expect(component.getBankTypeDescription('Banco de Desenvolvimento Regional')).toBe('Banco de Desenvolvimento');
    });

    it('should return default type for unknown bank', () => {
      expect(component.getBankTypeDescription('Banco Regular XYZ')).toBe('Banco Comercial');
    });

    it('should handle case insensitive matching', () => {
      expect(component.getBankTypeDescription('COOPERATIVA DE CRÉDITO')).toBe('Cooperativa de Crédito');
    });
  });

  describe('isMainBank', () => {
    it('should identify main banks correctly', () => {
      expect(component.isMainBank(1)).toBeTruthy(); // BB
      expect(component.isMainBank(33)).toBeTruthy(); // Santander
      expect(component.isMainBank(237)).toBeTruthy(); // Bradesco
      expect(component.isMainBank(341)).toBeTruthy(); // Itaú
      expect(component.isMainBank(999)).toBeFalsy(); // Not main bank
    });
  });

  describe('retry', () => {
    it('should call loadBanks', () => {
      spyOn(component, 'loadBanks');

      component.retry();

      expect(component.loadBanks).toHaveBeenCalled();
    });
  });

  describe('convertToCSV', () => {
    it('should convert banks data to CSV format', () => {
      const testBanks = mockBanksData.slice(0, 2);
      
      const csvResult = (component as any).convertToCSV(testBanks);

      expect(csvResult).toContain('Código');
      expect(csvResult).toContain('Nome');
      expect(csvResult).toContain('Nome Completo');
      expect(csvResult).toContain('ISPB');
      expect(csvResult).toContain('"Banco do Brasil"');
      expect(csvResult).toContain('"1"');
    });

    it('should handle special characters in CSV', () => {
      const testBanks = [
        { ispb: '00000000', name: 'Bank "Special" & Co', code: 1, fullName: 'Bank "Special" & Co S.A.' }
      ];

      const csvResult = (component as any).convertToCSV(testBanks);

      expect(csvResult).toContain('""Special""'); // Escaped quotes
    });
  });

  describe('Component Integration', () => {
    it('should setup search functionality on init', () => {
      bankService.getBanks.and.returnValue(of(mockBanksData));
      bankService.filterBanks.and.returnValue(mockBanksData);
      
      component.ngOnInit();

      expect(component.searchControl).toBeDefined();
      expect(component.sortByControl).toBeDefined();
      expect(component.sortOrderControl).toBeDefined();
    });

    it('should handle search control changes', (done) => {
      bankService.filterBanks.and.returnValue(mockBanksData.slice(0, 1));
      component.banks = mockBanksData;

      // Trigger value change
      component.searchControl.setValue('Brasil');

      // Wait for debounce
      setTimeout(() => {
        expect(bankService.filterBanks).toHaveBeenCalled();
        done();
      }, 350);
    });

    it('should handle empty banks array gracefully', () => {
      bankService.getBanks.and.returnValue(of([]));
      spyOn(component['snackBar'], 'open');

      component.loadBanks();

      expect(component.banks).toEqual([]);
      expect(component.totalBanks).toBe(0);
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        '0 bancos carregados com sucesso!',
        'Fechar',
        { duration: 3000 }
      );
    });
  });
});