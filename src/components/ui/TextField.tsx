import React, { useMemo, useState } from 'react';
import { TextInput, View, type TextInputProps, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/useTheme';
import { AppText } from './AppText';

type BaseProps = TextInputProps & {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
};

export function TextField({
  label,
  helperText,
  errorText,
  leftIcon,
  style,
  ...rest
}: BaseProps) {
  const t = useTheme();

  return (
    <View style={{ gap: 8 }}>
      {!!label && (
        <AppText variant="subtitle" style={{ color: t.colors.text }}>
          {label}
        </AppText>
      )}

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
          paddingVertical: 10,
        }}
      >
        {!!leftIcon && <Ionicons name={leftIcon} size={18} color={t.colors.textMuted} />}
        <TextInput
          {...rest}
          placeholderTextColor={t.colors.textMuted}
          style={[
            {
              flex: 1,
              color: t.colors.text,
              fontSize: t.typography.body.fontSize,
            },
            style as any,
          ]}
        />
      </View>

      {!!errorText ? (
        <AppText variant="caption" style={{ color: '#EF4444' }}>
          {errorText}
        </AppText>
      ) : !!helperText ? (
        <AppText variant="caption" color="muted">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

type PasswordProps = Omit<BaseProps, 'secureTextEntry'>;

export function PasswordField(props: PasswordProps) {
  const [show, setShow] = useState(false);
  const t = useTheme();

  return (
    <View style={{ gap: 8 }}>
      {!!props.label && (
        <AppText variant="subtitle" style={{ color: t.colors.text }}>
          {props.label}
        </AppText>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          borderRadius: t.radii.pill,
          backgroundColor: t.colors.cardSubtle,
          borderWidth: 1,
          borderColor: props.errorText ? '#EF4444' : t.colors.border,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        {!!props.leftIcon && <Ionicons name={props.leftIcon} size={18} color={t.colors.textMuted} />}
        <TextInput
          {...props}
          secureTextEntry={!show}
          placeholderTextColor={t.colors.textMuted}
          style={[
            {
              flex: 1,
              color: t.colors.text,
              fontSize: t.typography.body.fontSize,
            },
            props.style as any,
          ]}
        />
        <Pressable onPress={() => setShow((v) => !v)} hitSlop={10}>
          <Ionicons name={show ? 'eye-off' : 'eye'} size={18} color={t.colors.textMuted} />
        </Pressable>
      </View>

      {!!props.errorText ? (
        <AppText variant="caption" style={{ color: '#EF4444' }}>
          {props.errorText}
        </AppText>
      ) : !!props.helperText ? (
        <AppText variant="caption" color="muted">
          {props.helperText}
        </AppText>
      ) : null}
    </View>
  );
}

type SimpleFieldProps = Omit<BaseProps, 'leftIcon'> & { label?: string };

export function NumberField(props: SimpleFieldProps) {
  return (
    <TextField
      {...props}
      keyboardType="numeric"
      leftIcon="calculator-outline"
      placeholder={props.placeholder ?? '0'}
    />
  );
}

export function MultilineField(props: SimpleFieldProps) {
  return (
    <TextField
      {...props}
      leftIcon="create-outline"
      multiline
      textAlignVertical="top"
      style={[{ minHeight: 90 }, props.style as any]}
      placeholder={props.placeholder ?? 'Digite aqui...'}
    />
  );
}

// Formatação simples de moeda (BRL) para template (sem dependências).
function formatBRL(raw: string) {
  const digits = raw.replace(/\D/g, '');
  const num = Number(digits) / 100;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function CurrencyField(props: SimpleFieldProps) {
  const [raw, setRaw] = useState('');
  const value = raw ? formatBRL(raw) : '';
  return (
    <TextField
      {...props}
      value={value}
      onChangeText={(txt) => setRaw(txt)}
      keyboardType="numeric"
      leftIcon="cash-outline"
      placeholder={props.placeholder ?? 'R$ 0,00'}
      helperText={props.helperText ?? 'Digite apenas números.'}
    />
  );
}
