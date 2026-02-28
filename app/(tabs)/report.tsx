import React from 'react';
import { View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { AppText } from '../../src/components/ui/AppText';
import { BarChart } from '../../src/components/ui/BarChart';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { IconButton } from '../../src/components/ui/IconButton';
import { IconCircle } from '../../src/components/ui/IconCircle';
import { Segmented } from '../../src/components/ui/Segmented';
import { useReportVM } from '../../src/features/report/useReportVM';
import { useTheme } from '../../src/theme/useTheme';

export default function ReportScreen() {
  const t = useTheme();
  const vm = useReportVM();

  return (
    <Screen scroll contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Top bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
        <IconButton icon="chevron-back" accessibilityLabel="Back" />
        <AppText variant="subtitle" style={{ letterSpacing: 0.2 }}>Passos</AppText>
        <Button
          title="Adicionar"
          variant="ghost"
          leftIcon={
            <Ionicons name="add" size={16} color={t.colors.text} />
          }
          onPress={() => { }}
          style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 }}
        />
      </View>

      {/* Summary row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <IconCircle name="stopwatch-outline" />
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
            <AppText variant="title" style={{ fontSize: 28 }}>{vm.steps}</AppText>
            <AppText variant="caption" color="muted" style={{ marginBottom: 4 }}>Passos</AppText>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconCircle name="time-outline" size={16} />
          <AppText variant="body" color="muted">{vm.dateLabel}</AppText>
        </View>
      </View>

      {/* Range segmented */}
      <View style={{ marginTop: 18 }}>
        <Segmented
          options={[
            { key: 'day', label: 'Dia' },
            { key: 'week', label: 'Semana' },
            { key: 'month', label: 'Mês' },
            { key: 'year', label: 'Ano' },
          ]}
          value={vm.range}
          onChange={(value) => vm.setRange(value)}
        />
      </View>

      {/* Chart card */}
      <Card style={{ marginTop: 16 }}>
        <BarChart data={vm.chart} highlightIndex={vm.highlightIndex} height={160} />
      </Card>

      {/* Dia streak */}
      <Card style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <IconCircle name="calendar-outline" />
          <AppText variant="subtitle">Sequência</AppText>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
          {vm.streak.map((d, index) => (
            <View key={index} style={{ alignItems: 'center', gap: 10 }}>
              <AppText variant="caption" color="muted">{d.label}</AppText>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: d.done ? t.colors.accent : t.colors.cardSubtle,
                }}
              >
                {d.done ? <AppText variant="label" style={{ color: '#fff' }}>✓</AppText> : null}
              </View>
            </View>
          ))}
        </View>

        <AppText variant="body" color="muted" style={{ marginTop: 14 }}>
          Amazing streak! keep going everyday champ
        </AppText>
      </Card>

      {/* Time of day */}
      <Card style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <IconCircle name="time-outline" />
            <View>
              <AppText variant="caption" color="muted">Horário do dia</AppText>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 2 }}>
                <AppText variant="subtitle">{vm.steps}</AppText>
                <AppText variant="caption" color="muted" style={{ marginBottom: 2 }}>Passos</AppText>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.colors.accent }} />
            <AppText variant="caption" color="muted">Saudável</AppText>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, alignItems: 'flex-end' }}>
          {vm.timeBuckets.map((b, idx) => {
            const selected = idx === vm.timeSelectedIndex;
            return (
              <View key={b.label} style={{ alignItems: 'center', width: 32 }}>
                <View
                  style={{
                    width: 26,
                    height: 12,
                    borderRadius: 4,
                    backgroundColor: selected ? t.colors.accent : t.colors.cardSubtle,
                  }}
                />
                {selected ? (
                  <View
                    style={{
                      width: 0,
                      height: 0,
                      borderLeftWidth: 6,
                      borderRightWidth: 6,
                      borderTopWidth: 8,
                      borderLeftColor: 'transparent',
                      borderRightColor: 'transparent',
                      borderTopColor: t.colors.accent,
                      marginTop: -2,
                    }}
                  />
                ) : (
                  <View style={{ height: 8 }} />
                )}
                <AppText variant="caption" color="muted" style={{ marginTop: 6 }}>
                  {b.label}
                </AppText>
              </View>
            );
          })}
        </View>
      </Card>
    </Screen>
  );
}
