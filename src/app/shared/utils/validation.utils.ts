export class ValidationUtils {
  /**
   * Validates if a CEP string is in valid format
   * @param cep - CEP string to validate
   * @returns boolean indicating if CEP is valid
   */
  static isValidCep(cep: string): boolean {
    if (!cep) return false;
    
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  }

  /**
   * Validates if a CNPJ string is in valid format and has valid check digits
   * @param cnpj - CNPJ string to validate  
   * @returns boolean indicating if CNPJ is valid
   */
  static isValidCnpj(cnpj: string): boolean {
    if (!cnpj) return false;
    
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) return false;
    
    // Check for known invalid patterns
    if (/^(\d)\1+$/.test(cleanCnpj)) return false;
    
    // Validate check digits
    return ValidationUtils.validateCnpjCheckDigits(cleanCnpj);
  }

  /**
   * Validates CNPJ check digits using official algorithm
   * @param cnpj - Clean 14-digit CNPJ string
   * @returns boolean indicating if check digits are valid
   */
  private static validateCnpjCheckDigits(cnpj: string): boolean {
    const digits = cnpj.split('').map(Number);
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    // First check digit
    const sum1 = digits.slice(0, 12).reduce((acc, digit, index) => acc + digit * weights1[index], 0);
    const checkDigit1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11);
    
    if (digits[12] !== checkDigit1) return false;
    
    // Second check digit
    const sum2 = digits.slice(0, 13).reduce((acc, digit, index) => acc + digit * weights2[index], 0);
    const checkDigit2 = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11);
    
    return digits[13] === checkDigit2;
  }

  /**
   * Validates if a phone number is in valid Brazilian format
   * @param phone - Phone number string to validate
   * @returns boolean indicating if phone is valid
   */
  static isValidPhone(phone: string): boolean {
    if (!phone) return false;
    
    const cleanPhone = phone.replace(/\D/g, '');
    // Brazilian phone: 10 digits (landline) or 11 digits (mobile)
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  }

  /**
   * Validates if a value is a valid number within optional range
   * @param value - Value to validate
   * @param min - Optional minimum value
   * @param max - Optional maximum value
   * @returns boolean indicating if value is valid number
   */
  static isValidNumber(value: any, min?: number, max?: number): boolean {
    const num = Number(value);
    
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    
    return true;
  }

  /**
   * Validates if an email is in valid format
   * @param email - Email string to validate
   * @returns boolean indicating if email is valid
   */
  static isValidEmail(email: string): boolean {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}