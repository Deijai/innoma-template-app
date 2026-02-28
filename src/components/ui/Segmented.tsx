import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../../theme/useTheme';

export type SegmentedOption<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (next: T) => void;
};

export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  const t = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 6,
        borderRadius: 999,
        backgroundColor: t.colors.card,
        borderWidth: 1,
        borderColor: t.colors.border,
      }}
    >
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={({ pressed }) => [
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                paddingVertical: 10,
                backgroundColor: active ? t.colors.cardSubtle : 'transparent',
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <AppText variant="label" color={active ? 'text' : 'muted'}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
