import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../constants/design';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  containerStyle,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          props.multiline && styles.multiline,
        ]}
        placeholderTextColor={Colors.text.muted}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.captionMedium,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.bg.input,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    color: Colors.text.primary,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.semantic.error,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  error: {
    color: Colors.semantic.error,
    fontSize: 12,
    marginTop: Spacing.xxs,
  },
});
