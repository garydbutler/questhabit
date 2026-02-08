import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../stores/authStore';
import { Colors } from '../constants/design';

/**
 * Deep link handler for successful Stripe checkout
 * Route: questhabit://subscription-success
 */
export default function SubscriptionSuccessScreen() {
  const router = useRouter();
  const { initialize } = useAuthStore();

  useEffect(() => {
    handleSubscriptionSuccess();
  }, []);

  const handleSubscriptionSuccess = async () => {
    // Refresh subscription status from database
    await initialize();

    const user = useAuthStore.getState().user;

    if (user?.isPro) {
      Alert.alert(
        'Welcome to Pro!',
        'Your QuestHabit Pro subscription is now active. Enjoy unlimited habits, AI coaching, and more!',
        [{ text: 'Awesome!', onPress: () => router.replace('/(tabs)') }]
      );
    } else {
      // Webhook might not have processed yet
      Alert.alert(
        'Processing...',
        'Your subscription is being processed. It may take a moment to activate.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );

      // Retry after delay
      setTimeout(async () => {
        await initialize();
        if (useAuthStore.getState().user?.isPro) {
          Alert.alert('Pro Activated!', 'Your subscription is now active.');
        }
      }, 5000);
    }
  };

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
