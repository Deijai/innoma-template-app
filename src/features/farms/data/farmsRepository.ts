import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';

import { db } from '../../../shared/firestore/firestore';
import type { Farm, FarmFilters, FarmInput, FarmsPage } from '../types';

const FARMS_COLLECTION = 'farms';
const farmsRef = collection(db, FARMS_COLLECTION);

type FarmsCursor = QueryDocumentSnapshot<DocumentData>;

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
}): Promise<FarmsPage<FarmsCursor>> {
  const constraints: any[] = [orderBy('createdAt', 'desc'), limit(params.pageSize)];

  if (params.filters.status !== 'all') constraints.push(where('status', '==', params.filters.status));
  if (params.filters.tipo !== 'all') constraints.push(where('tipoProducao', '==', params.filters.tipo));
  if (params.cursor) constraints.push(startAfter(params.cursor));

  const snap = await getDocs(query(farmsRef, ...constraints));
  let items = snap.docs.map((farm) => mapFarm(farm.id, farm.data() as FirestoreFarm));

  const normalizedSearch = params.search.trim().toLowerCase();
  const normalizedCity = params.filters.cidade.trim().toLowerCase();

  if (normalizedSearch || normalizedCity) {
    items = items.filter((farm) => {
      const matchSearch =
        !normalizedSearch ||
        farm.nome.toLowerCase().includes(normalizedSearch) ||
        farm.cidade.toLowerCase().includes(normalizedSearch);
      const matchCity = !normalizedCity || farm.cidade.toLowerCase().includes(normalizedCity);
      return matchSearch && matchCity;
    });
  }

  return {
    items,
    hasMore: snap.docs.length === params.pageSize,
    cursor: snap.docs[snap.docs.length - 1] ?? null,
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

export async function updateFarm(id: string, data: FarmInput) {
  await updateDoc(doc(db, FARMS_COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFarm(id: string) {
  await deleteDoc(doc(db, FARMS_COLLECTION, id));
}

export async function getFarmById(id: string) {
  const snapshot = await getDoc(doc(db, FARMS_COLLECTION, id));
  if (!snapshot.exists()) return null;
  return mapFarm(snapshot.id, snapshot.data() as FirestoreFarm);
}
