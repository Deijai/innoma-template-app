import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/useTheme';
import { AppText } from './AppText';

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  label?: string;
  placeholder?: string;
  valor?: T;
  opcoes: SelectOption<T>[];
  pesquisavel?: boolean;
  onChange: (value: T) => void;
  helperText?: string;
  errorText?: string;
};

export function SelectField<T extends string>({
  label,
  placeholder = 'Selecione...',
  valor,
  opcoes,
  pesquisavel = true,
  onChange,
  helperText,
  errorText,
}: Props<T>) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const selecionado = useMemo(() => opcoes.find((o) => o.value === valor), [opcoes, valor]);
  const lista = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!pesquisavel || !s) return opcoes;
    return opcoes.filter((o) => o.label.toLowerCase().includes(s));
  }, [opcoes, q, pesquisavel]);

  return (
    <View style={{ gap: 8 }}>
      {!!label && <AppText variant="subtitle">{label}</AppText>}

      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            borderRadius: t.radii.pill,
            backgroundColor: t.colors.cardSubtle,
            borderWidth: 1,
            borderColor: errorText ? '#EF4444' : t.colors.border,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          <Ionicons name="chevron-down" size={18} color={t.colors.textMuted} />
          <AppText variant="body" style={{ flex: 1, color: selecionado ? t.colors.text : t.colors.textMuted }}>
            {selecionado ? selecionado.label : placeholder}
          </AppText>
        </View>
      </Pressable>

      {!!errorText ? (
        <AppText variant="caption" style={{ color: '#EF4444' }}>
          {errorText}
        </AppText>
      ) : !!helperText ? (
        <AppText variant="caption" color="muted">
          {helperText}
        </AppText>
      ) : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            flex: 1,
            backgroundColor: t.mode === 'light' ? 'rgba(17,24,39,0.25)' : 'rgba(0,0,0,0.65)',
            padding: 16,
            justifyContent: 'flex-end',
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: t.colors.card,
              borderRadius: t.radii.xl,
              borderWidth: 1,
              borderColor: t.colors.border,
              padding: 14,
              maxHeight: '75%',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <AppText variant="subtitle">Selecione</AppText>
              <Pressable onPress={() => setOpen(false)} hitSlop={10}>
                <Ionicons name="close" size={18} color={t.colors.textMuted} />
              </Pressable>
            </View>

            {pesquisavel ? (
              <View
                style={{
                  marginTop: 12,
                  borderRadius: t.radii.pill,
                  backgroundColor: t.colors.cardSubtle,
                  borderWidth: 1,
                  borderColor: t.colors.border,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Ionicons name="search" size={16} color={t.colors.textMuted} />
                <TextInput
                  value={q}
                  onChangeText={setQ}
                  placeholder="Pesquisar..."
                  placeholderTextColor={t.colors.textMuted}
                  style={{ flex: 1, color: t.colors.text, fontSize: 14 }}
                />
              </View>
            ) : null}

            <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false}>
              {lista.map((o) => {
                const active = o.value === valor;
                return (
                  <Pressable
                    key={o.value}
                    onPress={() => {
                      onChange(o.value);
                      setOpen(false);
                      setQ('');
                    }}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <View
                      style={{
                        paddingVertical: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: 1,
                        borderBottomColor: t.colors.border,
                      }}
                    >
                      <AppText variant="body" style={{ fontWeight: active ? '600' : '400' }}>
                        {o.label}
                      </AppText>
                      {active ? <Ionicons name="checkmark" size={18} color={t.colors.accent} /> : null}
                    </View>
                  </Pressable>
                );
              })}
              <View style={{ height: 6 }} />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
