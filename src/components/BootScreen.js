// Game Boy boot homage: the logo drops from the top of the
// display, lands with the classic "ba-ding", firmware line
// types in, then the UI fades through.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { SCREEN, THEME } from '../constants/colors';
import { playSfx } from '../utils/sound';
import TypewriterText from './TypewriterText';

export default function BootScreen({ onFinish }) {
  const drop = useRef(new Animated.Value(-90)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    Animated.timing(drop, {
      toValue: 0,
      duration: 1400,
      useNativeDriver: true,
    }).start(() => {
      playSfx('boot');
      setLanded(true);
      setTimeout(() => {
        Animated.timing(fade, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }).start(() => onFinish && onFinish());
      }, 1700);
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <Animated.View style={{ transform: [{ translateY: drop }], alignItems: 'center' }}>
        <Text style={styles.logo}>POKéDEX</Text>
        <View style={styles.logoUnderline} />
      </Animated.View>

      {landed && (
        <View style={styles.firmware}>
          <TypewriterText
            text="DMG FIRMWARE v2.0 — OK"
            speed={28}
            style={styles.firmwareText}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SCREEN.bg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  logo: {
    fontFamily: THEME.pixelFont,
    fontSize: 22,
    color: SCREEN.phosphor,
    letterSpacing: 2,
    textShadowColor: 'rgba(123,226,91,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  logoUnderline: {
    marginTop: 8,
    width: 170,
    height: 3,
    backgroundColor: SCREEN.phosphorDim,
  },
  firmware: {
    position: 'absolute',
    bottom: 24,
  },
  firmwareText: {
    fontFamily: THEME.termFont,
    fontSize: 15,
    color: SCREEN.textDim,
    letterSpacing: 1,
  },
});
