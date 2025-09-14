import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { of, throwError } from 'rxjs';

import { CnpjSearchComponent } from './cnpj-search.component';
import { CnpjService } from '../../core/services/cnpj.service';
import { ICnpjData } from '../../shared/interfaces/cnpj-data.interface';

describe('CnpjSearchComponent', () => {
  let component: CnpjSearchComponent;
  let fixture: ComponentFixture<CnpjSearchComponent>;
  let cnpjService: jasmine.SpyObj<CnpjService>;

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

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CnpjService', ['getCnpjData', 'formatCnpj']);

    await TestBed.configureTestingModule({
      imports: [
        CnpjSearchComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatDividerModule,
        MatChipsModule,
        MatTabsModule,
        MatExpansionModule
      ],
      providers: [
        { provide: CnpjService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CnpjSearchComponent);
    component = fixture.componentInstance;
    cnpjService = TestBed.inject(CnpjService) as jasmine.SpyObj<CnpjService>;

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty CNPJ field', () => {
    expect(component.cnpjForm.get('cnpj')?.value).toBe('');
    expect(component.cnpjForm.get('cnpj')?.invalid).toBeTruthy();
  });

  it('should validate CNPJ format', () => {
    const cnpjControl = component.cnpjForm.get('cnpj');
    
    // Invalid format
    cnpjControl?.setValue('123');
    expect(cnpjControl?.hasError('pattern')).toBeTruthy();
    
    // Valid format with dots and slashes
    cnpjControl?.setValue('00.000.000/0001-91');
    expect(cnpjControl?.hasError('pattern')).toBeFalsy();
    
    // Valid format without formatting
    cnpjControl?.setValue('00000000000191');
    expect(cnpjControl?.hasError('pattern')).toBeFalsy();
  });

  describe('onSearch', () => {
    it('should call searchCnpj when form is valid', () => {
      spyOn(component, 'searchCnpj');
      component.cnpjForm.get('cnpj')?.setValue('00.000.000/0001-91');
      
      component.onSearch();
      
      expect(component.searchCnpj).toHaveBeenCalledWith('00.000.000/0001-91');
    });

    it('should show snackbar when form is invalid', () => {
      spyOn(component['snackBar'], 'open');
      component.cnpjForm.get('cnpj')?.setValue('');
      
      component.onSearch();
      
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'Por favor, digite um CNPJ válido', 
        'Fechar', 
        { duration: 3000 }
      );
    });
  });

  describe('searchCnpj', () => {
    beforeEach(() => {
      cnpjService.formatCnpj.and.returnValue('00.000.000/0001-91');
    });

    it('should search CNPJ successfully', () => {
      cnpjService.getCnpjData.and.returnValue(of(mockCnpjData));
      spyOn(component, 'addToHistory');
      spyOn(component['snackBar'], 'open');
      
      component.searchCnpj('00000000000191');
      
      expect(component.isLoading).toBeFalsy();
      expect(component.cnpjData).toEqual(mockCnpjData);
      expect(component.error).toBe('');
      expect(component.addToHistory).toHaveBeenCalledWith('00000000000191');
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'CNPJ encontrado com sucesso!', 
        'Fechar', 
        { duration: 2000 }
      );
    });

    it('should handle search error', () => {
      const errorMessage = 'CNPJ não encontrado';
      cnpjService.getCnpjData.and.returnValue(throwError(() => new Error(errorMessage)));
      spyOn(component['snackBar'], 'open');
      
      component.searchCnpj('00000000000191');
      
      expect(component.isLoading).toBeFalsy();
      expect(component.cnpjData).toBeNull();
      expect(component.error).toBe(errorMessage);
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        errorMessage, 
        'Fechar', 
        { duration: 4000 }
      );
    });

    it('should set loading state during search', () => {
      cnpjService.getCnpjData.and.returnValue(of(mockCnpjData));
      
      component.searchCnpj('00000000000191');
      
      // During the search, we can't test loading state due to synchronous nature of observables in tests
      // But we can verify it ends up false
      expect(component.isLoading).toBeFalsy();
    });
  });

  describe('searchSample', () => {
    it('should set form value and search', () => {
      cnpjService.formatCnpj.and.returnValue('00.000.000/0001-91');
      spyOn(component, 'searchCnpj');
      
      component.searchSample('00000000000191');
      
      expect(component.cnpjForm.get('cnpj')?.value).toBe('00.000.000/0001-91');
      expect(component.searchCnpj).toHaveBeenCalledWith('00000000000191');
    });
  });

  describe('onCnpjInput', () => {
    it('should format CNPJ input progressively', () => {
      const mockEvent = { target: { value: '00000000000191' } };
      
      component.onCnpjInput(mockEvent);
      
      expect(component.cnpjForm.get('cnpj')?.value).toBe('00.000.000/0001-91');
    });

    it('should handle partial CNPJ input', () => {
      const mockEvent = { target: { value: '000000' } };
      
      component.onCnpjInput(mockEvent);
      
      expect(component.cnpjForm.get('cnpj')?.value).toBe('00.000');
    });

    it('should limit input to 14 digits', () => {
      const mockEvent = { target: { value: '000000000001911111' } };
      
      component.onCnpjInput(mockEvent);
      
      // Should be truncated and formatted
      expect(component.cnpjForm.get('cnpj')?.value).toBe('00.000.000/0001-91');
    });
  });

  describe('formatDate', () => {
    it('should format valid date', () => {
      const result = component.formatDate('2023-01-15');
      expect(result).toBe('15/01/2023');
    });

    it('should handle empty date', () => {
      const result = component.formatDate('');
      expect(result).toBe('Não informado');
    });

    it('should handle invalid date', () => {
      const result = component.formatDate('invalid-date');
      expect(result).toBe('invalid-date');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const result = component.formatCurrency(1000000);
      expect(result).toBe('R$ 1.000.000,00');
    });

    it('should handle zero value', () => {
      const result = component.formatCurrency(0);
      expect(result).toBe('R$ 0,00');
    });

    it('should handle null value', () => {
      const result = component.formatCurrency(null as any);
      expect(result).toBe('R$ 0,00');
    });
  });

  describe('getStatusClass', () => {
    it('should return active class for active status', () => {
      expect(component.getStatusClass('ATIVA')).toBe('status-active');
      expect(component.getStatusClass('ativa')).toBe('status-active');
    });

    it('should return suspended class for suspended status', () => {
      expect(component.getStatusClass('SUSPENSA')).toBe('status-suspended');
    });

    it('should return canceled class for canceled status', () => {
      expect(component.getStatusClass('CANCELADA')).toBe('status-canceled');
    });

    it('should return unknown class for unknown status', () => {
      expect(component.getStatusClass('UNKNOWN')).toBe('status-unknown');
    });

    it('should handle empty status', () => {
      expect(component.getStatusClass('')).toBe('');
    });
  });

  describe('getPorteDescription', () => {
    it('should return correct description for known porte codes', () => {
      expect(component.getPorteDescription('01')).toBe('Microempresa');
      expect(component.getPorteDescription('02')).toBe('Pequena Empresa');
      expect(component.getPorteDescription('03')).toBe('Média Empresa');
      expect(component.getPorteDescription('04')).toBe('Grande Empresa');
      expect(component.getPorteDescription('05')).toBe('Empresa de Grande Porte');
    });

    it('should return original value for unknown porte', () => {
      expect(component.getPorteDescription('99')).toBe('99');
    });

    it('should handle empty porte', () => {
      expect(component.getPorteDescription('')).toBe('Não informado');
    });
  });

  describe('clearForm', () => {
    it('should reset form and clear data', () => {
      component.cnpjData = mockCnpjData;
      component.error = 'Some error';
      component.cnpjForm.get('cnpj')?.setValue('00000000000191');
      
      component.clearForm();
      
      expect(component.cnpjForm.get('cnpj')?.value).toBeNull();
      expect(component.cnpjData).toBeNull();
      expect(component.error).toBe('');
    });
  });

  describe('Search History', () => {
    beforeEach(() => {
      // Reset localStorage spies
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(['00000000000191']));
    });

    it('should load search history on init', () => {
      component.ngOnInit();
      expect(component.searchHistory).toEqual(['00000000000191']);
    });

    it('should add new search to history', () => {
      component.searchHistory = [];
      
      (component as any).addToHistory('00000000000191');
      
      expect(component.searchHistory).toContain('00000000000191');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'cnpj-history', 
        JSON.stringify(['00000000000191'])
      );
    });

    it('should limit history to 5 items', () => {
      component.searchHistory = ['1', '2', '3', '4', '5'];
      
      (component as any).addToHistory('6');
      
      expect(component.searchHistory.length).toBe(5);
      expect(component.searchHistory[0]).toBe('6');
      expect(component.searchHistory).not.toContain('5');
    });

    it('should remove duplicate from history', () => {
      component.searchHistory = ['00000000000191', '33000167000101'];
      
      (component as any).addToHistory('00000000000191');
      
      expect(component.searchHistory.filter(item => item === '00000000000191').length).toBe(1);
      expect(component.searchHistory[0]).toBe('00000000000191');
    });

    it('should search from history', () => {
      cnpjService.formatCnpj.and.returnValue('00.000.000/0001-91');
      spyOn(component, 'searchCnpj');
      
      component.searchFromHistory('00000000000191');
      
      expect(component.cnpjForm.get('cnpj')?.value).toBe('00.000.000/0001-91');
      expect(component.searchCnpj).toHaveBeenCalledWith('00000000000191');
    });

    it('should clear history', () => {
      component.searchHistory = ['00000000000191'];
      spyOn(component['snackBar'], 'open');
      
      component.clearHistory();
      
      expect(component.searchHistory).toEqual([]);
      expect(localStorage.removeItem).toHaveBeenCalledWith('cnpj-history');
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'Histórico limpo com sucesso!', 
        'Fechar', 
        { duration: 2000 }
      );
    });
  });

  describe('Component Integration', () => {
    it('should have sample CNPJs for testing', () => {
      expect(component.sampleCnpjs.length).toBeGreaterThan(0);
      expect(component.sampleCnpjs[0]).toEqual({ name: 'Banco do Brasil', cnpj: '00000000000191' });
    });

    it('should handle complete search flow', () => {
      cnpjService.getCnpjData.and.returnValue(of(mockCnpjData));
      cnpjService.formatCnpj.and.returnValue('00.000.000/0001-91');
      spyOn(component['snackBar'], 'open');
      
      // Set form value
      component.cnpjForm.get('cnpj')?.setValue('00000000000191');
      
      // Trigger search
      component.onSearch();
      
      // Verify results
      expect(component.cnpjData).toEqual(mockCnpjData);
      expect(component.error).toBe('');
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'CNPJ encontrado com sucesso!', 
        'Fechar', 
        { duration: 2000 }
      );
    });
  });
});