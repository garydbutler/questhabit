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
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';

type PlanType = 'monthly' | 'yearly';

const FREE_FEATURES = [
  { text: '5 habits max', icon: '📋' },
  { text: 'Basic streak tracking', icon: '🔥' },
  { text: '30-day history', icon: '📅' },
  { text: 'Basic stats', icon: '📊' },
  { text: 'Limited AI coaching', icon: '🤖' },
];

const PRO_FEATURES = [
  { text: 'Unlimited habits', icon: '♾️' },
  { text: 'Advanced streak tracking', icon: '🔥' },
  { text: 'Full history & analytics', icon: '📅' },
  { text: 'Advanced stats & insights', icon: '📊' },
  { text: 'Unlimited AI coaching', icon: '🤖' },
  { text: 'Streak freezes (3/month)', icon: '🧊' },
  { text: 'Custom themes', icon: '🎨' },
  { text: 'Priority support', icon: '⚡' },
  { text: 'Export data to CSV', icon: '📤' },
  { text: 'Early access to features', icon: '🚀' },
];

export default function ProScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

  const handlePurchase = () => {
    const planName = selectedPlan === 'monthly' ? '$4.99/month' : '$39.99/year';
    Alert.alert(
      'Coming Soon! 🚀',
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
          <Text style={styles.activeProIcon}>👑</Text>
          <Text style={styles.activeProTitle}>You're a Pro!</Text>
          <Text style={styles.activeProSubtitle}>
            Thank you for supporting QuestHabit
          </Text>

          {user.proExpiresAt && (
            <View style={styles.expiryCard}>
              <Text style={styles.expiryLabel}>Subscription renews</Text>
              <Text style={styles.expiryDate}>
                {new Date(user.proExpiresAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}

          <View style={styles.activeFeaturesList}>
            <Text style={styles.activeFeaturesTitle}>Your Pro Benefits</Text>
            {PRO_FEATURES.map((feature, index) => (
              <View key={index} style={styles.activeFeatureRow}>
                <Text style={styles.activeFeatureIcon}>{feature.icon}</Text>
                <Text style={styles.activeFeatureText}>{feature.text}</Text>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            ))}
          </View>

          <Button
            title="← Back"
            variant="ghost"
            onPress={() => router.back()}
            style={{ marginTop: 24 }}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>⚔️</Text>
        <Text style={styles.heroTitle}>QuestHabit Pro</Text>
        <Text style={styles.heroSubtitle}>
          Unlock your full potential. Level up without limits.
        </Text>
      </View>

      {/* Feature Comparison */}
      <View style={styles.comparisonSection}>
        {/* Free Column */}
        <View style={styles.comparisonCard}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonPlanIcon}>🛡️</Text>
            <Text style={styles.comparisonPlanName}>Free</Text>
            <Text style={styles.comparisonPrice}>$0</Text>
          </View>
          <View style={styles.comparisonFeatures}>
            {FREE_FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.currentPlanLabel}>Current Plan</Text>
        </View>

        {/* Pro Column */}
        <View style={[styles.comparisonCard, styles.proCard]}>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>BEST VALUE</Text>
          </View>
          <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonPlanIcon}>👑</Text>
            <Text style={[styles.comparisonPlanName, styles.proText]}>Pro</Text>
            <Text style={[styles.comparisonPrice, styles.proText]}>
              {selectedPlan === 'monthly' ? '$4.99' : '$3.33'}
              <Text style={styles.comparisonPricePeriod}>/mo</Text>
            </Text>
          </View>
          <View style={styles.comparisonFeatures}>
            {PRO_FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={[styles.featureText, styles.proFeatureText]}>
                  {feature.text}
                </Text>
              </View>
            ))}
          </View>
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
          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>SAVE 33%</Text>
          </View>
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
        <Button
          title={selectedPlan === 'yearly' ? 'Start Pro — $39.99/year' : 'Start Pro — $4.99/month'}
          onPress={handlePurchase}
          size="lg"
          style={styles.ctaButton}
          textStyle={styles.ctaButtonText}
        />
        <Text style={styles.ctaSubtext}>
          Cancel anytime · 7-day free trial
        </Text>

        <TouchableOpacity onPress={handleRestorePurchases} style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </View>

      {/* Testimonial / Social Proof */}
      <View style={styles.socialProof}>
        <Text style={styles.socialProofIcon}>🏆</Text>
        <Text style={styles.socialProofText}>
          "QuestHabit Pro helped me build 12 habits and maintain a 90-day streak. The AI coach is a game changer!"
        </Text>
        <Text style={styles.socialProofAuthor}>— Alex, Level 10 Hero</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 8,
  },
  heroIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#A1A1A1',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },

  // Comparison
  comparisonSection: {
    marginBottom: 32,
    gap: 16,
  },
  comparisonCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#252525',
  },
  proCard: {
    borderColor: '#6366F1',
    backgroundColor: '#1A1A2E',
  },
  proBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  comparisonHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 4,
  },
  comparisonPlanIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  comparisonPlanName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  comparisonPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  comparisonPricePeriod: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A1A1A1',
  },
  proText: {
    color: '#A78BFA',
  },
  comparisonFeatures: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureIcon: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#A1A1A1',
    flex: 1,
  },
  proFeatureText: {
    color: '#FFFFFF',
  },
  currentPlanLabel: {
    textAlign: 'center',
    color: '#6B6B6B',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#252525',
  },

  // Plan Selector
  planSelector: {
    marginBottom: 24,
  },
  planSelectorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  planOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#252525',
  },
  planOptionSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#1A1A2E',
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
    borderColor: '#6B6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#6366F1',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366F1',
  },
  planOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  planOptionSubtitle: {
    fontSize: 13,
    color: '#A1A1A1',
  },
  saveBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  saveBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // CTA
  ctaSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 14,
    paddingVertical: 18,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  ctaSubtext: {
    color: '#6B6B6B',
    fontSize: 13,
    marginTop: 12,
  },
  restoreButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  restoreText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
  },

  // Social Proof
  socialProof: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  socialProofIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  socialProofText: {
    fontSize: 14,
    color: '#A1A1A1',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  socialProofAuthor: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '600',
  },

  // Active Pro View
  activeProContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  activeProIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  activeProTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  activeProSubtitle: {
    fontSize: 16,
    color: '#A1A1A1',
    marginBottom: 32,
  },
  expiryCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
    marginBottom: 32,
  },
  expiryLabel: {
    fontSize: 13,
    color: '#A1A1A1',
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeFeaturesList: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
  },
  activeFeaturesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  activeFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  activeFeatureIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  activeFeatureText: {
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
  },
  checkmark: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '700',
  },
});
