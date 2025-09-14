export class FormatUtils {
  /**
   * Formats a CEP string to standard format (00000-000)
   * @param cep - CEP string to format
   * @returns formatted CEP string
   */
  static formatCep(cep: string): string {
    if (!cep) return '';
    
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return cep;
    }
    
    return cleanCep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  /**
   * Formats a CNPJ string to standard format (00.000.000/0000-00)
   * @param cnpj - CNPJ string to format
   * @returns formatted CNPJ string
   */
  static formatCnpj(cnpj: string): string {
    if (!cnpj) return '';
    
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
      return cnpj;
    }
    
    return cleanCnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  /**
   * Formats a phone number to Brazilian standard format
   * @param phone - Phone number string to format
   * @returns formatted phone string
   */
  static formatPhone(phone: string): string {
    if (!phone) return '';
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 10) {
      // Landline: (11) 1234-5678
      return cleanPhone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (cleanPhone.length === 11) {
      // Mobile: (11) 91234-5678
      return cleanPhone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    
    return phone;
  }

  /**
   * Formats a currency value to Brazilian format
   * @param value - Numeric value to format
   * @param includeCurrency - Whether to include R$ symbol
   * @returns formatted currency string
   */
  static formatCurrency(value: number | string, includeCurrency = true): string {
    if (value === null || value === undefined || value === '') {
      return includeCurrency ? 'R$ 0,00' : '0,00';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return includeCurrency ? 'R$ 0,00' : '0,00';
    }

    const formatted = numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return includeCurrency ? `R$ ${formatted}` : formatted;
  }

  /**
   * Removes all non-numeric characters from a string
   * @param value - String to clean
   * @returns string with only numeric characters
   */
  static cleanNumeric(value: string): string {
    if (!value) return '';
    return value.replace(/\D/g, '');
  }

  /**
   * Capitalizes the first letter of each word in a string
   * @param text - Text to capitalize
   * @returns capitalized text
   */
  static capitalizeWords(text: string): string {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Formats a date to Brazilian format (dd/mm/yyyy)
   * @param date - Date to format
   * @returns formatted date string
   */
  static formatDate(date: Date | string): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('pt-BR');
  }

  /**
   * Formats a number to percentage format
   * @param value - Number to format as percentage
   * @param decimals - Number of decimal places (default: 2)
   * @returns formatted percentage string
   */
  static formatPercentage(value: number, decimals = 2): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0%';
    }
    
    return (value * 100).toFixed(decimals) + '%';
  }

  /**
   * Truncates text to specified length with ellipsis
   * @param text - Text to truncate
   * @param maxLength - Maximum length before truncation
   * @returns truncated text with ellipsis if needed
   */
  static truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text || '';
    
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Formats file size in human readable format
   * @param bytes - Size in bytes
   * @returns formatted file size string
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}