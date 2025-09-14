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
import { of, throwError } from 'rxjs';

import { CepSearchComponent } from './cep-search.component';
import { CepService } from '../../core/services/cep.service';
import { ICepData } from '../../shared/interfaces/cep-data.interface';

describe('CepSearchComponent', () => {
  let component: CepSearchComponent;
  let fixture: ComponentFixture<CepSearchComponent>;
  let cepService: jasmine.SpyObj<CepService>;

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

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CepService', ['getCepData']);

    await TestBed.configureTestingModule({
      imports: [
        CepSearchComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatDividerModule
      ],
      providers: [
        { provide: CepService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CepSearchComponent);
    component = fixture.componentInstance;
    cepService = TestBed.inject(CepService) as jasmine.SpyObj<CepService>;

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty CEP field', () => {
    expect(component.cepForm.get('cep')?.value).toBe('');
    expect(component.cepForm.get('cep')?.invalid).toBeTruthy();
  });

  it('should validate CEP format', () => {
    const cepControl = component.cepForm.get('cep');
    
    // Invalid formats
    cepControl?.setValue('123');
    expect(cepControl?.hasError('pattern')).toBeTruthy();
    
    cepControl?.setValue('12345678');
    expect(cepControl?.hasError('pattern')).toBeTruthy();
    
    // Valid formats
    cepControl?.setValue('01001-000');
    expect(cepControl?.hasError('pattern')).toBeFalsy();
    
    cepControl?.setValue('01001000');
    expect(cepControl?.hasError('pattern')).toBeFalsy();
  });

  describe('onSearch', () => {
    it('should call searchCep when form is valid', () => {
      spyOn(component, 'searchCep');
      component.cepForm.get('cep')?.setValue('01001-000');
      
      component.onSearch();
      
      expect(component.searchCep).toHaveBeenCalledWith('01001-000');
    });

    it('should show snackbar when form is invalid', () => {
      spyOn(component['snackBar'], 'open');
      component.cepForm.get('cep')?.setValue('');
      
      component.onSearch();
      
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'Por favor, digite um CEP válido (formato: 00000-000)', 
        'Fechar', 
        { duration: 3000 }
      );
    });
  });

  describe('searchCep', () => {
    beforeEach(() => {
      spyOn(component, 'addToHistory');
    });

    it('should search CEP successfully', () => {
      cepService.getCepData.and.returnValue(of(mockCepData));
      spyOn(component['snackBar'], 'open');
      
      component.searchCep('01001000');
      
      expect(component.isLoading).toBeFalsy();
      expect(component.cepData).toEqual(mockCepData);
      expect(component.error).toBe('');
      expect(component.addToHistory).toHaveBeenCalledWith(mockCepData);
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'CEP encontrado com sucesso!', 
        'Fechar', 
        { duration: 2000 }
      );
    });

    it('should handle search error', () => {
      const errorMessage = 'CEP não encontrado';
      cepService.getCepData.and.returnValue(throwError(() => new Error(errorMessage)));
      spyOn(component['snackBar'], 'open');
      
      component.searchCep('01001000');
      
      expect(component.isLoading).toBeFalsy();
      expect(component.cepData).toBeNull();
      expect(component.error).toBe(errorMessage);
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        errorMessage, 
        'Fechar', 
        { duration: 4000 }
      );
    });

    it('should set loading state during search', () => {
      cepService.getCepData.and.returnValue(of(mockCepData));
      
      component.searchCep('01001000');
      
      // After synchronous observable completion, loading should be false
      expect(component.isLoading).toBeFalsy();
    });
  });

  describe('formatCep', () => {
    it('should format CEP correctly', () => {
      expect(component.formatCep('01001000')).toBe('01001-000');
    });

    it('should format CEP with existing formatting', () => {
      expect(component.formatCep('01001-000')).toBe('01001-000');
    });

    it('should handle CEP with extra characters', () => {
      expect(component.formatCep('01.001-000')).toBe('01001-000');
    });

    it('should handle empty string', () => {
      expect(component.formatCep('')).toBe('-');
    });

    it('should handle short CEP', () => {
      expect(component.formatCep('12345')).toBe('12345-');
    });
  });

  describe('onCepInput', () => {
    it('should format CEP input progressively', () => {
      const mockEvent = { target: { value: '01001000' } };
      
      component.onCepInput(mockEvent);
      
      expect(component.cepForm.get('cep')?.value).toBe('01001-000');
    });

    it('should handle partial CEP input', () => {
      const mockEvent = { target: { value: '01001' } };
      
      component.onCepInput(mockEvent);
      
      expect(component.cepForm.get('cep')?.value).toBe('01001');
    });

    it('should remove non-numeric characters', () => {
      const mockEvent = { target: { value: '01.001-000' } };
      
      component.onCepInput(mockEvent);
      
      expect(component.cepForm.get('cep')?.value).toBe('01001-000');
    });

    it('should limit input length', () => {
      const mockEvent = { target: { value: '010010001234' } };
      
      component.onCepInput(mockEvent);
      
      expect(component.cepForm.get('cep')?.value).toBe('01001-000');
    });
  });

  describe('clearForm', () => {
    it('should reset form and clear data', () => {
      component.cepData = mockCepData;
      component.error = 'Some error';
      component.cepForm.get('cep')?.setValue('01001-000');
      
      component.clearForm();
      
      expect(component.cepForm.get('cep')?.value).toBeNull();
      expect(component.cepData).toBeNull();
      expect(component.error).toBe('');
    });
  });

  describe('Search History', () => {
    beforeEach(() => {
      // Reset localStorage spies
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify([mockCepData]));
    });

    it('should load search history on init', () => {
      component.ngOnInit();
      expect(component.searchHistory).toEqual([mockCepData]);
    });

    it('should add new search to history', () => {
      component.searchHistory = [];
      
      (component as any).addToHistory(mockCepData);
      
      expect(component.searchHistory).toContain(mockCepData);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'cep-history', 
        JSON.stringify([mockCepData])
      );
    });

    it('should limit history to 5 items', () => {
      const mockData = Array.from({ length: 6 }, (_, i) => ({
        ...mockCepData,
        cep: `0100100${i}`,
        street: `Street ${i}`
      }));
      
      component.searchHistory = mockData.slice(0, 5);
      
      (component as any).addToHistory(mockData[5]);
      
      expect(component.searchHistory.length).toBe(5);
      expect(component.searchHistory[0]).toBe(mockData[5]);
    });

    it('should remove duplicate from history', () => {
      const duplicateData = { ...mockCepData };
      component.searchHistory = [mockCepData, duplicateData];
      
      (component as any).addToHistory(mockCepData);
      
      expect(component.searchHistory.filter(item => item.cep === mockCepData.cep).length).toBe(1);
      expect(component.searchHistory[0]).toBe(mockCepData);
    });

    it('should search from history', () => {
      spyOn(component, 'searchCep');
      
      component.searchFromHistory('01001000');
      
      expect(component.cepForm.get('cep')?.value).toBe('01001-000');
      expect(component.searchCep).toHaveBeenCalledWith('01001000');
    });

    it('should clear history', () => {
      component.searchHistory = [mockCepData];
      spyOn(component['snackBar'], 'open');
      
      component.clearHistory();
      
      expect(component.searchHistory).toEqual([]);
      expect(localStorage.removeItem).toHaveBeenCalledWith('cep-history');
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'Histórico limpo com sucesso!', 
        'Fechar', 
        { duration: 2000 }
      );
    });
  });

  describe('Component Integration', () => {
    it('should handle complete search flow', () => {
      cepService.getCepData.and.returnValue(of(mockCepData));
      spyOn(component['snackBar'], 'open');
      spyOn(component, 'addToHistory');
      
      // Set form value
      component.cepForm.get('cep')?.setValue('01001000');
      
      // Trigger search
      component.onSearch();
      
      // Verify results
      expect(component.cepData).toEqual(mockCepData);
      expect(component.error).toBe('');
      expect(component.addToHistory).toHaveBeenCalledWith(mockCepData);
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'CEP encontrado com sucesso!', 
        'Fechar', 
        { duration: 2000 }
      );
    });

    it('should handle localStorage errors gracefully', () => {
      (localStorage.getItem as jasmine.Spy).and.throwError('Storage error');
      
      expect(() => component.ngOnInit()).not.toThrow();
      expect(component.searchHistory).toEqual([]);
    });

    it('should handle malformed localStorage data', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('invalid json');
      
      expect(() => component.ngOnInit()).not.toThrow();
      expect(component.searchHistory).toEqual([]);
    });
  });
});