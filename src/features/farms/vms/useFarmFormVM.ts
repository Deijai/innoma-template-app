import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import { useAuthStore } from '../../../stores/useAuthStore';
import { createFarm, deleteFarm, getFarmById, updateFarm } from '../data/farmsRepository';
import type { FarmInput } from '../types';

const initialForm: FarmInput = {
  nome: '',
  cidade: '',
  estado: '',
  responsavel: '',
  telefone: '',
  status: 'active',
  enderecoCompleto: '',
  latitude: 0,
  longitude: 0,
  areaTotalHa: 0,
  tipoProducao: 'engorda',
  observacoes: '',
  anexos: [],
};

export function useFarmFormVM() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const user = useAuthStore((s) => s.user);
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FarmInput>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FarmInput, string>>>({});
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setIsLoading(true);
      try {
        if (!user?.uid) {
          setError('Usuário não autenticado.');
          return;
        }

        const farm = await getFarmById(id, user.uid);
        if (!farm) {
          setError('Fazenda não encontrada.');
          return;
        }

        setForm({
          nome: farm.nome,
          cidade: farm.cidade,
          estado: farm.estado,
          responsavel: farm.responsavel,
          telefone: farm.telefone,
          status: farm.status,
          enderecoCompleto: farm.enderecoCompleto,
          latitude: farm.latitude,
          longitude: farm.longitude,
          areaTotalHa: farm.areaTotalHa,
          tipoProducao: farm.tipoProducao,
          observacoes: farm.observacoes,
          anexos: farm.anexos,
        });
      } catch {
        setError('Erro ao carregar dados da fazenda.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, user?.uid]);

  const setField = <K extends keyof FarmInput>(field: K, value: FarmInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FarmInput, string>> = {};
    const requiredText: (keyof FarmInput)[] = [
      'nome',
      'cidade',
      'estado',
      'responsavel',
      'telefone',
      'enderecoCompleto',
      'observacoes',
    ];

    requiredText.forEach((field) => {
      const value = String(form[field] ?? '').trim();
      if (!value) next[field] = 'Campo obrigatório';
    });

    if (!Number.isFinite(form.latitude)) next.latitude = 'Latitude inválida';
    if (!Number.isFinite(form.longitude)) next.longitude = 'Longitude inválida';
    if (!Number.isFinite(form.areaTotalHa) || form.areaTotalHa <= 0) next.areaTotalHa = 'Área deve ser maior que zero';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    if (!user?.uid) {
      setError('Usuário não autenticado.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (id) {
        await updateFarm(id, {
          ...form,
          nome: form.nome.trim(),
          cidade: form.cidade.trim(),
          estado: form.estado.trim().toUpperCase(),
          responsavel: form.responsavel.trim(),
          telefone: form.telefone.trim(),
          enderecoCompleto: form.enderecoCompleto.trim(),
          observacoes: form.observacoes.trim(),
        }, user.uid);
      } else {
        await createFarm(
          {
            ...form,
            nome: form.nome.trim(),
            cidade: form.cidade.trim(),
            estado: form.estado.trim().toUpperCase(),
            responsavel: form.responsavel.trim(),
            telefone: form.telefone.trim(),
            enderecoCompleto: form.enderecoCompleto.trim(),
            observacoes: form.observacoes.trim(),
          },
          user.uid
        );
      }

      router.back();
    } catch {
      setError('Não foi possível salvar a fazenda.');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = () => {
    if (!id) return;

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
    isEdit,
    title: isEdit ? 'Editar Fazenda' : 'Nova Fazenda',
    form,
    errors,
    setField,
    isLoading,
    isSaving,
    isDeleting,
    error,
    submit,
    remove,
    goBack: () => router.back(),
    latitudeLabel: useMemo(() => String(form.latitude ?? ''), [form.latitude]),
    longitudeLabel: useMemo(() => String(form.longitude ?? ''), [form.longitude]),
    areaLabel: useMemo(() => String(form.areaTotalHa ?? ''), [form.areaTotalHa]),
  };
}
