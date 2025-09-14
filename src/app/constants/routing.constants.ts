export const ROUTING_CONSTANTS = {
  // Route Paths
  ROUTES: {
    HOME: '/',
    DASHBOARD: '/dashboard',
    CEP_SEARCH: '/cep-search',
    BANK_LIST: '/bank-list',
    CNPJ_SEARCH: '/cnpj-search',
    TAXAS_DASHBOARD: '/taxas-dashboard',
    NOT_FOUND: '/404'
  },
  
  // Route Parameters
  PARAMS: {
    ID: 'id',
    CEP: 'cep',
    CNPJ: 'cnpj',
    BANK_CODE: 'bankCode',
    TAB: 'tab'
  },
  
  // Query Parameters
  QUERY_PARAMS: {
    SEARCH: 'search',
    FILTER: 'filter',
    PAGE: 'page',
    SIZE: 'size',
    SORT: 'sort',
    ORDER: 'order',
    CATEGORY: 'category'
  },
  
  // Navigation Menu Items
  NAVIGATION_ITEMS: [
    {
      name: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
      description: 'Visão geral do sistema',
      order: 1,
      enabled: true
    },
    {
      name: 'Consulta CEP',
      route: '/cep-search',
      icon: 'place',
      description: 'Buscar endereços por CEP',
      order: 2,
      enabled: true
    },
    {
      name: 'Lista de Bancos',
      route: '/bank-list',
      icon: 'account_balance',
      description: 'Explorar bancos brasileiros',
      order: 3,
      enabled: true
    },
    {
      name: 'Consulta CNPJ',
      route: '/cnpj-search',
      icon: 'business',
      description: 'Buscar dados de empresas',
      order: 4,
      enabled: true
    },
    {
      name: 'Taxas Financeiras',
      route: '/taxas-dashboard',
      icon: 'trending_up',
      description: 'Acompanhar cotações',
      order: 5,
      enabled: true
    }
  ],
  
  // Breadcrumb Configuration
  BREADCRUMBS: {
    ['/dashboard']: [
      { label: 'Home', route: '/' },
      { label: 'Dashboard', route: '/dashboard' }
    ],
    ['/cep-search']: [
      { label: 'Home', route: '/' },
      { label: 'Consulta CEP', route: '/cep-search' }
    ],
    ['/bank-list']: [
      { label: 'Home', route: '/' },
      { label: 'Bancos', route: '/bank-list' }
    ],
    ['/cnpj-search']: [
      { label: 'Home', route: '/' },
      { label: 'Consulta CNPJ', route: '/cnpj-search' }
    ],
    ['/taxas-dashboard']: [
      { label: 'Home', route: '/' },
      { label: 'Taxas', route: '/taxas-dashboard' }
    ]
  },
  
  // Page Titles
  PAGE_TITLES: {
    ['/dashboard']: 'Dashboard - Brasil API',
    ['/cep-search']: 'Consulta CEP - Brasil API',
    ['/bank-list']: 'Lista de Bancos - Brasil API',
    ['/cnpj-search']: 'Consulta CNPJ - Brasil API',
    ['/taxas-dashboard']: 'Taxas Financeiras - Brasil API',
    ['/404']: 'Página não encontrada - Brasil API',
    default: 'Brasil Dashboard - APIs Brasileiras'
  },
  
  // Meta Descriptions
  META_DESCRIPTIONS: {
    ['/dashboard']: 'Dashboard com visão geral das APIs brasileiras disponíveis',
    ['/cep-search']: 'Busque informações de endereços através do CEP utilizando a Brasil API',
    ['/bank-list']: 'Lista completa dos bancos brasileiros com informações oficiais',
    ['/cnpj-search']: 'Consulte dados de empresas através do CNPJ usando a Brasil API',
    ['/taxas-dashboard']: 'Acompanhe as taxas e cotações financeiras em tempo real',
    default: 'Dashboard de APIs brasileiras para consulta de CEP, bancos, CNPJ e taxas financeiras'
  },
  
  // Route Guards Configuration
  GUARDS: {
    // Currently no authentication required, but structure for future use
    AUTHENTICATED_ROUTES: [],
    PUBLIC_ROUTES: [
      '/dashboard',
      '/cep-search',
      '/bank-list',
      '/cnpj-search',
      '/taxas-dashboard'
    ]
  },
  
  // External Links
  EXTERNAL_LINKS: {
    BRASIL_API_DOCS: 'https://brasilapi.com.br/docs',
    BANCO_DO_BRASIL: 'https://www.bb.com.br',
    GITHUB_REPO: 'https://github.com/username/brasil-dashboard',
    PORTFOLIO: '#',
    LINKEDIN: '#'
  }
} as const;

// Type definitions for better type safety
export interface INavigationItem {
  name: string;
  route: string;
  icon: string;
  description: string;
  order: number;
  enabled: boolean;
}

export interface IBreadcrumbItem {
  label: string;
  route: string;
}