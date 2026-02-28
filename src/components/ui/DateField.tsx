import React, { useMemo, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/useTheme';
import { AppText } from './AppText';

type Props = {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  helperText?: string;
  errorText?: string;
};

function formatBR(d?: Date) {
  if (!d) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function DateField({ label, value, onChange, helperText, errorText }: Props) {
  const t = useTheme();
  const [open, setOpen] = useState(false);

  const texto = useMemo(() => (value ? formatBR(value) : 'Selecionar data...'), [value]);

  function onPicked(e: DateTimePickerEvent, d?: Date) {
    if (Platform.OS === 'android') setOpen(false);
    if (e.type === 'set' && d) onChange(d);
  }

  return (
    <View style={{ gap: 8 }}>
      {!!label && <AppText variant="subtitle">{label}</AppText>}

      <Pressable onPress={() => setOpen(true)} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
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
          <Ionicons name="calendar-outline" size={18} color={t.colors.textMuted} />
          <AppText variant="body" style={{ flex: 1, color: value ? t.colors.text : t.colors.textMuted }}>
            {texto}
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

      {open ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.select({ ios: 'spinner', android: 'calendar' })}
          onChange={onPicked}
        />
      ) : null}
    </View>
  );
}
