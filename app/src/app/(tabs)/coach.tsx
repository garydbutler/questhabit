import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AICoach } from '../../components/coaching/AICoach';

export default function CoachScreen() {
  return (
    <View style={styles.container}>
      <AICoach visible={true} onClose={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
});
