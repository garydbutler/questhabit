import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, Shadows } from '../../constants/design';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'surface' | 'glass' | 'accent' | 'gold';
  noPadding?: boolean;
}

export function GradientCard({ children, style, variant = 'surface', noPadding }: GradientCardProps) {
  const gradientConfig = {
    surface: {
      colors: ['#111827', '#0F172A'] as [string, string],
      borderColor: Colors.border.primary,
    },
    glass: {
      colors: ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)'] as [string, string],
      borderColor: 'rgba(255,255,255,0.06)',
    },
    accent: {
      colors: ['rgba(6, 182, 212, 0.08)', 'rgba(6, 182, 212, 0.02)'] as [string, string],
      borderColor: 'rgba(6, 182, 212, 0.15)',
    },
    gold: {
      colors: ['rgba(245, 158, 11, 0.08)', 'rgba(245, 158, 11, 0.02)'] as [string, string],
      borderColor: Colors.pro.border,
    },
  };

  const config = gradientConfig[variant];

  return (
    <View style={[styles.wrapper, Shadows.sm, style]}>
      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          { borderColor: config.borderColor },
          noPadding ? undefined : styles.padding,
        ]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  padding: {
    padding: Spacing.md,
  },
});
