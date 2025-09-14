export const APP_CONSTANTS = {
  // Application Info
  APP_NAME: 'Brasil Dashboard',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Dashboard de APIs brasileiras para demonstração Banco do Brasil',
  
  // Local Storage Keys
  STORAGE_KEYS: {
    CEP_HISTORY: 'cep-history',
    BANK_FILTERS: 'bank-filters',
    CNPJ_HISTORY: 'cnpj-history',
    USER_PREFERENCES: 'user-preferences',
    THEME_PREFERENCE: 'theme-preference'
  },
  
  // UI Configuration
  UI: {
    SIDEBAR_WIDTH: '260px',
    SIDEBAR_MINI_WIDTH: '64px',
    HEADER_HEIGHT: '64px',
    MOBILE_BREAKPOINT: '768px',
    TABLET_BREAKPOINT: '1024px',
    DESKTOP_BREAKPOINT: '1200px'
  },
  
  // Animation Durations (ms)
  ANIMATIONS: {
    FAST: 150,
    NORMAL: 250,
    SLOW: 400,
    DRAWER_TOGGLE: 300,
    SNACKBAR_DURATION: 3000
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
    MAX_PAGE_SIZE: 100
  },
  
  // Search Configuration
  SEARCH: {
    MIN_SEARCH_LENGTH: 2,
    DEBOUNCE_TIME: 300, // ms
    MAX_HISTORY_ITEMS: 10
  },
  
  // File Upload
  FILE_UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'],
    ALLOWED_MIME_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
  },
  
  // Validation Patterns
  VALIDATION: {
    CEP_PATTERN: /^\d{5}-?\d{3}$/,
    CNPJ_PATTERN: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/,
    PHONE_PATTERN: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  
  // Date Formats
  DATE_FORMATS: {
    SHORT: 'dd/MM/yyyy',
    LONG: 'dd/MM/yyyy HH:mm',
    TIME: 'HH:mm:ss',
    ISO: 'yyyy-MM-ddTHH:mm:ss',
    DISPLAY: 'dd \'de\' MMMM \'de\' yyyy'
  },
  
  // Currency Configuration
  CURRENCY: {
    CODE: 'BRL',
    SYMBOL: 'R$',
    DECIMAL_PLACES: 2,
    THOUSANDS_SEPARATOR: '.',
    DECIMAL_SEPARATOR: ','
  },
  
  // Charts Configuration
  CHARTS: {
    DEFAULT_HEIGHT: 300,
    DEFAULT_COLORS: [
      '#003D7A', // BB Blue
      '#FFD700', // BB Yellow
      '#27AE60', // Success Green
      '#E74C3C', // Error Red
      '#3498DB', // Info Blue
      '#9B59B6', // Purple
      '#F39C12', // Orange
      '#1ABC9C'  // Turquoise
    ],
    ANIMATION_DURATION: 750
  },
  
  // Export Configuration
  EXPORT: {
    FORMATS: ['CSV', 'XLSX', 'PDF'],
    MAX_EXPORT_ROWS: 10000,
    CSV_DELIMITER: ';',
    CSV_ENCODING: 'UTF-8'
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_DARK_THEME: false,
    ENABLE_EXPORT: true,
    ENABLE_CHARTS: true,
    ENABLE_HISTORY: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_OFFLINE_MODE: false
  },
  
  // Toast/Snackbar Messages
  MESSAGES: {
    SUCCESS: {
      DATA_LOADED: 'Dados carregados com sucesso!',
      DATA_SAVED: 'Dados salvos com sucesso!',
      DATA_DELETED: 'Dados removidos com sucesso!',
      EXPORT_SUCCESS: 'Arquivo exportado com sucesso!'
    },
    ERROR: {
      LOAD_FAILED: 'Falha ao carregar dados',
      SAVE_FAILED: 'Falha ao salvar dados',
      DELETE_FAILED: 'Falha ao remover dados',
      EXPORT_FAILED: 'Falha ao exportar arquivo',
      VALIDATION_FAILED: 'Por favor, verifique os campos obrigatórios'
    },
    INFO: {
      NO_DATA: 'Nenhum dado encontrado',
      LOADING: 'Carregando...',
      PROCESSING: 'Processando...'
    }
  }
} as const;