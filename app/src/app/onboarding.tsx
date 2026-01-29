import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated as RNAnimated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../stores/authStore';
import { GradientButton } from '../components/ui/GradientButton';
import { Colors, Typography, Spacing, Radius, Icons } from '../constants/design';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  symbol: string;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    symbol: '\u25B2',
    title: 'Turn Habits Into Quests',
    subtitle: 'Every habit is an adventure waiting to happen. Complete daily quests to earn XP and level up your real life.',
    color: Colors.accent.primary,
    bgColor: 'rgba(6, 182, 212, 0.08)',
  },
  {
    id: '2',
    symbol: '\u2B22',
    title: 'Build Unstoppable Streaks',
    subtitle: 'Watch your streaks grow day by day. The longer your streak, the more bonus XP you earn. Consistency is power.',
    color: Colors.streak.primary,
    bgColor: 'rgba(249, 115, 22, 0.08)',
  },
  {
    id: '3',
    symbol: '\u2605',
    title: 'Unlock Achievements',
    subtitle: 'From First Step to Monthly Master \u2014 unlock badges that celebrate your progress. Collect them all!',
    color: Colors.xp.primary,
    bgColor: 'rgba(245, 158, 11, 0.08)',
  },
  {
    id: '4',
    symbol: '\u2666',
    title: 'AI-Powered Coaching',
    subtitle: 'Get personalized tips, motivation, and insights from your AI coach. It learns your patterns and helps you improve.',
    color: Colors.semantic.success,
    bgColor: 'rgba(16, 185, 129, 0.08)',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new RNAnimated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/signup');
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.symbolContainer, { backgroundColor: item.bgColor }]}>
        <Text style={[styles.symbol, { color: item.color }]}>{item.symbol}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0B0F1A', '#111827']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>{isLastSlide ? '' : 'Skip'}</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      />

      {/* Bottom section */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((slide, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <RNAnimated.View
                key={slide.id}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: SLIDES[currentIndex].color,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Button */}
        <GradientButton
          title={isLastSlide ? "Let's Go" : 'Next'}
          onPress={handleNext}
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: Spacing.xl,
    zIndex: 10,
    padding: Spacing.xs,
  },
  skipText: {
    color: Colors.text.tertiary,
    ...Typography.bodyMedium,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
  symbolContainer: {
    width: 120,
    height: 120,
    borderRadius: Radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['3xl'],
  },
  symbol: {
    fontSize: 48,
    fontWeight: '700',
  },
  title: {
    ...Typography.h1,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 50,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
    gap: Spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
