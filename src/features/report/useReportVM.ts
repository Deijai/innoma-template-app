import { useMemo, useState } from 'react';

export type ReportRange = 'day' | 'week' | 'month' | 'year';

export function useReportVM() {
  const [range, setRange] = useState<ReportRange>('month');

  // Mock data para este template (depois você liga no Firestore)
  const steps = 4000;
  const dateLabel = '02 Jan 2024';
  const chart = useMemo(
    () => [
      { label: 'Mon', value: 4000 },
      { label: 'Tues', value: 2200 },
      { label: 'Wed', value: 3500 },
      { label: 'Thurs', value: 4500 },
      { label: 'Fri', value: 2500 },
      { label: 'Sat', value: 3400 },
      { label: 'Sun', value: 2100 }
    ],
    []
  );

  const highlightIndex = 3; // Thurs

  const streak = useMemo(
    () => [
      { label: 'Mon', done: true },
      { label: 'Tues', done: true },
      { label: 'Wed', done: true },
      { label: 'Thurs', done: true },
      { label: 'Fri', done: false },
      { label: 'Sat', done: false },
      { label: 'Sun', done: false }
    ],
    []
  );

  const timeOfDay = useMemo(
    () => ({
      value: 4000,
      status: 'Healthy',
      points: [15, 16, 17.5, 20, 30, 35, 39, 40, 45],
      selectedIndex: 2
    }),
    []
  );

  const timeBuckets = useMemo(
    () => [
      { label: '00:00', value: 100 },
      { label: '04:00', value: 150 },
      { label: '08:00', value: 800 },
      { label: '12:00', value: 1200 },
      { label: '16:00', value: 950 },
      { label: '20:00', value: 800 }
    ],
    []
  );

  return {
    steps,
    dateLabel,
    range,
    setRange,
    chart,
    highlightIndex,
    streak,
    timeOfDay,
    timeBuckets,
    timeSelectedIndex: timeOfDay.selectedIndex
  };
}