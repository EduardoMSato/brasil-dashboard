export interface ICepData {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
  location?: {
    type: string;
    coordinates: {
      longitude?: string;
      latitude?: string;
    };
  };
}

export interface ICepHistory {
  id: string;
  searchedCep: string;
  result: ICepData;
  timestamp: Date;
}