import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { AppText } from './AppText';

export type BarPoint = {
  label: string;
  value: number;
};

type Props = {
  data: BarPoint[];
  highlightIndex?: number;
  height?: number;
  yMax?: number;
};

export function BarChart({ data, highlightIndex = -1, height = 170, yMax }: Props) {
  const t = useTheme();
  const max = yMax ?? Math.max(...data.map((d) => d.value), 1);

  // Ticks: 0, 1k, 2k, 3k, 4k (igual à referência)
  const ticks = [0, 1000, 2000, 3000, 4000];

  return (
    <View style={{ flexDirection: 'row' }}>
      {/* Y axis */}
      <View style={{ width: 32, justifyContent: 'space-between', paddingVertical: 6 }}>
        {ticks
          .slice()
          .reverse()
          .map((v) => (
            <AppText key={v} variant="caption" color="muted" style={{ fontSize: 12 }}>
              {v === 0 ? '0' : `${Math.round(v / 1000)}k`}
            </AppText>
          ))}
      </View>

      {/* Plot area */}
      <View style={{ flex: 1 }}>
        <View style={{ height, justifyContent: 'flex-end', paddingRight: 4 }}>
          {/* grid lines */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'space-between',
              paddingVertical: 8,
            }}
          >
            {ticks.slice().reverse().map((v) => (
              <View
                key={v}
                style={{
                  height: 1,
                  backgroundColor: t.colors.border,
                  opacity: 0.6,
                }}
              />
            ))}
          </View>

          {/* bars */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingLeft: 6 }}>
            {data.map((d, i) => {
              const h = Math.max(2, (d.value / max) * (height - 8));
              const isHi = i === highlightIndex;
              return (
                <View key={`${d.label}-${i}`} style={{ flex: 1, alignItems: 'center' }}>
                  <View
                    style={{
                      width: '100%',
                      height: h,
                      borderRadius: 10,
                      backgroundColor: isHi ? t.colors.accent : t.colors.cardSubtle,
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* x labels */}
        <View style={{ flexDirection: 'row', gap: 10, paddingLeft: 6, paddingTop: 10 }}>
          {data.map((d, i) => (
            <View key={`x-${d.label}-${i}`} style={{ flex: 1, alignItems: 'center' }}>
              <AppText variant="caption" color="muted" style={{ fontSize: 12 }}>
                {d.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
