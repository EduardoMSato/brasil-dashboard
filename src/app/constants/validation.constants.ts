export const VALIDATION_CONSTANTS = {
  // Regular Expression Patterns
  PATTERNS: {
    CEP: /^\d{5}-?\d{3}$/,
    CEP_STRICT: /^\d{8}$/,
    CEP_FORMATTED: /^\d{5}-\d{3}$/,
    
    CNPJ: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/,
    CNPJ_STRICT: /^\d{14}$/,
    CNPJ_FORMATTED: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    
    CPF: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/,
    CPF_STRICT: /^\d{11}$/,
    CPF_FORMATTED: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    
    PHONE: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
    PHONE_MOBILE: /^\(?\d{2}\)?\s?\d{5}-?\d{4}$/,
    PHONE_LANDLINE: /^\(?\d{2}\)?\s?\d{4}-?\d{4}$/,
    
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    NUMERIC: /^\d+$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    LETTERS_ONLY: /^[a-zA-ZÀ-ÿ\s]+$/,
    
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
  },
  
  // Field Lengths
  LENGTHS: {
    CEP: {
      MIN: 8,
      MAX: 9 // With dash
    },
    CNPJ: {
      MIN: 14,
      MAX: 18 // With formatting
    },
    CPF: {
      MIN: 11,
      MAX: 14 // With formatting
    },
    PHONE: {
      MIN: 10,
      MAX: 15 // With formatting
    },
    EMAIL: {
      MIN: 5,
      MAX: 254
    },
    PASSWORD: {
      MIN: 8,
      MAX: 128
    },
    NAME: {
      MIN: 2,
      MAX: 100
    },
    DESCRIPTION: {
      MIN: 10,
      MAX: 500
    },
    SEARCH: {
      MIN: 2,
      MAX: 100
    }
  },
  
  // Error Messages
  MESSAGES: {
    REQUIRED: 'Este campo é obrigatório',
    
    CEP: {
      REQUIRED: 'CEP é obrigatório',
      INVALID: 'CEP deve ter 8 dígitos (formato: 00000-000)',
      NOT_FOUND: 'CEP não encontrado',
      FORMAT: 'Use o formato: 00000-000'
    },
    
    CNPJ: {
      REQUIRED: 'CNPJ é obrigatório',
      INVALID: 'CNPJ inválido',
      FORMAT: 'Use o formato: 00.000.000/0000-00',
      CHECK_DIGITS: 'CNPJ com dígitos verificadores inválidos',
      LENGTH: 'CNPJ deve ter 14 dígitos'
    },
    
    CPF: {
      REQUIRED: 'CPF é obrigatório',
      INVALID: 'CPF inválido',
      FORMAT: 'Use o formato: 000.000.000-00',
      CHECK_DIGITS: 'CPF com dígitos verificadores inválidos',
      LENGTH: 'CPF deve ter 11 dígitos'
    },
    
    PHONE: {
      REQUIRED: 'Telefone é obrigatório',
      INVALID: 'Telefone inválido',
      FORMAT: 'Use o formato: (00) 0000-0000 ou (00) 90000-0000'
    },
    
    EMAIL: {
      REQUIRED: 'E-mail é obrigatório',
      INVALID: 'E-mail inválido',
      FORMAT: 'Use o formato: usuario@dominio.com'
    },
    
    PASSWORD: {
      REQUIRED: 'Senha é obrigatória',
      MIN_LENGTH: 'Senha deve ter pelo menos 8 caracteres',
      WEAK: 'Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número'
    },
    
    NAME: {
      REQUIRED: 'Nome é obrigatório',
      MIN_LENGTH: 'Nome deve ter pelo menos 2 caracteres',
      MAX_LENGTH: 'Nome deve ter no máximo 100 caracteres',
      INVALID: 'Nome deve conter apenas letras e espaços'
    },
    
    NUMERIC: {
      INVALID: 'Apenas números são permitidos',
      MIN: 'Valor mínimo: {min}',
      MAX: 'Valor máximo: {max}',
      POSITIVE: 'Valor deve ser positivo',
      INTEGER: 'Valor deve ser um número inteiro'
    },
    
    DATE: {
      INVALID: 'Data inválida',
      FORMAT: 'Use o formato: dd/mm/aaaa',
      FUTURE: 'Data não pode ser no futuro',
      PAST: 'Data não pode ser no passado',
      RANGE: 'Data deve estar entre {min} e {max}'
    },
    
    FILE: {
      REQUIRED: 'Arquivo é obrigatório',
      SIZE: 'Arquivo deve ter no máximo {size}MB',
      TYPE: 'Tipo de arquivo não permitido',
      EXTENSIONS: 'Extensões permitidas: {extensions}'
    },
    
    GENERIC: {
      MIN_LENGTH: 'Deve ter pelo menos {length} caracteres',
      MAX_LENGTH: 'Deve ter no máximo {length} caracteres',
      PATTERN: 'Formato inválido',
      MATCH: 'Os campos não coincidem',
      UNIQUE: 'Este valor já está em uso'
    }
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    CEP: 'CEP encontrado com sucesso!',
    CNPJ: 'CNPJ encontrado com sucesso!',
    FORM_VALID: 'Todos os campos estão válidos',
    DATA_SAVED: 'Dados salvos com sucesso!'
  },
  
  // Validation Rules for different contexts
  RULES: {
    CEP_SEARCH: {
      required: true,
      pattern: 'CEP',
      minLength: 8,
      maxLength: 9
    },
    
    CNPJ_SEARCH: {
      required: true,
      pattern: 'CNPJ',
      minLength: 14,
      maxLength: 18,
      customValidation: 'cnpjCheckDigits'
    },
    
    EMAIL_CONTACT: {
      required: true,
      pattern: 'EMAIL',
      minLength: 5,
      maxLength: 254
    },
    
    PHONE_CONTACT: {
      required: false,
      pattern: 'PHONE',
      minLength: 10,
      maxLength: 15
    },
    
    SEARCH_TERM: {
      required: false,
      minLength: 2,
      maxLength: 100,
      pattern: 'ALPHANUMERIC'
    }
  },
  
  // Custom Validators Configuration
  CUSTOM_VALIDATORS: {
    CEP_ASYNC: {
      enabled: true,
      debounceTime: 500
    },
    CNPJ_ASYNC: {
      enabled: true,
      debounceTime: 800
    },
    UNIQUE_CHECK: {
      enabled: false,
      debounceTime: 300
    }
  }
} as const;