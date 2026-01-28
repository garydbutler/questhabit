import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

interface XPPopupProps {
  xp: number;
  onComplete?: () => void;
}

export function XPPopup({ xp, onComplete }: XPPopupProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withTiming(1, { duration: 100 })
    );
    
    translateY.value = withSequence(
      withTiming(-30, { duration: 300 }),
      withDelay(700, withTiming(-60, { duration: 300 }))
    );
    
    opacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withDelay(700, withTiming(0, { duration: 300 }, () => {
        if (onComplete) {
          runOnJS(onComplete)();
        }
      }))
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>+{xp} XP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 100,
  },
  text: {
    color: '#0F0F0F',
    fontSize: 14,
    fontWeight: '700',
  },
});
