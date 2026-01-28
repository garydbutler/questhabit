import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color = '#6366F1',
  backgroundColor = '#252525',
  height = 8,
  style,
}: ProgressBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${Math.min(Math.max(progress, 0), 1) * 100}%`, {
        damping: 15,
        stiffness: 100,
      }),
    };
  });

  return (
    <View style={[styles.container, { backgroundColor, height }, style]}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 100,
  },
});
