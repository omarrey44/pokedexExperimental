import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  Animated, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { TYPE_COLORS, TYPE_GRADIENTS, SCREEN, THEME } from '../constants/colors';
import { fetchPokemonDetail, fetchPokemonSpecies } from '../api/pokeApi';
import {
  formatPokemonName, formatPokemonId,
  formatHeight, formatWeight, formatAbilityName,
} from '../utils/helpers';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import TypewriterText from '../components/TypewriterText';
import { useGameBoy } from '../context/GameBoyContext';
import { playCry, playSfx } from '../utils/sound';

const MAX_ID = 1025;
const PIXEL_SPRITE = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export default function DetailScreen({ route, navigation }) {
  const { pokemonId, pokemonName } = route.params;
  const { setHandlers } = useGameBoy();
  const [detail, setDetail] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const scrollY = useRef(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.6)).current;

  const primaryType = detail?.types?.[0] || 'normal';
  const typeColor = TYPE_COLORS[primaryType] || '#888';
  const typeGradient = TYPE_GRADIENTS[primaryType] || TYPE_GRADIENTS.normal;

  useEffect(() => { loadData(); }, [pokemonId]);

  async function loadData() {
    try {
      setLoading(true);
      fadeAnim.setValue(0);
      imageScale.setValue(0.6);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      scrollY.current = 0;

      const [detailData, speciesData] = await Promise.all([
        fetchPokemonDetail(pokemonId),
        fetchPokemonSpecies(pokemonId),
      ]);
      setDetail(detailData);
      setSpecies(speciesData);
      playCry(pokemonId);

      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(imageScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      ]).start();
    } catch (error) {
      console.error('Error loading detail:', error);
    } finally {
      setLoading(false);
    }
  }

  const goTo = (id) => {
    if (id < 1 || id > MAX_ID) return;
    navigation.setParams({ pokemonId: id, pokemonName: '' });
  };

  // ── Game Boy button handlers ──
  const actionsRef = useRef({});
  actionsRef.current = {
    onUp: () => {
      scrollY.current = Math.max(0, scrollY.current - 70);
      scrollRef.current?.scrollTo({ y: scrollY.current, animated: true });
    },
    onDown: () => {
      scrollY.current += 70;
      scrollRef.current?.scrollTo({ y: scrollY.current, animated: true });
    },
    onLeft: () => goTo(pokemonId - 1),
    onRight: () => goTo(pokemonId + 1),
    onA: () => playCry(pokemonId),
    onB: () => navigation.goBack(),
    onStart: () => {},
    onSelect: () => {},
  };

  useFocusEffect(
    useCallback(() => {
      setHandlers({
        onUp: () => actionsRef.current.onUp(),
        onDown: () => actionsRef.current.onDown(),
        onLeft: () => actionsRef.current.onLeft(),
        onRight: () => actionsRef.current.onRight(),
        onA: () => actionsRef.current.onA(),
        onB: () => actionsRef.current.onB(),
        onStart: () => actionsRef.current.onStart(),
        onSelect: () => actionsRef.current.onSelect(),
      });
    }, [setHandlers])
  );

  const totalStats = detail?.stats?.reduce((sum, s) => sum + s.value, 0) || 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={SCREEN.phosphor} />
        <Text style={styles.loadingText}>ACCEDIENDO REGISTRO...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ─── Top bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => { playSfx('cancel'); navigation.goBack(); }}
          style={styles.backButton}
        >
          <Text style={styles.backText}>◄B ATRAS</Text>
        </TouchableOpacity>
        <Text style={styles.headerId}>{formatPokemonId(pokemonId)}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={(e) => { scrollY.current = e.nativeEvent.contentOffset.y; }}
        scrollEventThrottle={64}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Hero: artwork on type gradient ─── */}
        <LinearGradient
          colors={[typeGradient[0] + '55', SCREEN.bg]}
          style={styles.hero}
        >
          <View style={[styles.heroGlow, { backgroundColor: typeColor }]} />
          <Animated.View style={{ transform: [{ scale: imageScale }] }}>
            <Image
              source={{ uri: detail?.sprites?.artwork }}
              style={styles.pokemonImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* vintage pixel-sprite stamp */}
          <View style={styles.spriteStamp}>
            <Image
              source={{ uri: PIXEL_SPRITE(pokemonId) }}
              style={styles.spriteStampImg}
              resizeMode="contain"
            />
          </View>

          {/* cry button */}
          <TouchableOpacity
            style={[styles.cryButton, { borderColor: typeColor }]}
            onPress={() => { playSfx('blip'); playCry(pokemonId); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.cryText, { color: typeColor }]}>► GRITO</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* ─── Name + types ─── */}
          <View style={styles.nameSection}>
            <Text style={styles.pokemonName}>
              {formatPokemonName(detail?.name || pokemonName).toUpperCase()}
            </Text>
            <View style={styles.typesRow}>
              {detail?.types?.map((type) => (
                <TypeBadge key={type} type={type} size="large" />
              ))}
            </View>
            {(species?.isLegendary || species?.isMythical) && (
              <View style={styles.legendaryBadge}>
                <Text style={styles.legendaryText}>
                  {species.isLegendary ? '* LEGENDARIO *' : '* MITICO *'}
                </Text>
              </View>
            )}
          </View>

          {/* ─── Dialog box description (typewriter) ─── */}
          {species?.description && (
            <View style={styles.dialogBox}>
              <View style={styles.dialogInner}>
                <TypewriterText
                  text={species.description}
                  speed={14}
                  style={styles.dialogText}
                  cursorStyle={styles.dialogCursor}
                />
              </View>
            </View>
          )}

          {/* ─── Info cards ─── */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>ALTURA</Text>
              <Text style={styles.infoValue}>{formatHeight(detail?.height || 0)}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>PESO</Text>
              <Text style={styles.infoValue}>{formatWeight(detail?.weight || 0)}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>GEN</Text>
              <Text style={styles.infoValue}>{species?.generation || '?'}</Text>
            </View>
          </View>

          {/* ─── Stats ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>ESTADISTICAS</Text>
              <Text style={[styles.totalStat, { color: typeColor }]}>TOT {totalStats}</Text>
            </View>
            <View style={styles.statsBox}>
              {detail?.stats?.map((stat, index) => (
                <StatBar
                  key={stat.name}
                  statName={stat.name}
                  value={stat.value}
                  type={primaryType}
                  delay={index * 80}
                />
              ))}
            </View>
          </View>

          {/* ─── Abilities ─── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HABILIDADES</Text>
            <View style={styles.abilitiesRow}>
              {detail?.abilities?.map((ability) => (
                <View
                  key={ability.name}
                  style={[styles.abilityChip, { borderColor: typeColor }]}
                >
                  <Text style={[styles.abilityText, { color: SCREEN.text }]}>
                    {formatAbilityName(ability.name).toUpperCase()}
                  </Text>
                  {ability.isHidden && (
                    <Text style={styles.hiddenLabel}>OCULTA</Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* ─── Extra info ─── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REGISTRO</Text>
            <View style={styles.extraGrid}>
              <View style={styles.extraItem}>
                <Text style={styles.extraLabel}>EXP BASE</Text>
                <Text style={styles.extraValue}>{detail?.baseExperience || '--'}</Text>
              </View>
              <View style={styles.extraItem}>
                <Text style={styles.extraLabel}>CAPTURA</Text>
                <Text style={styles.extraValue}>{species?.captureRate ?? '--'}</Text>
              </View>
              <View style={styles.extraItem}>
                <Text style={styles.extraLabel}>HABITAT</Text>
                <Text style={styles.extraValue}>
                  {species?.habitat ? species.habitat.toUpperCase() : '--'}
                </Text>
              </View>
              <View style={styles.extraItem}>
                <Text style={styles.extraLabel}>COLOR</Text>
                <Text style={styles.extraValue}>
                  {species?.color ? species.color.toUpperCase() : '--'}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 16 }} />
        </Animated.View>
      </ScrollView>

      {/* ─── Footer hints ─── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>◄►:OTRO</Text>
        <Text style={styles.footerText}>A:GRITO</Text>
        <Text style={styles.footerText}>B:ATRAS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SCREEN.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SCREEN.bg,
  },
  loadingText: {
    fontFamily: THEME.termFont,
    fontSize: 15,
    color: SCREEN.phosphorDim,
    marginTop: 12,
    letterSpacing: 1,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SCREEN.panelDark,
    borderBottomWidth: 1,
    borderBottomColor: SCREEN.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backButton: { paddingVertical: 2, paddingRight: 12 },
  backText: {
    fontFamily: THEME.pixelFont,
    color: SCREEN.phosphor,
    fontSize: 7,
  },
  headerId: {
    fontFamily: THEME.pixelFont,
    color: SCREEN.gold,
    fontSize: 9,
  },
  scrollContent: { paddingBottom: 8 },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: SCREEN.border,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: '12%',
    width: 170,
    height: 170,
    borderRadius: 999,
    opacity: 0.18,
  },
  pokemonImage: {
    width: 150,
    height: 150,
  },
  spriteStamp: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 34,
    height: 34,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: SCREEN.border,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spriteStampImg: { width: 28, height: 28 },
  cryButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cryText: {
    fontFamily: THEME.pixelFont,
    fontSize: 6,
  },

  // Name & types
  nameSection: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pokemonName: {
    fontFamily: THEME.pixelFont,
    fontSize: 13,
    color: SCREEN.text,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(123,226,91,0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  typesRow: { flexDirection: 'row', gap: 6 },
  legendaryBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: SCREEN.gold,
    borderRadius: 2,
    backgroundColor: 'rgba(242,193,78,0.12)',
  },
  legendaryText: {
    fontFamily: THEME.pixelFont,
    color: SCREEN.gold,
    fontSize: 7,
  },

  // Dialog box (classic Pokémon text frame)
  dialogBox: {
    marginHorizontal: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: SCREEN.text,
    borderRadius: 4,
    backgroundColor: SCREEN.panelDark,
    padding: 3,
  },
  dialogInner: {
    borderWidth: 1,
    borderColor: SCREEN.border,
    borderRadius: 2,
    padding: 8,
    minHeight: 58,
  },
  dialogText: {
    fontFamily: THEME.termFont,
    fontSize: 17,
    lineHeight: 21,
    color: SCREEN.text,
  },
  dialogCursor: {
    fontFamily: THEME.termFont,
    fontSize: 17,
    color: SCREEN.phosphor,
  },

  // Info cards
  infoRow: {
    flexDirection: 'row',
    gap: 4,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  infoCard: {
    flex: 1,
    backgroundColor: SCREEN.panel,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: SCREEN.border,
    padding: 7,
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: THEME.pixelFont,
    fontSize: 5,
    color: SCREEN.textDim,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: THEME.termFont,
    fontSize: 16,
    color: SCREEN.text,
  },

  // Sections
  section: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: THEME.pixelFont,
    fontSize: 7,
    color: SCREEN.phosphor,
    marginBottom: 6,
  },
  totalStat: {
    fontFamily: THEME.pixelFont,
    fontSize: 7,
    marginBottom: 6,
  },
  statsBox: {
    borderWidth: 1,
    borderColor: SCREEN.border,
    borderRadius: 2,
    backgroundColor: SCREEN.panel,
    padding: 8,
  },

  // Abilities
  abilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  abilityChip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 2,
    backgroundColor: SCREEN.panel,
    borderWidth: 1,
    alignItems: 'center',
  },
  abilityText: {
    fontFamily: THEME.termFont,
    fontSize: 14,
  },
  hiddenLabel: {
    fontFamily: THEME.pixelFont,
    fontSize: 5,
    color: SCREEN.gold,
    marginTop: 2,
  },

  // Extra info
  extraGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  extraItem: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: SCREEN.panel,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: SCREEN.border,
    padding: 7,
  },
  extraLabel: {
    fontFamily: THEME.pixelFont,
    fontSize: 5,
    color: SCREEN.textDim,
    marginBottom: 3,
  },
  extraValue: {
    fontFamily: THEME.termFont,
    fontSize: 15,
    color: SCREEN.text,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: SCREEN.panelDark,
    borderTopWidth: 1,
    borderTopColor: SCREEN.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  footerText: {
    fontFamily: THEME.pixelFont,
    fontSize: 5,
    color: SCREEN.textMuted,
  },
});
