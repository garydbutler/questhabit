import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AICoach } from '../../components/coaching/AICoach';
import { Colors } from '../../constants/design';

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
    backgroundColor: Colors.bg.primary,
  },
});
