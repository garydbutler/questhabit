import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../constants/design';

interface ChipTagProps {
  label: string;
  color?: string;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md';
  icon?: string;
  style?: ViewStyle;
}

export function ChipTag({
  label,
  color = Colors.accent.primary,
  variant = 'ghost',
  size = 'sm',
  icon,
  style,
}: ChipTagProps) {
  const isSm = size === 'sm';

  const containerStyles = {
    filled: {
      backgroundColor: color,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: `${color}40`,
    },
    ghost: {
      backgroundColor: `${color}15`,
    },
  };

  const textColor = variant === 'filled' ? Colors.white : color;

  return (
    <View
      style={[
        styles.container,
        containerStyles[variant],
        isSm ? styles.sm : styles.md,
        style,
      ]}
    >
      {icon && <Text style={[styles.icon, { color: textColor, fontSize: isSm ? 10 : 12 }]}>{icon}</Text>}
      <Text style={[styles.label, { color: textColor, fontSize: isSm ? 11 : 13 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    gap: 4,
  },
  sm: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 3,
  },
  md: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
  },
  icon: {
    fontWeight: '700',
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
