import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { Screen } from '../../../src/components/layout/Screen';
import { AppText } from '../../../src/components/ui/AppText';
import { Card } from '../../../src/components/ui/Card';
import { IconButton } from '../../../src/components/ui/IconButton';
import { ListItem } from '../../../src/components/ui/ListItem';
import { TextField } from '../../../src/components/ui/TextField';
import { useFarmsListVM } from '../../../src/features/farms/vms/useFarmsListVM';
import { useTheme } from '../../../src/theme/useTheme';

export default function FarmsIndex() {
  const t = useTheme();
  const router = useRouter();
  const vm = useFarmsListVM();

  return (
    <Screen style={{ paddingTop: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon="chevron-back" onPress={() => router.back()} />
          <AppText variant="title">Fazendas</AppText>
        </View>

        <IconButton icon="options-outline" onPress={() => router.push('/(farms)/filters')} />
      </View>

      <TextField
        placeholder="Buscar por nome ou cidade"
        leftIcon="search"
        value={vm.search}
        onChangeText={vm.setSearch}
        helperText={
          vm.activeFiltersCount
            ? `${vm.activeFiltersCount} filtro(s) ativo(s) • ${vm.totalFiltered} resultado(s)`
            : `${vm.totalFiltered} resultado(s)`
        }
      />

      <FlatList
        data={vm.farms}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 12 }}
        contentContainerStyle={{ paddingBottom: 32, gap: 8 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={vm.refreshing} onRefresh={vm.onRefresh} tintColor={t.colors.accent} />}
        onEndReachedThreshold={0.35}
        onEndReached={vm.onEndReached}
        renderItem={({ item }) => (
          <Card padding={12}>
            <ListItem
              titulo={item.nome}
              descricao={`${item.cidade}/${item.estado} • ${vm.typeLabel[item.tipo]} • ${item.hectares} ha`}
              icone="leaf-outline"
              direita={
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: t.radii.pill,
                    backgroundColor: t.colors.accentSoft,
                  }}
                >
                  <AppText variant="caption" style={{ color: t.colors.accent }}>
                    {vm.statusLabel[item.status]}
                  </AppText>
                </View>
              }
            />
          </Card>
        )}
        ListEmptyComponent={
          <Card>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Ionicons name="search-outline" size={20} color={t.colors.textMuted} />
              <AppText variant="subtitle">Nenhuma fazenda encontrada</AppText>
              <AppText variant="caption" color="muted">
                Tente ajustar a busca ou alterar os filtros.
              </AppText>
            </View>
          </Card>
        }
        ListFooterComponent={
          vm.loadingMore ? (
            <View style={{ paddingVertical: 16, alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="small" color={t.colors.accent} />
              <AppText variant="caption" color="muted">
                Carregando mais fazendas...
              </AppText>
            </View>
          ) : null
        }
      />
    </Screen>
  );
}
