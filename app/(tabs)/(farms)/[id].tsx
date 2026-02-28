import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Screen } from '../../../src/components/layout/Screen';
import { AppText } from '../../../src/components/ui/AppText';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { IconButton } from '../../../src/components/ui/IconButton';
import { useFarmDetailVM } from '../../../src/features/farms/vms/useFarmDetailVM';
import { useTheme } from '../../../src/theme/useTheme';

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <View style={{ gap: 2 }}>
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
        <Card style={{ marginTop: 16 }}>
          <AppText variant="subtitle">{vm.error ?? 'Fazenda não encontrada.'}</AppText>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon="chevron-back" onPress={vm.goBack} />
          <AppText variant="title">{vm.farm.nome}</AppText>
        </View>

        {vm.canManage ? <IconButton icon="create-outline" onPress={vm.goEdit} /> : null}
      </View>

      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 40 }}>
        <Card style={{ gap: 10 }}>
          <Row label="Cidade/UF" value={`${vm.farm.cidade}/${vm.farm.estado}`} />
          <Row label="Responsável" value={vm.farm.responsavel} />
          <Row label="Telefone" value={vm.farm.telefone} />
          <Row label="Status" value={vm.farm.status === 'active' ? 'Ativa' : 'Inativa'} />
          <Row label="Endereço" value={vm.farm.enderecoCompleto} />
          <Row label="Coordenadas" value={`${vm.farm.latitude}, ${vm.farm.longitude}`} />
          <Row label="Área total" value={`${vm.farm.areaTotalHa} ha`} />
          <Row label="Tipo de produção" value={vm.farm.tipoProducao} />
          <Row label="Observações" value={vm.farm.observacoes} />
          <Row label="Anexos" value={vm.farm.anexos.length ? vm.farm.anexos.join(', ') : 'Sem anexos'} />
        </Card>

        {!!vm.error && (
          <AppText variant="caption" style={{ color: '#EF4444' }}>
            {vm.error}
          </AppText>
        )}

        {vm.canManage ? (
          <Button
            title={vm.isDeleting ? 'Excluindo...' : 'Excluir fazenda'}
            onPress={vm.remove}
            disabled={vm.isDeleting}
            style={{ alignSelf: 'stretch', justifyContent: 'center', paddingVertical: 13, backgroundColor: '#ef4444' }}
          />
        ) : null}
      </ScrollView>
    </Screen>
  );
}
