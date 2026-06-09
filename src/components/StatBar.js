import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { THEME, SCREEN, TYPE_COLORS } from '../constants/colors';
import { formatStatName, getStatPercentage } from '../utils/helpers';

export default function StatBar({ statName, value, type, delay = 0 }) {
  const animValue = useRef(new Animated.Value(0)).current;
  const percentage = getStatPercentage(value);
  const color = TYPE_COLORS[type] || THEME.accent;

  useEffect(() => {
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: percentage,
      duration: 800,
      delay,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterpolation = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{formatStatName(statName)}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.barContainer}>
        <Animated.View
          style={[
            styles.bar,
            {
              width: widthInterpolation,
              backgroundColor: color,
            },
          ]}
        />
        {/* segment notches for retro meter look */}
        <View style={styles.notches} pointerEvents="none">
          {Array.from({ length: 9 }).map((_, i) => (
            <View key={i} style={styles.notch} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    width: 52,
    fontSize: 7,
    fontFamily: THEME.pixelFont,
    color: SCREEN.textDim,
  },
  value: {
    width: 34,
    fontSize: 15,
    fontFamily: THEME.termFont,
    color: SCREEN.text,
    textAlign: 'right',
    marginRight: 8,
  },
  barContainer: {
    flex: 1,
    height: 10,
    backgroundColor: SCREEN.panelDark,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: SCREEN.border,
  },
  bar: {
    height: '100%',
  },
  notches: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  notch: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
