import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../../../shared/firestore/firestore';
import type { Farm, FarmFilters, FarmInput, FarmsPage } from '../types';

const FARMS_COLLECTION = 'farms';
const farmsRef = collection(db, FARMS_COLLECTION);

type FarmsCursor = number;

type FirestoreFarm = {
  nome: string;
  cidade: string;
  estado: string;
  responsavel: string;
  telefone: string;
  status: Farm['status'];
  enderecoCompleto: string;
  latitude: number;
  longitude: number;
  areaTotalHa: number;
  tipoProducao: Farm['tipoProducao'];
  observacoes: string;
  anexos: string[];
  createdByUserId: string;
  createdAt: { toMillis: () => number } | null;
  updatedAt: { toMillis: () => number } | null;
};

function mapFarm(id: string, data: FirestoreFarm): Farm {
  return {
    id,
    nome: data.nome,
    cidade: data.cidade,
    estado: data.estado,
    responsavel: data.responsavel,
    telefone: data.telefone,
    status: data.status,
    enderecoCompleto: data.enderecoCompleto,
    latitude: Number(data.latitude ?? 0),
    longitude: Number(data.longitude ?? 0),
    areaTotalHa: Number(data.areaTotalHa ?? 0),
    tipoProducao: data.tipoProducao,
    observacoes: data.observacoes ?? '',
    anexos: data.anexos ?? [],
    createdByUserId: data.createdByUserId,
    createdAt: data.createdAt?.toMillis?.() ?? 0,
    updatedAt: data.updatedAt?.toMillis?.() ?? 0,
  };
}

export async function listFarmsPage(params: {
  pageSize: number;
  cursor: FarmsCursor | null;
  search: string;
  filters: FarmFilters;
  userId: string;
}): Promise<FarmsPage<FarmsCursor>> {
  const snap = await getDocs(query(farmsRef, where('createdByUserId', '==', params.userId)));
  let items = snap.docs.map((farm) => mapFarm(farm.id, farm.data() as FirestoreFarm));

  const normalizedSearch = params.search.trim().toLowerCase();
  const normalizedCity = params.filters.cidade.trim().toLowerCase();

  items = items
    .filter((farm) => {
      const matchStatus = params.filters.status === 'all' || farm.status === params.filters.status;
      const matchType = params.filters.tipo === 'all' || farm.tipoProducao === params.filters.tipo;
      const matchSearch =
        !normalizedSearch || farm.nome.toLowerCase().includes(normalizedSearch) || farm.cidade.toLowerCase().includes(normalizedSearch);
      const matchCity = !normalizedCity || farm.cidade.toLowerCase().includes(normalizedCity);

      return matchStatus && matchType && matchSearch && matchCity;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const start = params.cursor ?? 0;
  const pageItems = items.slice(start, start + params.pageSize);
  const nextCursor = start + pageItems.length;
  const hasMore = nextCursor < items.length;

  return {
    items: pageItems,
    hasMore,
    cursor: hasMore ? nextCursor : null,
  };
}

export async function createFarm(data: FarmInput, createdByUserId: string) {
  await addDoc(farmsRef, {
    ...data,
    createdByUserId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateFarm(id: string, data: FarmInput, userId: string) {
  const farmRef = doc(db, FARMS_COLLECTION, id);
  const snapshot = await getDoc(farmRef);
  if (!snapshot.exists()) throw new Error('Farm not found');

  const farm = mapFarm(snapshot.id, snapshot.data() as FirestoreFarm);
  if (farm.createdByUserId !== userId) throw new Error('Forbidden');

  await updateDoc(farmRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFarm(id: string, userId: string) {
  const farmRef = doc(db, FARMS_COLLECTION, id);
  const snapshot = await getDoc(farmRef);
  if (!snapshot.exists()) throw new Error('Farm not found');

  const farm = mapFarm(snapshot.id, snapshot.data() as FirestoreFarm);
  if (farm.createdByUserId !== userId) throw new Error('Forbidden');

  await deleteDoc(farmRef);
}

export async function getFarmById(id: string, userId: string) {
  const snapshot = await getDoc(doc(db, FARMS_COLLECTION, id));
  if (!snapshot.exists()) return null;

  const farm = mapFarm(snapshot.id, snapshot.data() as FirestoreFarm);
  if (farm.createdByUserId !== userId) return null;

  return farm;
}
