import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/design';

interface ProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
}

/**
 * Circular progress display — uses layered Views (no SVG dependency).
 * Shows percentage in center with a visual ring border effect.
 */
export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = Colors.accent.primary,
  bgColor = Colors.border.primary,
  label,
  sublabel,
  showPercentage = true,
}: ProgressRingProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);
  const ringColor = clampedProgress >= 1 ? Colors.semantic.success : color;
  const innerSize = size - strokeWidth * 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer ring — progress color with opacity proportional to progress */}
      <View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: clampedProgress > 0 ? ringColor : bgColor,
            opacity: clampedProgress > 0 ? 0.3 + clampedProgress * 0.7 : 1,
          },
        ]}
      />
      {/* Background track */}
      <View
        style={[
          styles.track,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: bgColor,
          },
        ]}
      />
      {/* Progress arc — simulated with partial borders */}
      {clampedProgress > 0 && (
        <View
          style={[
            styles.progressOverlay,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderTopColor: clampedProgress >= 0.25 ? ringColor : ringColor,
              borderRightColor: clampedProgress >= 0.5 ? ringColor : 'transparent',
              borderBottomColor: clampedProgress >= 0.75 ? ringColor : 'transparent',
              borderLeftColor: clampedProgress >= 1 ? ringColor : 'transparent',
              transform: [{ rotate: '-90deg' }],
            },
          ]}
        />
      )}
      {/* Inner fill */}
      <View
        style={[
          styles.inner,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: Colors.bg.primary,
          },
        ]}
      />
      {/* Labels */}
      <View style={styles.labelContainer}>
        {showPercentage && (
          <Text style={[styles.percentage, { color: ringColor }]}>
            {percentage}%
          </Text>
        )}
        {label && <Text style={styles.label}>{label}</Text>}
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
  },
  track: {
    position: 'absolute',
  },
  progressOverlay: {
    position: 'absolute',
  },
  inner: {
    position: 'absolute',
  },
  labelContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  percentage: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  label: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  sublabel: {
    ...Typography.label,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
});
