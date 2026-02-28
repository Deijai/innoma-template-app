import React from 'react';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../theme/useTheme';

type Props = TouchableOpacityProps & {
    padding?: number;
    onPress?: () => void
};

export function CardAction({ style, padding = 16, onPress, ...rest }: Props) {
    const t = useTheme();
    return (
        <TouchableOpacity
            {...rest}
            onPress={onPress}
            style={[
                {
                    backgroundColor: t.colors.card,
                    borderRadius: t.radii.xl,
                    padding,
                    shadowColor: t.colors.shadow,
                    shadowOpacity: t.mode === 'light' ? 0.10 : 0.25,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 4,
                    marginHorizontal: 5,
                },
                style,
            ]}
        />
    );
}
