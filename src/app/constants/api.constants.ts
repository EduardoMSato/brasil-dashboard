export const API_CONSTANTS = {
  // Brasil API base URLs
  BASE_URL: 'https://brasilapi.com.br/api',
  
  ENDPOINTS: {
    CEP: '/cep/v2',
    BANKS: '/banks/v1',
    CNPJ: '/cnpj/v1',
    TAXAS: '/taxas/v1'
  },
  
  // API Configuration
  TIMEOUT: 15000, // 15 seconds
  RETRY_ATTEMPTS: 2,
  
  // Rate Limits (requests per minute)
  RATE_LIMITS: {
    CEP: 100,
    BANKS: 50,
    CNPJ: 30,
    TAXAS: 40
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    TIMEOUT_ERROR: 'Tempo limite esgotado. Tente novamente.',
    SERVER_ERROR: 'Erro do servidor. Tente novamente mais tarde.',
    NOT_FOUND: 'Dados não encontrados.',
    BAD_REQUEST: 'Requisição inválida.',
    GENERIC_ERROR: 'Erro inesperado. Tente novamente.'
  },
  
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TIMEOUT: 408,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
  }
} as const;