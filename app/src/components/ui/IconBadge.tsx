import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Radius } from '../../constants/design';

interface IconBadgeProps {
  symbol: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  rounded?: boolean;
}

const SIZES = {
  sm: { container: 28, font: 13, radius: 8 },
  md: { container: 36, font: 16, radius: 10 },
  lg: { container: 48, font: 22, radius: 14 },
};

export function IconBadge({ symbol, color, size = 'md', style, rounded }: IconBadgeProps) {
  const s = SIZES[size];
  
  return (
    <View
      style={[
        styles.container,
        {
          width: s.container,
          height: s.container,
          borderRadius: rounded ? s.container / 2 : s.radius,
          backgroundColor: `${color}18`, // 10% opacity of the color
        },
        style,
      ]}
    >
      <Text style={[styles.symbol, { fontSize: s.font, color }]}>
        {symbol}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontWeight: '700',
  },
});
