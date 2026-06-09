import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { THEME, GB, DEVICE, TYPE_COLORS } from '../constants/colors';
import TypeBadge from './TypeBadge';
import { formatPokemonName, formatPokemonId } from '../utils/helpers';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

export default function PokemonCard({ pokemon, types, onPress, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const primaryType = types?.[0] || 'normal';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: (index % 10) * 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        delay: (index % 10) * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.wrapper,
      {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      },
    ]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {/* ID label — top right */}
        <Text style={styles.id}>
          {formatPokemonId(pokemon.id)}
        </Text>

        {/* Image container with dashed border */}
        <View style={styles.imageContainer}>
          <View style={styles.imageBorder}>
            <Image
              source={{ uri: pokemon.artwork }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Divider line */}
        <View style={styles.divider} />

        {/* Pokemon name */}
        <Text style={styles.name} numberOfLines={1}>
          {formatPokemonName(pokemon.name)}
        </Text>

        {/* Type badges */}
        <View style={styles.types}>
          {types?.map((type) => (
            <TypeBadge key={type} type={type} size="small" />
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    marginBottom: 12,
  },
  card: {
    backgroundColor: THEME.card,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: THEME.cardBorder,
    padding: 8,
    alignItems: 'center',
  },
  id: {
    alignSelf: 'flex-end',
    fontFamily: THEME.pixelFont,
    fontSize: 7,
    color: THEME.textSecondary,
    marginBottom: 4,
  },
  imageContainer: {
    width: CARD_WIDTH - 36,
    height: CARD_WIDTH - 36,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  imageBorder: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: GB.light,
    borderStyle: 'dashed',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: THEME.surfaceLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: THEME.cardBorder,
    marginTop: 8,
    marginBottom: 8,
  },
  name: {
    fontFamily: THEME.pixelFont,
    fontSize: 8,
    color: THEME.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  types: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
});
