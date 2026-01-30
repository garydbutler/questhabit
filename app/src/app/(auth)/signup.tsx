import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/ui/Input';
import { GradientButton } from '../../components/ui/GradientButton';
import { Colors, Typography, Spacing, Icons } from '../../constants/design';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    
    setLocalError('');
    const result = await signUp(email, password);
    if (result.success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#0B0F1A', '#111827']}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoSymbol}>{Icons.sparkle}</Text>
          </View>
          <Text style={styles.title}>Join QuestHabit</Text>
          <Text style={styles.subtitle}>Start your journey to better habits</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearError();
              setLocalError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError();
              setLocalError('');
            }}
            secureTextEntry
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearError();
              setLocalError('');
            }}
            secureTextEntry
            autoComplete="new-password"
          />

          {(error || localError) && (
            <Text style={styles.error}>{error || localError}</Text>
          )}

          <GradientButton
            title="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={!email || !password || !confirmPassword}
            fullWidth
            size="lg"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.accent.ghost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoSymbol: {
    fontSize: 32,
    color: Colors.accent.primary,
    fontWeight: '700',
  },
  title: {
    ...Typography.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.tertiary,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  error: {
    color: Colors.semantic.error,
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: Colors.text.tertiary,
    ...Typography.caption,
  },
  footerLink: {
    color: Colors.accent.primary,
    ...Typography.captionMedium,
  },
});
