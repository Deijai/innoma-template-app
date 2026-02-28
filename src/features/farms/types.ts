export type FarmStatus = 'active' | 'inactive' | 'maintenance';

export type FarmType = 'piscicultura' | 'agricultura' | 'pecuaria';

export type Farm = {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  tipo: FarmType;
  status: FarmStatus;
  hectares: number;
};

export type FarmFilters = {
  status: FarmStatus | 'all';
  tipo: FarmType | 'all';
  cidade: string;
};
