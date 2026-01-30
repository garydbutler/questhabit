import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Radius } from '../../constants/design';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color = Colors.accent.primary,
  backgroundColor = Colors.border.primary,
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
    <View style={[styles.container, { backgroundColor, height, borderRadius: height / 2 }, style]}>
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: color, borderRadius: height / 2 },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
