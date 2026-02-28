import { useCallback, useMemo, useState } from 'react';

import { useFarmFiltersStore } from '../../../stores/useFarmFiltersStore';
import type { Farm, FarmStatus, FarmType } from '../types';

const PAGE_SIZE = 12;

const statusLabel: Record<FarmStatus, string> = {
  active: 'Ativa',
  inactive: 'Inativa',
  maintenance: 'Manutenção',
};

const typeLabel: Record<FarmType, string> = {
  agricultura: 'Agricultura',
  pecuaria: 'Pecuária',
  piscicultura: 'Piscicultura',
};

const farmsMock: Farm[] = Array.from({ length: 45 }).map((_, index) => {
  const tipos: FarmType[] = ['agricultura', 'pecuaria', 'piscicultura'];
  const statuses: FarmStatus[] = ['active', 'inactive', 'maintenance'];
  const cidades = ['Cuiabá', 'Sinop', 'Sorriso', 'Rondonópolis', 'Primavera do Leste'];
  const estado = 'MT';
  const tipo = tipos[index % tipos.length];
  const status = statuses[index % statuses.length];

  return {
    id: `farm-${index + 1}`,
    nome: `Fazenda ${index + 1}`,
    cidade: cidades[index % cidades.length],
    estado,
    tipo,
    status,
    hectares: 120 + index * 7,
  };
});

export function useFarmsListVM() {
  const filters = useFarmFiltersStore((state) => state.filters);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const cityQuery = filters.cidade.trim().toLowerCase();

    return farmsMock.filter((farm) => {
      const matchSearch =
        !normalizedSearch ||
        farm.nome.toLowerCase().includes(normalizedSearch) ||
        farm.cidade.toLowerCase().includes(normalizedSearch);

      const matchStatus = filters.status === 'all' || farm.status === filters.status;
      const matchType = filters.tipo === 'all' || farm.tipo === filters.tipo;
      const matchCity = !cityQuery || farm.cidade.toLowerCase().includes(cityQuery);

      return matchSearch && matchStatus && matchType && matchCity;
    });
  }, [filters.cidade, filters.status, filters.tipo, search]);

  const farms = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = farms.length < filtered.length;

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setVisibleCount(PAGE_SIZE);
      setRefreshing(false);
    }, 700);
  }, []);

  const onEndReached = useCallback(() => {
    if (!hasMore || loadingMore) {
      return;
    }

    setLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
      setLoadingMore(false);
    }, 500);
  }, [filtered.length, hasMore, loadingMore]);

  const activeFiltersCount = Number(filters.status !== 'all') + Number(filters.tipo !== 'all') + Number(!!filters.cidade.trim());

  return {
    search,
    setSearch,
    farms,
    hasMore,
    refreshing,
    loadingMore,
    onRefresh,
    onEndReached,
    totalFiltered: filtered.length,
    activeFiltersCount,
    statusLabel,
    typeLabel,
  };
}
