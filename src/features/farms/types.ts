export type FarmStatus = 'active' | 'inactive';

export type FarmProductionType =
  | 'engorda'
  | 'alevinagem'
  | 'reproducao'
  | 'policultivo'
  | 'pesquePague'
  | 'outro';

export type Farm = {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  responsavel: string;
  telefone: string;
  status: FarmStatus;
  enderecoCompleto: string;
  latitude: number;
  longitude: number;
  areaTotalHa: number;
  tipoProducao: FarmProductionType;
  observacoes: string;
  anexos: string[];
  createdByUserId: string;
  createdAt: number;
  updatedAt: number;
};

export type FarmInput = Omit<Farm, 'id' | 'createdByUserId' | 'createdAt' | 'updatedAt'>;

export type FarmFilters = {
  status: FarmStatus | 'all';
  tipo: FarmProductionType | 'all';
  cidade: string;
};

export type FarmsPage<TCursor = unknown> = {
  items: Farm[];
  hasMore: boolean;
  cursor: TCursor | null;
};
