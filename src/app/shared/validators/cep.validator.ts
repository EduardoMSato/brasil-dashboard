import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ValidationUtils } from '../utils/validation.utils';

export class CepValidator {
  /**
   * Validator function for CEP format validation
   * @returns ValidatorFn that validates CEP format
   */
  static validCep(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values (use required validator for that)
      }

      const isValid = ValidationUtils.isValidCep(control.value);
      
      return isValid ? null : { invalidCep: { value: control.value } };
    };
  }

  /**
   * Validator function for CEP format with custom error message
   * @param errorMessage - Custom error message
   * @returns ValidatorFn that validates CEP format
   */
  static validCepWithMessage(errorMessage: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isValid = ValidationUtils.isValidCep(control.value);
      
      return isValid ? null : { invalidCep: { message: errorMessage, value: control.value } };
    };
  }

  /**
   * Async validator for CEP existence (could be used with Brasil API)
   * Note: This is a template - would need actual API integration
   */
  static existingCep(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      // This would typically make an API call to validate CEP existence
      // For now, just validate format
      const isValid = ValidationUtils.isValidCep(control.value);
      
      return isValid ? null : { nonExistentCep: { value: control.value } };
    };
  }
}