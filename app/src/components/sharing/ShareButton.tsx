/**
 * ShareButton — Reusable button that captures a ViewShot and shares
 */
import React, { useState, RefObject } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { captureAndShare } from '../../lib/sharing';
import { Colors, Typography, Spacing, Radius } from '../../constants/design';

interface ShareButtonProps {
  viewShotRef: RefObject<ViewShot | null>;
  label?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  onShareComplete?: (success: boolean) => void;
  style?: object;
}

export function ShareButton({
  viewShotRef,
  label = 'Share',
  variant = 'primary',
  size = 'md',
  message,
  onShareComplete,
  style,
}: ShareButtonProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const success = await captureAndShare(viewShotRef, { message });
      onShareComplete?.(success);
    } finally {
      setSharing(false);
    }
  };

  const sizeStyles = SIZE_MAP[size];
  const variantStyles = VARIANT_MAP[variant];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyles.container,
        variantStyles.container,
        sharing && styles.disabled,
        style,
      ]}
      onPress={handleShare}
      disabled={sharing}
      activeOpacity={0.7}
    >
      {sharing ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.textColor}
        />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.icon, { color: variantStyles.textColor }]}>
            {'\u2197'}
          </Text>
          <Text
            style={[
              styles.label,
              sizeStyles.text,
              { color: variantStyles.textColor },
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const SIZE_MAP = {
  sm: {
    container: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xxs, minHeight: 32 },
    text: { fontSize: 13 },
  },
  md: {
    container: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, minHeight: 40 },
    text: { fontSize: 15 },
  },
  lg: {
    container: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, minHeight: 48 },
    text: { fontSize: 16 },
  },
};

const VARIANT_MAP = {
  primary: {
    container: {
      backgroundColor: Colors.accent.primary,
    },
    textColor: Colors.text.inverse,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.accent.primary,
    },
    textColor: Colors.accent.primary,
  },
  ghost: {
    container: {
      backgroundColor: Colors.accent.ghost,
    },
    textColor: Colors.accent.primary,
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});
