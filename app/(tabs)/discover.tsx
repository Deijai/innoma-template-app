import React from 'react';
import { Screen } from '../../src/components/layout/Screen';
import { AppText } from '../../src/components/ui/AppText';

export default function DiscoverScreen() {
  return (
    <Screen>
      <AppText variant="title">Descobrir</AppText>
      <AppText variant="body" style={{ marginTop: 8 }}>
        Placeholder. Substitua pelo seu conteúdo.
      </AppText>
    </Screen>
  );
}
