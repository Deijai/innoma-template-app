import type { FarmProductionType, FarmStatus } from './types';

export const farmStatusOptions: { label: string; value: FarmStatus }[] = [
  { label: 'Ativa', value: 'active' },
  { label: 'Inativa', value: 'inactive' },
];

export const farmTypeOptions: { label: string; value: FarmProductionType }[] = [
  { label: 'Engorda', value: 'engorda' },
  { label: 'Alevinagem', value: 'alevinagem' },
  { label: 'Reprodução', value: 'reproducao' },
  { label: 'Policultivo', value: 'policultivo' },
  { label: 'Pesque-pague', value: 'pesquePague' },
  { label: 'Outro', value: 'outro' },
];
