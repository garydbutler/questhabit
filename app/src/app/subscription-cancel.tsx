import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/design';

/**
 * Deep link handler for cancelled Stripe checkout
 * Route: questhabit://subscription-cancel
 */
export default function SubscriptionCancelScreen() {
  const router = useRouter();

  useEffect(() => {
    Alert.alert(
      'Checkout Cancelled',
      'No worries! You can upgrade to Pro anytime from your profile.',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.accent.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
