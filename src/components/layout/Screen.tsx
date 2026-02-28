import React from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
};

export function Screen({ children, style, scroll = false, contentContainerStyle }: Props) {
  const t = useTheme();

  if (scroll) {
    return (
      <SafeAreaView style={[{ flex: 1, backgroundColor: t.colors.bg }, style]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[{ padding: 16, paddingBottom: 24 }, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: t.colors.bg }, style]}>
      <View style={[{ flex: 1, padding: 16 }, contentContainerStyle]}>{children}</View>
    </SafeAreaView>
  );
}
