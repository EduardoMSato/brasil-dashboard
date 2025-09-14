export interface ITaxaData {
  nome: string;
  valor: number;
}

export interface ITaxaHistory {
  id: string;
  timestamp: Date;
  rates: ITaxaData[];
}