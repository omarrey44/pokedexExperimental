import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME, DEVICE, TYPE_COLORS } from '../constants/colors';
import { GENERATIONS } from '../constants/generations';
import { capitalize } from '../utils/helpers';

export default function FilterChips({
  selectedGeneration,
  onSelectGeneration,
  selectedType,
  onSelectType,
  types,
}) {
  return (
    <View style={styles.wrapper}>
      {/* Generation filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollRow}
      >
        {GENERATIONS.map((gen) => {
          const isActive = selectedGeneration === gen.value;
          return (
            <TouchableOpacity
              key={gen.value}
              onPress={() => onSelectGeneration(gen.value)}
              style={[
                styles.chip,
                isActive && styles.chipActive,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.chipText,
                isActive && styles.chipTextActive,
              ]}>
                {gen.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Type filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollRow}
      >
        <TouchableOpacity
          onPress={() => onSelectType(null)}
          style={[
            styles.chip,
            !selectedType && styles.chipActive,
          ]}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.chipText,
            !selectedType && styles.chipTextActive,
          ]}>
            All Types
          </Text>
        </TouchableOpacity>
        {types.map((type) => {
          const isActive = selectedType === type;
          const typeColor = TYPE_COLORS[type];
          return (
            <TouchableOpacity
              key={type}
              onPress={() => onSelectType(type)}
              style={[
                styles.chip,
                isActive && {
                  backgroundColor: typeColor,
                  borderColor: typeColor,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.typeDot, { backgroundColor: typeColor }]} />
              <Text style={[
                styles.chipText,
                isActive && styles.chipTextActive,
              ]}>
                {capitalize(type)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  scrollRow: {
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
    backgroundColor: THEME.card,
    borderWidth: 2,
    borderColor: THEME.cardBorder,
  },
  chipActive: {
    backgroundColor: DEVICE.red,
    borderColor: DEVICE.darkRed,
  },
  chipText: {
    fontSize: 7,
    fontFamily: THEME.pixelFont,
    color: THEME.textPrimary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 0,
    marginRight: 4,
  },
});
