import React from 'react';
import { View } from 'react-native';

import { Screen } from '../../../src/components/layout/Screen';
import { AppText } from '../../../src/components/ui/AppText';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { IconButton } from '../../../src/components/ui/IconButton';
import { SelectField } from '../../../src/components/ui/SelectField';
import { TextField } from '../../../src/components/ui/TextField';
import { useFarmFiltersVM } from '../../../src/features/farms/vms/useFarmFiltersVM';

export default function FarmFiltersScreen() {
  const vm = useFarmFiltersVM();

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon="close" onPress={vm.close} />
          <AppText variant="title">Filtros</AppText>
        </View>

        <Button title="Limpar" variant="ghost" onPress={vm.clear} />
      </View>

      <Card style={{ marginTop: 16, gap: 12 }}>
        <SelectField
          label="Status"
          valor={vm.draft.status}
          onChange={(value) => vm.update('status', value)}
          opcoes={[
            { label: 'Todos', value: 'all' },
            { label: 'Ativa', value: 'active' },
            { label: 'Inativa', value: 'inactive' },
            { label: 'Em manutenção', value: 'maintenance' },
          ]}
        />

        <SelectField
          label="Tipo de operação"
          valor={vm.draft.tipo}
          onChange={(value) => vm.update('tipo', value)}
          opcoes={[
            { label: 'Todos', value: 'all' },
            { label: 'Agricultura', value: 'agricultura' },
            { label: 'Pecuária', value: 'pecuaria' },
            { label: 'Piscicultura', value: 'piscicultura' },
          ]}
        />

        <TextField
          label="Cidade"
          placeholder="Ex: Cuiabá"
          leftIcon="location-outline"
          value={vm.draft.cidade}
          onChangeText={(value) => vm.update('cidade', value)}
        />
      </Card>

      <View style={{ marginTop: 16 }}>
        <Button
          title={vm.hasChanges ? 'Aplicar filtros' : 'Fechar'}
          onPress={vm.apply}
          style={{ alignSelf: 'stretch', justifyContent: 'center', paddingVertical: 13 }}
        />
      </View>
    </Screen>
  );
}
