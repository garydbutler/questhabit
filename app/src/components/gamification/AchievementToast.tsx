import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { AchievementType } from '../../types';
import { ACHIEVEMENTS } from '../../constants';
import { Colors, Typography, Spacing, Radius, Shadows, Icons, AchievementIcons } from '../../constants/design';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastData {
  type: AchievementType;
}

function AchievementToastView({
  type,
  onDismiss,
}: {
  type: AchievementType;
  onDismiss: () => void;
}) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 15,
        stiffness: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onDismiss());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const info = ACHIEVEMENTS[type];
  const iconInfo = AchievementIcons[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + Spacing.sm,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.toast}>
        {/* Icon */}
        <View style={[styles.iconWrap, { backgroundColor: `${iconInfo.color}25` }]}>
          <Text style={[styles.icon, { color: iconInfo.color }]}>
            {iconInfo.symbol}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.label}>Achievement Unlocked!</Text>
          <Text style={styles.name} numberOfLines={1}>{info.name}</Text>
        </View>

        {/* XP Badge */}
        <View style={styles.xpBadge}>
          <Text style={styles.xpIcon}>{Icons.xp}</Text>
          <Text style={styles.xpText}>+{info.xpBonus}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export function useAchievementToast() {
  const [queue, setQueue] = useState<AchievementType[]>([]);
  const [current, setCurrent] = useState<AchievementType | null>(null);

  const showToast = useCallback((type: AchievementType) => {
    setQueue(prev => [...prev, type]);
  }, []);

  useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
    }
  }, [current, queue]);

  const handleDismiss = useCallback(() => {
    setCurrent(null);
  }, []);

  const ToastComponent = current ? (
    <AchievementToastView
      key={current}
      type={current}
      onDismiss={handleDismiss}
    />
  ) : null;

  return { showToast, ToastComponent };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.overlay,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    paddingRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.xp.glow,
    gap: Spacing.sm,
    ...Shadows.goldGlow,
    width: '100%',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  label: {
    ...Typography.label,
    color: Colors.xp.primary,
    fontSize: 9,
    marginBottom: 1,
  },
  name: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
    fontSize: 14,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.xp.muted,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
    gap: 3,
  },
  xpIcon: {
    fontSize: 11,
    color: Colors.xp.primary,
    fontWeight: '700',
  },
  xpText: {
    color: Colors.xp.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
