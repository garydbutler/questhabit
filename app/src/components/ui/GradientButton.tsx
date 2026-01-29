import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Radius, Spacing, Shadows } from '../../constants/design';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'accent' | 'gold' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  fullWidth?: boolean;
}

const GRADIENT_CONFIGS = {
  accent: { colors: ['#06B6D4', '#0891B2'] as [string, string], textColor: Colors.white },
  gold: { colors: ['#F59E0B', '#D97706'] as [string, string], textColor: Colors.text.inverse },
  success: { colors: ['#10B981', '#059669'] as [string, string], textColor: Colors.white },
  outline: { colors: ['transparent', 'transparent'] as [string, string], textColor: Colors.accent.primary },
};

const SIZE_CONFIGS = {
  sm: { paddingH: 16, paddingV: 10, fontSize: 14 },
  md: { paddingH: 24, paddingV: 14, fontSize: 16 },
  lg: { paddingH: 32, paddingV: 18, fontSize: 17 },
};

export function GradientButton({
  title,
  onPress,
  variant = 'accent',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth,
}: GradientButtonProps) {
  const config = GRADIENT_CONFIGS[variant];
  const sizeConfig = SIZE_CONFIGS[size];
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        fullWidth && { width: '100%' },
        !isOutline && Shadows.accentGlow,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            paddingHorizontal: sizeConfig.paddingH,
            paddingVertical: sizeConfig.paddingV,
          },
          isOutline && styles.outline,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={config.textColor} size="small" />
        ) : (
          <View style={styles.content}>
            {icon && <Text style={[styles.icon, { color: config.textColor }]}>{icon}</Text>}
            <Text
              style={[
                styles.text,
                { fontSize: sizeConfig.fontSize, color: config.textColor },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.accent.primary,
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
  },
});
