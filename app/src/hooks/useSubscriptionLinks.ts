import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook to handle subscription-related deep links and app state changes
 * - Refreshes subscription status when app returns from background (after Stripe checkout)
 * - Handles questhabit://subscription-success and questhabit://subscription-cancel deep links
 */
export function useSubscriptionLinks() {
  const router = useRouter();
  const { user, initialize } = useAuthStore();

  // Handle deep link URLs
  const handleDeepLink = useCallback(async (url: string) => {
    console.log('Deep link received:', url);

    if (url.includes('subscription-success')) {
      // User completed checkout - refresh subscription status
      await initialize();
      
      // Check if they're now Pro
      const updatedUser = useAuthStore.getState().user;
      if (updatedUser?.isPro) {
        Alert.alert(
          'Welcome to Pro!',
          'Your QuestHabit Pro subscription is now active. Enjoy unlimited habits, AI coaching, and more!',
          [{ text: 'Awesome!', onPress: () => router.replace('/pro') }]
        );
      } else {
        // Subscription might still be processing
        Alert.alert(
          'Processing...',
          'Your subscription is being processed. It may take a moment to activate.',
          [{ text: 'OK' }]
        );
        // Try again in a few seconds
        setTimeout(async () => {
          await initialize();
          if (useAuthStore.getState().user?.isPro) {
            Alert.alert('Pro Activated!', 'Your subscription is now active.');
          }
        }, 5000);
      }
    } else if (url.includes('subscription-cancel')) {
      // User cancelled checkout - just show a message
      Alert.alert(
        'Checkout Cancelled',
        'No worries! You can upgrade to Pro anytime from your profile.',
        [{ text: 'OK' }]
      );
    }
  }, [initialize, router]);

  // Handle app state changes (coming back from background)
  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && user) {
      // App came to foreground - refresh subscription status
      // This catches cases where the deep link might not fire
      await initialize();
    }
  }, [user, initialize]);

  useEffect(() => {
    // Set up deep link handler
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // Check for initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Set up app state change handler
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, [handleDeepLink, handleAppStateChange]);
}
