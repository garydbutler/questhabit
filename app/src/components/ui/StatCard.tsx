import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/design';

interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  style?: ViewStyle;
}

export function StatCard({ value, label, color = Colors.accent.primary, icon, trend, style }: StatCardProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Text style={[styles.icon, { color }]}>{icon}</Text>
        </View>
      )}
      <Text style={[styles.value, { color }]}>{value}</Text>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {trend && trend !== 'neutral' && (
          <Text style={[styles.trend, { color: trend === 'up' ? Colors.semantic.success : Colors.semantic.error }]}>
            {trend === 'up' ? '\u2191' : '\u2193'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxs,
  },
  icon: {
    fontSize: 15,
    fontWeight: '700',
  },
  value: {
    ...Typography.stat,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  trend: {
    fontSize: 12,
    fontWeight: '700',
  },
});
