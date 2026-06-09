import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME, GB, DEVICE, TYPE_COLORS } from '../constants/colors';

export default function Header({ count }) {
  return (
    <View style={styles.container}>
      <View style={styles.topStrip}>
        <View style={styles.titleRow}>
          {/* LED cluster */}
          <View style={styles.ledCluster}>
            {/* Big blue LED */}
            <View style={styles.bigLedOuter}>
              <View style={styles.bigLedRing}>
                <View style={styles.bigLedInner}>
                  <View style={styles.bigLedShine} />
                </View>
              </View>
            </View>
            {/* Three small indicator LEDs */}
            <View style={styles.smallLedColumn}>
              <View style={[styles.smallLed, { backgroundColor: DEVICE.ledRed }]}>
                <View style={styles.smallLedShine} />
              </View>
              <View style={[styles.smallLed, { backgroundColor: DEVICE.ledYellow }]}>
                <View style={styles.smallLedShine} />
              </View>
              <View style={[styles.smallLed, { backgroundColor: DEVICE.ledGreen }]}>
                <View style={styles.smallLedShine} />
              </View>
            </View>
          </View>

          {/* Title area */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>POKEDEX</Text>
            <Text style={styles.subtitle}>
              {count ? `${count} POKEMON FOUND` : 'LOADING...'}
            </Text>
          </View>
        </View>
      </View>
      {/* Bottom dark red border line */}
      <View style={styles.bottomBorder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DEVICE.red,
  },
  topStrip: {
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: DEVICE.red,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ledCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  bigLedOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DEVICE.darkGray,
    borderWidth: 3,
    borderColor: DEVICE.deepRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bigLedRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A6090',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0D4060',
  },
  bigLedInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DEVICE.ledBlue,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  bigLedShine: {
    width: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  smallLedColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  smallLed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: DEVICE.deepRed,
    overflow: 'hidden',
  },
  smallLedShine: {
    width: 4,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 1,
    marginLeft: 1,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    fontFamily: THEME.pixelFont,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: THEME.pixelFont,
    fontSize: 7,
    color: DEVICE.cream,
    marginTop: 8,
    letterSpacing: 1,
  },
  bottomBorder: {
    height: 4,
    backgroundColor: DEVICE.darkRed,
  },
});
