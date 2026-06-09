// CRT-style overlay for the Game Boy display: scanlines,
// edge vignette and a diagonal glass glare. Pure decoration,
// never intercepts touches.
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SCANLINE_COUNT = 80;
const LINES = Array.from({ length: SCANLINE_COUNT });

function ScreenFX() {
  return (
    <View style={styles.overlay} pointerEvents="none">
      {/* Scanlines */}
      <View style={styles.scanlines}>
        {LINES.map((_, i) => (
          <View key={i} style={styles.line} />
        ))}
      </View>

      {/* Vignette edges */}
      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'transparent']}
        style={styles.vignetteTop}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.45)']}
        style={styles.vignetteBottom}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.30)', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.vignetteLeft}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.30)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.vignetteRight}
      />

      {/* Diagonal glass glare */}
      <LinearGradient
        colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.015)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={styles.glare}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    opacity: 0.55,
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  vignetteTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 26,
  },
  vignetteBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 26,
  },
  vignetteLeft: {
    position: 'absolute', top: 0, bottom: 0, left: 0, width: 18,
  },
  vignetteRight: {
    position: 'absolute', top: 0, bottom: 0, right: 0, width: 18,
  },
  glare: {
    position: 'absolute', top: 0, left: 0, right: '30%', height: '45%',
    borderBottomRightRadius: 120,
  },
});

export default memo(ScreenFX);
