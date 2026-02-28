import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
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
      if (!user?.uid) {
        setError('Usuário não autenticado.');
        setIsLoading(false);
        return;
      }

      const item = await getFarmById(id, user.uid);
      setFarm(item);
      setError(item ? null : 'Fazenda não encontrada.');
    } catch {
      setError('Erro ao carregar a fazenda.');
    } finally {
      setIsLoading(false);
    }
  }, [id, user?.uid]);

  useEffect(() => {
    void load();
  }, [load]);

  const canManage = useMemo(() => {
    if (!farm || !user?.uid) return false;
    return farm.createdByUserId === user.uid;
  }, [farm, user?.uid]);

  const remove = () => {
    if (!id || !canManage) return;

    Alert.alert('Excluir fazenda', 'Tem certeza que deseja excluir esta fazenda? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          setError(null);
          try {
            if (!user?.uid) return;
            await deleteFarm(id, user.uid);
            router.back();
          } catch {
            setError('Não foi possível excluir a fazenda.');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
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
