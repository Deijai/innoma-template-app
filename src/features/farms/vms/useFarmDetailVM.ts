import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuthStore } from '../../../stores/useAuthStore';
import { deleteFarm, getFarmById } from '../data/farmsRepository';
import type { Farm } from '../types';

export function useFarmDetailVM() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const [farm, setFarm] = useState<Farm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const item = await getFarmById(id);
      setFarm(item);
      setError(item ? null : 'Fazenda não encontrada.');
    } catch {
      setError('Erro ao carregar a fazenda.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const canManage = useMemo(() => {
    if (!farm || !user?.uid) return false;
    const isAdmin = user.email?.includes('admin') ?? false;
    return isAdmin || farm.createdByUserId === user.uid;
  }, [farm, user?.email, user?.uid]);

  const remove = async () => {
    if (!id || !canManage) return;
    setIsDeleting(true);
    try {
      await deleteFarm(id);
      router.back();
    } catch {
      setError('Não foi possível excluir a fazenda.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    id,
    farm,
    isLoading,
    isDeleting,
    error,
    canManage,
    reload: load,
    remove,
    goBack: () => router.back(),
    goEdit: () => router.push({ pathname: '/(farms)/form', params: { id } }),
  };
}
