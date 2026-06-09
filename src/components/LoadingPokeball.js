import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, Text } from 'react-native';
import { THEME, GB, DEVICE, TYPE_COLORS } from '../constants/colors';

export default function LoadingPokeball({ message = 'CARGANDO...' }) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* LCD screen frame */}
      <View style={styles.screenFrame}>
        <View style={styles.screenInner}>
          <Animated.View style={[
            styles.pokeball,
            {
              transform: [
                { rotate: spin },
                { scale: pulseAnim },
              ],
            },
          ]}>
            {/* Top half - red */}
            <View style={styles.topHalf} />
            {/* Bottom half - cream */}
            <View style={styles.bottomHalf} />
            {/* Center band */}
            <View style={styles.centerLine} />
            {/* Center button outer */}
            <View style={styles.centerButton}>
              <View style={styles.centerButtonInner} />
            </View>
          </Animated.View>

          {/* Loading dots decoration */}
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </View>
  );
}

const BALL_SIZE = 64;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.background,
  },
  screenFrame: {
    borderWidth: 3,
    borderColor: THEME.screenFrame,
    borderRadius: 4,
    padding: 4,
    backgroundColor: THEME.screenFrame,
  },
  screenInner: {
    backgroundColor: THEME.surfaceLight,
    borderWidth: 2,
    borderColor: GB.dark,
    borderRadius: 2,
    paddingHorizontal: 40,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pokeball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: DEVICE.darkGray,
    position: 'relative',
  },
  topHalf: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BALL_SIZE / 2,
    backgroundColor: DEVICE.red,
  },
  bottomHalf: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BALL_SIZE / 2,
    backgroundColor: DEVICE.cream,
  },
  centerLine: {
    position: 'absolute',
    top: BALL_SIZE / 2 - 3,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: DEVICE.darkGray,
    zIndex: 2,
  },
  centerButton: {
    position: 'absolute',
    top: BALL_SIZE / 2 - 10,
    left: BALL_SIZE / 2 - 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DEVICE.darkGray,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DEVICE.cream,
    borderWidth: 2,
    borderColor: DEVICE.lightGray,
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: GB.dark,
    borderRadius: 0,
  },
  message: {
    marginTop: 16,
    fontFamily: THEME.pixelFont,
    fontSize: 8,
    color: THEME.textPrimary,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
