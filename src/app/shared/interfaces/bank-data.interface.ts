export interface IBankData {
  ispb: string;
  name: string;
  code: number;
  fullName: string;
}

export interface IBankFilter {
  searchTerm: string;
  sortBy: 'name' | 'code' | 'fullName';
  sortOrder: 'asc' | 'desc';
}