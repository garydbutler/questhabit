/**
 * Sharing utilities for QuestHabit
 * Handles view capture and system share sheet
 * 
 * Uses expo-file-system SDK 54+ class-based API
 */
import { RefObject } from 'react';
import { Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { Paths, Directory, File } from 'expo-file-system';
import ViewShot from 'react-native-view-shot';

/**
 * Capture a ViewShot ref as a temporary PNG file and return the URI
 */
export async function captureCard(
  viewShotRef: RefObject<ViewShot | null>
): Promise<string | null> {
  try {
    if (!viewShotRef.current?.capture) {
      console.error('ViewShot ref not ready');
      return null;
    }
    const uri = await viewShotRef.current.capture();
    return uri;
  } catch (error) {
    console.error('Failed to capture card:', error);
    return null;
  }
}

/**
 * Share a captured image URI via the system share sheet
 */
export async function shareImage(
  uri: string,
  options?: { message?: string }
): Promise<boolean> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Sharing Unavailable',
        'Sharing is not available on this device.'
      );
      return false;
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: options?.message || 'Share your QuestHabit progress',
      UTI: 'public.png',
    });
    return true;
  } catch (error) {
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Capture a ViewShot and immediately share it
 */
export async function captureAndShare(
  viewShotRef: RefObject<ViewShot | null>,
  options?: { message?: string }
): Promise<boolean> {
  const uri = await captureCard(viewShotRef);
  if (!uri) {
    Alert.alert('Error', 'Failed to capture image. Please try again.');
    return false;
  }
  return shareImage(uri, options);
}

/**
 * Save captured image to a permanent location (for later use)
 */
export async function saveCardImage(
  viewShotRef: RefObject<ViewShot | null>,
  filename: string
): Promise<string | null> {
  const uri = await captureCard(viewShotRef);
  if (!uri) return null;

  try {
    const shareDir = new Directory(Paths.document, 'share-cards');
    shareDir.create();
    const sourceFile = new File(uri);
    const destFile = new File(shareDir, `${filename}.png`);
    sourceFile.copy(destFile);
    return destFile.uri;
  } catch (error) {
    console.error('Failed to save card image:', error);
    return null;
  }
}
