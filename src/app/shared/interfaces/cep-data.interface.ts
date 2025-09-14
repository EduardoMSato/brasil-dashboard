export interface ICepData {
  cep: string;
  state: string;
  city: string;
  district: string;
  lat: string;
  lng: string;
  street: string;
  service: string;
}

export interface ICepHistory {
  id: string;
  searchedCep: string;
  result: ICepData;
  timestamp: Date;
}