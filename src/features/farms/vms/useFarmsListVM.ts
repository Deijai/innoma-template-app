import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Alert } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuthStore } from '../../../stores/useAuthStore';
import { useFarmFiltersStore } from '../../../stores/useFarmFiltersStore';
import { deleteFarm, listFarmsPage } from '../data/farmsRepository';
import type { Farm, FarmProductionType, FarmStatus } from '../types';

const PAGE_SIZE = 12;

type Cursor = QueryDocumentSnapshot<DocumentData> | null;

const statusLabel: Record<FarmStatus, string> = {
  active: 'Ativa',
  inactive: 'Inativa',
};

const typeLabel: Record<FarmProductionType, string> = {
  alevinagem: 'Alevinagem',
  engorda: 'Engorda',
  outro: 'Outro',
  pesquePague: 'Pesque-pague',
  policultivo: 'Policultivo',
  reproducao: 'Reprodução',
};

export function useFarmsListVM() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const filters = useFarmFiltersStore((state) => state.filters);
  const [search, setSearch] = useState('');
  const [farms, setFarms] = useState<Farm[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cursorRef = useRef<Cursor>(null);
  const hasMoreRef = useRef(true);
  const isFetchingMoreRef = useRef(false);

  const loadPage = useCallback(
    async (mode: 'initial' | 'refresh' | 'more') => {
      if (mode === 'more' && (!hasMoreRef.current || isFetchingMoreRef.current)) return;

      if (mode === 'initial') setIsLoading(true);
      if (mode === 'refresh') setIsRefreshing(true);
      if (mode === 'more') {
        isFetchingMoreRef.current = true;
        setIsFetchingMore(true);
      }

      try {
        const page = await listFarmsPage({
          pageSize: PAGE_SIZE,
          cursor: mode === 'more' ? cursorRef.current : null,
          search,
          filters,
        });

        setError(null);
        hasMoreRef.current = page.hasMore;
        setHasMore(page.hasMore);
        cursorRef.current = page.cursor;
        setFarms((prev) => (mode === 'more' ? [...prev, ...page.items] : page.items));
      } catch {
        setError('Não foi possível carregar as fazendas.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        isFetchingMoreRef.current = false;
        setIsFetchingMore(false);
      }
    },
    [filters, search]
  );

  useEffect(() => {
    cursorRef.current = null;
    hasMoreRef.current = true;
    void loadPage('initial');
  }, [loadPage]);

  const onRefresh = useCallback(() => {
    cursorRef.current = null;
    hasMoreRef.current = true;
    void loadPage('refresh');
  }, [loadPage]);

  const onEndReached = useCallback(() => {
    void loadPage('more');
  }, [loadPage]);

  const canManage = useCallback(
    (farm: Farm) => {
      if (!user?.uid) return false;
      return isAdmin || farm.createdByUserId === user.uid;
    },
    [isAdmin, user?.uid]
  );

  const remove = useCallback(
    (farm: Farm) => {
      Alert.alert('Excluir fazenda', `Deseja realmente excluir "${farm.nome}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFarm(farm.id);
              cursorRef.current = null;
              hasMoreRef.current = true;
              void loadPage('initial');
            } catch {
              setError('Não foi possível excluir a fazenda.');
            }
          },
        },
      ]);
    },
    [loadPage]
  );

  const activeFiltersCount = useMemo(
    () => Number(filters.status !== 'all') + Number(filters.tipo !== 'all') + Number(!!filters.cidade.trim()),
    [filters.cidade, filters.status, filters.tipo]
  );

  return {
    search,
    setSearch,
    farms,
    hasMore,
    error,
    isLoading,
    isRefreshing,
    isFetchingMore,
    onRefresh,
    onEndReached,
    retry: () => {
      cursorRef.current = null;
      hasMoreRef.current = true;
      void loadPage('initial');
    },
    totalFiltered: farms.length,
    activeFiltersCount,
    statusLabel,
    typeLabel,
    canManage,
    remove,
  };
}
