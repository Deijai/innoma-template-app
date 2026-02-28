import React, { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '../../src/components/layout/Screen';
import { AppText } from '../../src/components/ui/AppText';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { TextField, PasswordField, NumberField, CurrencyField, MultilineField } from '../../src/components/ui/TextField';
import { SelectField, type SelectOption } from '../../src/components/ui/SelectField';
import { DateField } from '../../src/components/ui/DateField';
import { Skeleton } from '../../src/components/ui/Skeleton';
import { ListItem } from '../../src/components/ui/ListItem';
import { useToast } from '../../src/hooks/useToast';
import { useAppLoading } from '../../src/hooks/useAppLoading';

export default function ComponentsScreen() {
  const toast = useToast();
  const loading = useAppLoading();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [numero, setNumero] = useState('');
  const [obs, setObs] = useState('');

  const [tipo, setTipo] = useState<'A' | 'B' | 'C'>();
  const [data, setData] = useState<Date | undefined>(new Date());

  const opcoes = useMemo<SelectOption<'A' | 'B' | 'C'>[]>(
    () => [
      { label: 'Tipo A', value: 'A' },
      { label: 'Tipo B', value: 'B' },
      { label: 'Tipo C', value: 'C' },
    ],
    []
  );

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <AppText variant="title">Componentes (UI Kit)</AppText>
      <AppText variant="caption" color="muted">
        Tudo pronto para reutilizar no app de piscicultura: inputs, selects, datas, listas, toast, loading e skeleton.
      </AppText>

      <Card padding={16} style={{ gap: 14 }}>
        <AppText variant="subtitle">Inputs</AppText>

        <TextField
          label="E-mail"
          placeholder="voce@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail-outline"
        />

        <PasswordField
          label="Senha"
          placeholder="••••••••"
          value={senha}
          onChangeText={setSenha}
          leftIcon="lock-closed-outline"
        />

        <NumberField label="Número" value={numero} onChangeText={setNumero} />

        <CurrencyField label="Moeda (BRL)" />

        <MultilineField label="Observações" value={obs} onChangeText={setObs} />
      </Card>

      <Card padding={16} style={{ gap: 14 }}>
        <AppText variant="subtitle">Select + Data</AppText>

        <SelectField
          label="Tipo"
          valor={tipo}
          opcoes={opcoes}
          onChange={setTipo}
          placeholder="Selecione um tipo..."
          helperText="Exemplo de select com busca."
        />

        <DateField label="Data" value={data} onChange={setData} helperText="Usando DateTimePicker nativo." />
      </Card>

      <Card padding={16} style={{ gap: 12 }}>
        <AppText variant="subtitle">Toast + Loading (globais)</AppText>

        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          <Button title="Sucesso" onPress={() => toast.sucesso('Cadastro salvo com sucesso.')} />
          <Button title="Info" variant="ghost" onPress={() => toast.info('Esta é uma informação.')} />
          <Button title="Erro" variant="ghost" onPress={() => toast.erro('Ocorreu um erro inesperado.')} />
        </View>

        <Button
          title="Testar loading (2s)"
          onPress={() => {
            loading.mostrar('Carregando...');
            setTimeout(() => loading.esconder(), 2000);
          }}
          style={{ alignSelf: 'stretch', justifyContent: 'center', paddingVertical: 12 }}
        />
      </Card>

      <Card padding={16} style={{ gap: 12 }}>
        <AppText variant="subtitle">Skeleton</AppText>
        <Skeleton height={18} radius={10} />
        <Skeleton height={14} radius={10} width={'75%'} />
        <Skeleton height={120} radius={16} />
      </Card>

      <Card padding={16} style={{ gap: 8 }}>
        <AppText variant="subtitle">Listas</AppText>
        <ListItem titulo="Item de lista" descricao="Descrição do item" icone="list-outline" onPress={() => toast.info('Você clicou no item.')} />
        <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />
        <ListItem titulo="Sem ação" descricao="Apenas visual" icone="information-circle-outline" />
      </Card>
    </Screen>
  );
}
