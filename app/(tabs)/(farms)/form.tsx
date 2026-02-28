import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Screen } from '../../../src/components/layout/Screen';
import { AppText } from '../../../src/components/ui/AppText';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { IconButton } from '../../../src/components/ui/IconButton';
import { SelectField } from '../../../src/components/ui/SelectField';
import { MultilineField, NumberField, TextField } from '../../../src/components/ui/TextField';
import { farmStatusOptions, farmTypeOptions } from '../../../src/features/farms/farmOptions';
import { useFarmFormVM } from '../../../src/features/farms/vms/useFarmFormVM';
import { useTheme } from '../../../src/theme/useTheme';

export default function FarmFormScreen() {
  const t = useTheme();
  const vm = useFarmFormVM();

  if (vm.isLoading) {
    return (
      <Screen style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="small" color={t.colors.accent} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <IconButton icon="close" onPress={vm.goBack} />
        <View>
          <AppText variant="title">{vm.title}</AppText>
          <AppText variant="caption" color="muted">
            {vm.isEdit ? 'Atualize os dados e salve as alterações.' : 'Preencha os dados para cadastrar uma nova fazenda.'}
          </AppText>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40, gap: 14 }} showsVerticalScrollIndicator={false}>
        <Card style={{ gap: 12 }}>
          <AppText variant="subtitle">Identificação</AppText>
          <TextField label="Nome" value={vm.form.nome} onChangeText={(v) => vm.setField('nome', v)} errorText={vm.errors.nome} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TextField label="Cidade" value={vm.form.cidade} onChangeText={(v) => vm.setField('cidade', v)} errorText={vm.errors.cidade} />
            </View>
            <View style={{ width: 88 }}>
              <TextField
                label="UF"
                value={vm.form.estado}
                onChangeText={(v) => vm.setField('estado', v)}
                errorText={vm.errors.estado}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>
          <TextField
            label="Responsável"
            value={vm.form.responsavel}
            onChangeText={(v) => vm.setField('responsavel', v)}
            errorText={vm.errors.responsavel}
          />
          <TextField
            label="Telefone"
            value={vm.form.telefone}
            onChangeText={(v) => vm.setField('telefone', v)}
            errorText={vm.errors.telefone}
            keyboardType="phone-pad"
          />
          <SelectField label="Status" valor={vm.form.status} onChange={(v) => vm.setField('status', v)} opcoes={farmStatusOptions} />
        </Card>

        <Card style={{ gap: 12 }}>
          <AppText variant="subtitle">Localização e produção</AppText>
          <TextField
            label="Endereço completo"
            value={vm.form.enderecoCompleto}
            onChangeText={(v) => vm.setField('enderecoCompleto', v)}
            errorText={vm.errors.enderecoCompleto}
          />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <NumberField
                label="Latitude"
                value={vm.latitudeLabel}
                onChangeText={(v) => vm.setField('latitude', Number(v.replace(',', '.')))}
                errorText={vm.errors.latitude}
              />
            </View>
            <View style={{ flex: 1 }}>
              <NumberField
                label="Longitude"
                value={vm.longitudeLabel}
                onChangeText={(v) => vm.setField('longitude', Number(v.replace(',', '.')))}
                errorText={vm.errors.longitude}
              />
            </View>
          </View>

          <NumberField
            label="Área total (ha)"
            value={vm.areaLabel}
            onChangeText={(v) => vm.setField('areaTotalHa', Number(v.replace(',', '.')))}
            errorText={vm.errors.areaTotalHa}
          />

          <SelectField label="Tipo de produção" valor={vm.form.tipoProducao} onChange={(v) => vm.setField('tipoProducao', v)} opcoes={farmTypeOptions} />
        </Card>

        <Card style={{ gap: 12 }}>
          <AppText variant="subtitle">Detalhes adicionais</AppText>
          <MultilineField
            label="Observações"
            value={vm.form.observacoes}
            onChangeText={(v) => vm.setField('observacoes', v)}
            errorText={vm.errors.observacoes}
          />

          <TextField
            label="Anexos/Fotos (URLs separadas por vírgula)"
            value={vm.form.anexos.join(', ')}
            onChangeText={(v) => vm.setField('anexos', v.split(',').map((item) => item.trim()).filter(Boolean))}
          />
        </Card>

        {!!vm.error && (
          <Card style={{ borderWidth: 1, borderColor: '#EF4444' }}>
            <AppText variant="caption" style={{ color: '#EF4444' }}>
              {vm.error}
            </AppText>
          </Card>
        )}

        <Card style={{ gap: 10 }}>
          <Button
            title={vm.isSaving ? 'Salvando...' : vm.isEdit ? 'Salvar alterações' : 'Criar fazenda'}
            onPress={vm.submit}
            disabled={vm.isSaving || vm.isDeleting}
            style={{ alignSelf: 'stretch', justifyContent: 'center', paddingVertical: 13 }}
          />

          {vm.isEdit ? (
            <Button
              title={vm.isDeleting ? 'Excluindo...' : 'Excluir fazenda'}
              onPress={vm.remove}
              disabled={vm.isSaving || vm.isDeleting}
              variant="ghost"
              style={{
                alignSelf: 'stretch',
                justifyContent: 'center',
                paddingVertical: 13,
                borderColor: '#EF4444',
                backgroundColor: '#FFF1F2',
              }}
            />
          ) : null}
        </Card>
      </ScrollView>
    </Screen>
  );
}
