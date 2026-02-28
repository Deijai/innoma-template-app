import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Screen } from '../../../src/components/layout/Screen';
import { AppText } from '../../../src/components/ui/AppText';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { IconButton } from '../../../src/components/ui/IconButton';
import { useFarmDetailVM } from '../../../src/features/farms/vms/useFarmDetailVM';
import { useTheme } from '../../../src/theme/useTheme';

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  const t = useTheme();

  return (
    <View
      style={{
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: t.colors.border,
        gap: 2,
      }}
    >
      <AppText variant="caption" color="muted">
        {label}
      </AppText>
      <AppText variant="body">{String(value ?? '-')}</AppText>
    </View>
  );
}

export default function FarmDetailScreen() {
  const t = useTheme();
  const vm = useFarmDetailVM();

  if (vm.isLoading) {
    return (
      <Screen style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="small" color={t.colors.accent} />
      </Screen>
    );
  }

  if (!vm.farm) {
    return (
      <Screen>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon="chevron-back" onPress={vm.goBack} />
          <AppText variant="title">Fazenda</AppText>
        </View>
        <Card style={{ marginTop: 16, gap: 10 }}>
          <AppText variant="subtitle">{vm.error ?? 'Fazenda não encontrada.'}</AppText>
          <Button title="Voltar" onPress={vm.goBack} variant="ghost" />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon="chevron-back" onPress={vm.goBack} />
          <AppText variant="title">Detalhes da fazenda</AppText>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Card style={{ gap: 12 }}>
          <View style={{ gap: 4 }}>
            <AppText variant="title">{vm.farm.nome}</AppText>
            <AppText variant="body" color="muted">
              {vm.farm.cidade}/{vm.farm.estado}
            </AppText>
          </View>

          <View
            style={{
              alignSelf: 'flex-start',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: t.radii.pill,
              backgroundColor: vm.farm.status === 'active' ? t.colors.accentSoft : t.colors.card,
              borderWidth: 1,
              borderColor: t.colors.border,
            }}
          >
            <AppText variant="caption" style={{ color: vm.farm.status === 'active' ? t.colors.accent : t.colors.textMuted }}>
              {vm.farm.status === 'active' ? 'Ativa' : 'Inativa'}
            </AppText>
          </View>
        </Card>

        <Card>
          <AppText variant="subtitle" style={{ marginBottom: 6 }}>
            Informações gerais
          </AppText>
          <InfoRow label="Responsável" value={vm.farm.responsavel} />
          <InfoRow label="Telefone" value={vm.farm.telefone} />
          <InfoRow label="Endereço" value={vm.farm.enderecoCompleto} />
          <InfoRow label="Tipo de produção" value={vm.farm.tipoProducao} />
          <InfoRow label="Área total" value={`${vm.farm.areaTotalHa} ha`} />
          <InfoRow label="Coordenadas" value={`${vm.farm.latitude}, ${vm.farm.longitude}`} />
          <View style={{ paddingTop: 10, gap: 2 }}>
            <AppText variant="caption" color="muted">
              Observações
            </AppText>
            <AppText variant="body">{vm.farm.observacoes || 'Sem observações'}</AppText>
          </View>
        </Card>

        <Card>
          <AppText variant="subtitle" style={{ marginBottom: 6 }}>
            Anexos
          </AppText>
          <AppText variant="body">{vm.farm.anexos.length ? vm.farm.anexos.join('\n') : 'Sem anexos cadastrados.'}</AppText>
        </Card>

        {!!vm.error && (
          <Card style={{ borderWidth: 1, borderColor: '#EF4444' }}>
            <AppText variant="caption" style={{ color: '#EF4444' }}>
              {vm.error}
            </AppText>
          </Card>
        )}

        {vm.canManage ? (
          <Card style={{ gap: 10 }}>
            <AppText variant="subtitle">Ações</AppText>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button
                title="Editar"
                onPress={vm.goEdit}
                style={{ flex: 1, justifyContent: 'center', paddingVertical: 13 }}
              />
              <Button
                title={vm.isDeleting ? 'Excluindo...' : 'Excluir'}
                onPress={vm.remove}
                disabled={vm.isDeleting}
                variant="ghost"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  paddingVertical: 13,
                  borderColor: '#EF4444',
                  backgroundColor: '#FFF1F2',
                }}
              />
            </View>
          </Card>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
