import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { Screen } from '../../../src/components/layout/Screen';
import { AppText } from '../../../src/components/ui/AppText';
import { Button } from '../../../src/components/ui/Button';
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

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon="add" onPress={() => router.push('/(farms)/form')} />
          <IconButton icon="options-outline" onPress={() => router.push('/(farms)/filters')} />
        </View>
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

      {vm.isLoading ? (
        <View style={{ marginTop: 22, alignItems: 'center', gap: 8 }}>
          <ActivityIndicator size="small" color={t.colors.accent} />
          <AppText variant="caption" color="muted">
            Carregando fazendas...
          </AppText>
        </View>
      ) : vm.error ? (
        <Card style={{ marginTop: 16, gap: 10 }}>
          <AppText variant="subtitle">{vm.error}</AppText>
          <Button title="Tentar novamente" onPress={vm.retry} />
        </Card>
      ) : (
        <FlatList
          data={vm.farms}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 12 }}
          contentContainerStyle={{ paddingBottom: 32, gap: 8 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={vm.isRefreshing} onRefresh={vm.onRefresh} tintColor={t.colors.accent} />}
          onEndReachedThreshold={0.35}
          onEndReached={vm.onEndReached}
          renderItem={({ item }) => (
            <Card padding={12} style={{ gap: 10 }}>
              <ListItem
                onPress={() => router.push({ pathname: '/(farms)/[id]', params: { id: item.id } })}
                titulo={item.nome}
                descricao={`${item.cidade}/${item.estado} • ${vm.typeLabel[item.tipoProducao]} • ${item.areaTotalHa} ha`}
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

              {vm.canManage(item) ? (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Button
                    title="Editar"
                    onPress={() => router.push({ pathname: '/(farms)/form', params: { id: item.id } })}
                    style={{ flex: 1, justifyContent: 'center' }}
                  />
                  <Button
                    title="Excluir"
                    onPress={() => vm.remove(item)}
                    variant="ghost"
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      borderColor: '#EF4444',
                      backgroundColor: '#FFF1F2',
                    }}
                  />
                </View>
              ) : null}
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
            vm.isFetchingMore ? (
              <View style={{ paddingVertical: 16, alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color={t.colors.accent} />
                <AppText variant="caption" color="muted">
                  Carregando mais fazendas...
                </AppText>
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  );
}
