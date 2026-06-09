import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { THEME, DEVICE } from '../constants/colors';

export default function SearchBar({ value, onChangeText, onClear }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="BUSCAR POKEMON..."
        placeholderTextColor={THEME.textMuted}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value ? (
        <TouchableOpacity onPress={onClear} style={styles.clearButton} activeOpacity={0.7}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.searchBg,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: THEME.cardBorder,
    marginHorizontal: 16,
    marginBottom: 12,
    height: 44,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: THEME.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DEVICE.red,
    marginRight: 4,
  },
  clearText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
