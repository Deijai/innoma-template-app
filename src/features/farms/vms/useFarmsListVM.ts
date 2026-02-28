import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import { useFarmFiltersStore } from '../../../stores/useFarmFiltersStore';
import { listFarmsPage } from '../data/farmsRepository';
import type { Farm, FarmStatus, FarmProductionType } from '../types';

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
  const filters = useFarmFiltersStore((state) => state.filters);
  const [search, setSearch] = useState('');
  const [farms, setFarms] = useState<Farm[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (mode: 'initial' | 'refresh' | 'more') => {
      if (mode === 'more' && (!hasMore || isFetchingMore)) return;

      if (mode === 'initial') setIsLoading(true);
      if (mode === 'refresh') setIsRefreshing(true);
      if (mode === 'more') setIsFetchingMore(true);

      try {
        const page = await listFarmsPage({
          pageSize: PAGE_SIZE,
          cursor: mode === 'more' ? cursor : null,
          search,
          filters,
        });

        setError(null);
        setHasMore(page.hasMore);
        setCursor(page.cursor);
        setFarms((prev) => (mode === 'more' ? [...prev, ...page.items] : page.items));
      } catch {
        setError('Não foi possível carregar as fazendas.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsFetchingMore(false);
      }
    },
    [cursor, filters, hasMore, isFetchingMore, search]
  );

  useEffect(() => {
    void loadPage('initial');
  }, [loadPage]);

  const onRefresh = useCallback(() => {
    setCursor(null);
    setHasMore(true);
    void loadPage('refresh');
  }, [loadPage]);

  const onEndReached = useCallback(() => {
    void loadPage('more');
  }, [loadPage]);

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
    retry: () => loadPage('initial'),
    totalFiltered: farms.length,
    activeFiltersCount,
    statusLabel,
    typeLabel,
  };
}
