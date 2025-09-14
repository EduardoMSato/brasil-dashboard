export interface ICnpjData {
  cnpj: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: string;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_de_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string;
  ddd_telefone_2?: string;
  ddd_fax?: string;
  capital_social: number;
  porte: string;
  opcao_pelo_simples: boolean;
  data_opcao_pelo_simples?: string;
  data_exclusao_do_simples?: string;
  opcao_pelo_mei: boolean;
  situacao_especial?: string;
  data_situacao_especial?: string;
  qsa?: ICnpjPartner[];
  qualificacao_do_responsavel: number;
  faturamento_presumido?: string;
}

export interface ICnpjPartner {
  identificador_de_socio: number;
  nome_socio: string;
  cnpj_cpf_do_socio: string;
  codigo_qualificacao_socio: number;
  percentual_capital_social: number;
  data_entrada_sociedade: string;
  cpf_representante_legal?: string;
  nome_representante_legal?: string;
  codigo_faixa_etaria?: number;
}