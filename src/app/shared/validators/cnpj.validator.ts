import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ValidationUtils } from '../utils/validation.utils';

export class CnpjValidator {
  /**
   * Validator function for CNPJ format and check digit validation
   * @returns ValidatorFn that validates CNPJ format and check digits
   */
  static validCnpj(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const isValid = ValidationUtils.isValidCnpj(control.value);
      
      return isValid ? null : { invalidCnpj: { value: control.value } };
    };
  }

  /**
   * Validator function for CNPJ format with custom error message
   * @param errorMessage - Custom error message
   * @returns ValidatorFn that validates CNPJ format
   */
  static validCnpjWithMessage(errorMessage: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isValid = ValidationUtils.isValidCnpj(control.value);
      
      return isValid ? null : { invalidCnpj: { message: errorMessage, value: control.value } };
    };
  }

  /**
   * Validator function for CNPJ format only (without check digit validation)
   * @returns ValidatorFn that validates CNPJ format
   */
  static validCnpjFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const cleanCnpj = control.value.replace(/\D/g, '');
      const isValidFormat = cleanCnpj.length === 14 && !/^(\d)\1+$/.test(cleanCnpj);
      
      return isValidFormat ? null : { invalidCnpjFormat: { value: control.value } };
    };
  }

  /**
   * Validator function for CNPJ check digits only
   * @returns ValidatorFn that validates CNPJ check digits
   */
  static validCnpjCheckDigits(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const cleanCnpj = control.value.replace(/\D/g, '');
      
      if (cleanCnpj.length !== 14) {
        return { invalidCnpjLength: { value: control.value } };
      }

      const isValid = ValidationUtils.isValidCnpj(control.value);
      
      return isValid ? null : { invalidCnpjCheckDigits: { value: control.value } };
    };
  }

  /**
   * Async validator for CNPJ existence (could be used with Brasil API)
   * Note: This is a template - would need actual API integration
   */
  static existingCnpj(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      // This would typically make an API call to validate CNPJ existence
      // For now, just validate format and check digits
      const isValid = ValidationUtils.isValidCnpj(control.value);
      
      return isValid ? null : { nonExistentCnpj: { value: control.value } };
    };
  }
}