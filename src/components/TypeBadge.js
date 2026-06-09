import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME, TYPE_COLORS } from '../constants/colors';
import { capitalize } from '../utils/helpers';

export default function TypeBadge({ type, size = 'small' }) {
  const color = TYPE_COLORS[type] || '#888';
  const isLarge = size === 'large';

  return (
    <View style={[
      styles.badge,
      { backgroundColor: color },
      isLarge && styles.badgeLarge,
    ]}>
      <Text style={[
        styles.text,
        isLarge && styles.textLarge,
      ]}>
        {capitalize(type)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 2,
    marginRight: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  badgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 6,
    color: '#FFFFFF',
    fontFamily: THEME.pixelFont,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textLarge: {
    fontSize: 8,
  },
});
