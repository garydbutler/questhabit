import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { GradientButton } from '../components/ui/GradientButton';
import { GradientCard } from '../components/ui/GradientCard';
import { IconBadge } from '../components/ui/IconBadge';
import { ChipTag } from '../components/ui/ChipTag';
import { Colors, Typography, Spacing, Radius, Shadows, Icons } from '../constants/design';

type PlanType = 'monthly' | 'yearly';

const FREE_FEATURES = [
  { text: '5 habits max', symbol: '\u25CB' },
  { text: 'Basic streak tracking', symbol: '\u25CB' },
  { text: '30-day history', symbol: '\u25CB' },
  { text: 'Basic stats', symbol: '\u25CB' },
  { text: 'Limited AI coaching', symbol: '\u25CB' },
];

const PRO_FEATURES = [
  { text: 'Unlimited habits', symbol: Icons.check },
  { text: 'Advanced streak tracking', symbol: Icons.check },
  { text: 'Full history & analytics', symbol: Icons.check },
  { text: 'Advanced stats & insights', symbol: Icons.check },
  { text: 'Unlimited AI coaching', symbol: Icons.check },
  { text: 'Streak freezes (3/month)', symbol: Icons.check },
  { text: 'Custom themes', symbol: Icons.check },
  { text: 'Priority support', symbol: Icons.check },
  { text: 'Export data to CSV', symbol: Icons.check },
  { text: 'Early access to features', symbol: Icons.check },
];

export default function ProScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

  const handlePurchase = () => {
    const planName = selectedPlan === 'monthly' ? '$4.99/month' : '$39.99/year';
    Alert.alert(
      'Coming Soon!',
      `In-app purchase for ${planName} will be available when the app launches on the App Store. Thanks for your interest in QuestHabit Pro!`,
      [{ text: 'Got it!' }]
    );
  };

  const handleRestorePurchases = () => {
    Alert.alert(
      'Restore Purchases',
      'Purchase restoration will be available when in-app purchases are enabled.',
      [{ text: 'OK' }]
    );
  };

  if (user?.isPro) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.activeProContainer}>
          {/* Active Pro Hero */}
          <LinearGradient
            colors={['rgba(245, 158, 11, 0.12)', 'rgba(245, 158, 11, 0.02)']}
            style={styles.activeProHero}
          >
            <View style={styles.activeProIconWrap}>
              <Text style={styles.activeProIcon}>{Icons.crown}</Text>
            </View>
            <Text style={styles.activeProTitle}>You're a Pro!</Text>
            <Text style={styles.activeProSubtitle}>
              Thank you for supporting QuestHabit
            </Text>
          </LinearGradient>

          {user.proExpiresAt && (
            <GradientCard variant="gold" style={styles.expiryCard}>
              <View style={styles.expiryInner}>
                <Text style={styles.expiryLabel}>SUBSCRIPTION RENEWS</Text>
                <Text style={styles.expiryDate}>
                  {new Date(user.proExpiresAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </GradientCard>
          )}

          <View style={styles.activeFeaturesList}>
            <Text style={styles.activeFeaturesTitle}>Your Pro Benefits</Text>
            {PRO_FEATURES.map((feature, index) => (
              <View key={index} style={styles.activeFeatureRow}>
                <View style={styles.featureCheckCircle}>
                  <Text style={styles.featureCheckText}>{Icons.check}</Text>
                </View>
                <Text style={styles.activeFeatureText}>{feature.text}</Text>
              </View>
            ))}
          </View>

          <Button
            title={`${Icons.back} Back`}
            variant="ghost"
            onPress={() => router.back()}
            style={{ marginTop: Spacing.xl }}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section */}
      <LinearGradient
        colors={['rgba(245, 158, 11, 0.06)', Colors.bg.primary]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroIconWrap}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            style={styles.heroIconGradient}
          >
            <Text style={styles.heroIcon}>{Icons.crown}</Text>
          </LinearGradient>
        </View>
        <Text style={styles.heroTitle}>QuestHabit Pro</Text>
        <Text style={styles.heroSubtitle}>
          Unlock your full potential.{'\n'}Level up without limits.
        </Text>
      </LinearGradient>

      {/* Feature Comparison */}
      <View style={styles.comparisonSection}>
        {/* Free Column */}
        <GradientCard variant="surface" style={styles.comparisonCard}>
          <View style={styles.comparisonHeader}>
            <IconBadge symbol={Icons.shield} color={Colors.text.tertiary} size="lg" />
            <Text style={styles.comparisonPlanName}>Free</Text>
            <Text style={styles.comparisonPrice}>$0</Text>
          </View>
          <View style={styles.comparisonFeatures}>
            {FREE_FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureSymbolMuted}>{feature.symbol}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
          <View style={styles.currentPlanDivider} />
          <Text style={styles.currentPlanLabel}>Current Plan</Text>
        </GradientCard>

        {/* Pro Column */}
        <View style={styles.proCardWrapper}>
          <ChipTag label="BEST VALUE" color={Colors.pro.primary} variant="filled" style={styles.bestValueBadge} />
          <GradientCard variant="gold" style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <IconBadge symbol={Icons.crown} color={Colors.pro.primary} size="lg" />
              <Text style={[styles.comparisonPlanName, { color: Colors.pro.primary }]}>Pro</Text>
              <View style={styles.proPriceRow}>
                <Text style={[styles.comparisonPrice, { color: Colors.pro.primary }]}>
                  {selectedPlan === 'monthly' ? '$4.99' : '$3.33'}
                </Text>
                <Text style={styles.comparisonPricePeriod}>/mo</Text>
              </View>
            </View>
            <View style={styles.comparisonFeatures}>
              {PRO_FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <View style={styles.proCheckCircle}>
                    <Text style={styles.proCheckText}>{Icons.check}</Text>
                  </View>
                  <Text style={styles.proFeatureText}>{feature.text}</Text>
                </View>
              ))}
            </View>
          </GradientCard>
        </View>
      </View>

      {/* Plan Selector */}
      <View style={styles.planSelector}>
        <Text style={styles.planSelectorTitle}>Choose Your Plan</Text>

        <TouchableOpacity
          style={[
            styles.planOption,
            selectedPlan === 'yearly' && styles.planOptionSelected,
          ]}
          onPress={() => setSelectedPlan('yearly')}
          activeOpacity={0.8}
        >
          <View style={styles.planOptionLeft}>
            <View style={[styles.radio, selectedPlan === 'yearly' && styles.radioSelected]}>
              {selectedPlan === 'yearly' && <View style={styles.radioInner} />}
            </View>
            <View>
              <Text style={styles.planOptionTitle}>Yearly</Text>
              <Text style={styles.planOptionSubtitle}>$39.99/year · $3.33/mo</Text>
            </View>
          </View>
          <ChipTag label="SAVE 33%" color={Colors.semantic.success} variant="filled" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.planOption,
            selectedPlan === 'monthly' && styles.planOptionSelected,
          ]}
          onPress={() => setSelectedPlan('monthly')}
          activeOpacity={0.8}
        >
          <View style={styles.planOptionLeft}>
            <View style={[styles.radio, selectedPlan === 'monthly' && styles.radioSelected]}>
              {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
            </View>
            <View>
              <Text style={styles.planOptionTitle}>Monthly</Text>
              <Text style={styles.planOptionSubtitle}>$4.99/month</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <GradientButton
          title={selectedPlan === 'yearly' ? 'Start Pro \u2014 $39.99/year' : 'Start Pro \u2014 $4.99/month'}
          onPress={handlePurchase}
          variant="gold"
          size="lg"
          fullWidth
        />
        <Text style={styles.ctaSubtext}>
          Cancel anytime {Icons.dot} 7-day free trial
        </Text>

        <TouchableOpacity onPress={handleRestorePurchases} style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </View>

      {/* Social Proof */}
      <GradientCard variant="glass">
        <View style={styles.socialProofInner}>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <Text key={i} style={styles.star}>{Icons.trophy}</Text>
            ))}
          </View>
          <Text style={styles.socialProofText}>
            "QuestHabit Pro helped me build 12 habits and maintain a 90-day streak. The AI coach is a game changer!"
          </Text>
          <Text style={styles.socialProofAuthor}>\u2014 Alex, Level 10 Hero</Text>
        </View>
      </GradientCard>

      <View style={{ height: Spacing['3xl'] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    marginBottom: Spacing.xs,
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  heroIconWrap: {
    marginBottom: Spacing.lg,
    ...Shadows.goldGlow,
  },
  heroIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    fontSize: 32,
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  heroTitle: {
    ...Typography.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.8,
  },
  heroSubtitle: {
    ...Typography.body,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Comparison
  comparisonSection: {
    marginBottom: Spacing['2xl'],
    gap: Spacing.md,
  },
  comparisonCard: {
    paddingTop: Spacing.lg,
  },
  proCardWrapper: {
    position: 'relative',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: Spacing.md,
    zIndex: 10,
  },
  comparisonHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.xxs,
  },
  comparisonPlanName: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xxs,
  },
  comparisonPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  proPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  comparisonPricePeriod: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginLeft: 2,
  },
  comparisonFeatures: {
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureSymbolMuted: {
    fontSize: 14,
    color: Colors.text.muted,
    width: 20,
    textAlign: 'center',
  },
  featureText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    flex: 1,
  },
  proCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.semantic.successMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proCheckText: {
    fontSize: 11,
    color: Colors.semantic.success,
    fontWeight: '700',
  },
  proFeatureText: {
    ...Typography.caption,
    color: Colors.text.primary,
    flex: 1,
  },
  currentPlanDivider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginTop: Spacing.md,
  },
  currentPlanLabel: {
    textAlign: 'center',
    color: Colors.text.muted,
    ...Typography.captionMedium,
    marginTop: Spacing.md,
  },

  // Plan Selector
  planSelector: {
    marginBottom: Spacing.xl,
  },
  planSelectorTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  planOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border.primary,
  },
  planOptionSelected: {
    borderColor: Colors.pro.primary,
    backgroundColor: Colors.pro.bg,
  },
  planOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.text.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.pro.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.pro.primary,
  },
  planOptionTitle: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  planOptionSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },

  // CTA
  ctaSection: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  ctaSubtext: {
    color: Colors.text.muted,
    ...Typography.caption,
    marginTop: Spacing.sm,
  },
  restoreButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  restoreText: {
    color: Colors.accent.primary,
    ...Typography.captionMedium,
  },

  // Social Proof
  socialProofInner: {
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  star: {
    fontSize: 16,
    color: Colors.xp.primary,
    fontWeight: '700',
  },
  socialProofText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  socialProofAuthor: {
    ...Typography.captionMedium,
    color: Colors.text.muted,
  },

  // Active Pro View
  activeProContainer: {
    alignItems: 'center',
  },
  activeProHero: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    borderRadius: Radius.xl,
    marginBottom: Spacing.xl,
  },
  activeProIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.pro.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.pro.border,
  },
  activeProIcon: {
    fontSize: 36,
    color: Colors.pro.primary,
    fontWeight: '700',
  },
  activeProTitle: {
    ...Typography.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  activeProSubtitle: {
    ...Typography.body,
    color: Colors.text.tertiary,
  },
  expiryCard: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  expiryInner: {
    alignItems: 'center',
  },
  expiryLabel: {
    ...Typography.label,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xxs,
  },
  expiryDate: {
    ...Typography.bodySemibold,
    color: Colors.text.primary,
  },
  activeFeaturesList: {
    width: '100%',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  activeFeaturesTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  activeFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: Spacing.sm,
  },
  featureCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.semantic.successMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCheckText: {
    fontSize: 13,
    color: Colors.semantic.success,
    fontWeight: '700',
  },
  activeFeatureText: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1,
  },
});
