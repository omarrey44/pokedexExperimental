import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SCREEN, THEME, TYPE_COLORS } from '../constants/colors';
import { GENERATIONS } from '../constants/generations';
import { fetchAllPokemon } from '../api/pokeApi';
import { formatPokemonName } from '../utils/helpers';
import { useGameBoy } from '../context/GameBoyContext';
import { playSfx } from '../utils/sound';

const PIXEL_SPRITE = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const ROW_HEIGHT = 26;

export default function HomeScreen({ navigation }) {
  const { setHandlers } = useGameBoy();
  const [allPokemon, setAllPokemon] = useState([]);
  const [pokemonTypes, setPokemonTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [genIndex, setGenIndex] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const listRef = useRef(null);
  const typesLoadedRef = useRef({});

  useEffect(() => { loadPokemon(); }, []);

  async function loadPokemon() {
    try {
      setLoading(true);
      const data = await fetchAllPokemon();
      setAllPokemon(data);
      await loadTypesForRange(data, 1, 40);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTypesForRange(pokemonList, start, end) {
    const idsToFetch = [];
    for (let i = start; i <= Math.min(end, pokemonList.length); i++) {
      if (!typesLoadedRef.current[i]) {
        idsToFetch.push(i);
        typesLoadedRef.current[i] = true;
      }
    }
    if (idsToFetch.length === 0) return;
    try {
      const results = await Promise.all(
        idsToFetch.map(async (id) => {
          try {
            const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await resp.json();
            return { id, types: data.types.map(t => t.type.name) };
          } catch { return { id, types: [] }; }
        })
      );
      const newTypes = {};
      results.forEach(r => { newTypes[r.id] = r.types; });
      setPokemonTypes(prev => ({ ...prev, ...newTypes }));
    } catch (error) {
      console.error('Error loading types:', error);
    }
  }

  const filteredPokemon = useMemo(() => {
    const gen = GENERATIONS[genIndex];
    let result = allPokemon;
    if (gen.value !== 'all') {
      result = result.filter(p => p.id >= gen.min && p.id <= gen.max);
    }
    if (searchText) {
      const s = searchText.toLowerCase();
      result = result.filter(p =>
        p.name.includes(s) ||
        String(p.id).padStart(3, '0').includes(s)
      );
    }
    return result;
  }, [allPokemon, genIndex, searchText]);

  const selectedPokemon = filteredPokemon[selectedIndex] || filteredPokemon[0];

  useEffect(() => {
    if (selectedIndex >= filteredPokemon.length) {
      setSelectedIndex(Math.max(0, filteredPokemon.length - 1));
    }
  }, [filteredPokemon.length]);

  useEffect(() => {
    if (filteredPokemon.length > 0) {
      const start = Math.max(0, selectedIndex - 8);
      const end = Math.min(filteredPokemon.length - 1, selectedIndex + 14);
      const ids = filteredPokemon.slice(start, end + 1).map(p => p.id);
      if (ids.length > 0) {
        loadTypesForRange(allPokemon, Math.min(...ids), Math.max(...ids));
      }
    }
  }, [selectedIndex, filteredPokemon]);

  useEffect(() => {
    if (listRef.current && filteredPokemon.length > 0 && selectedIndex < filteredPokemon.length) {
      try {
        listRef.current.scrollToIndex({ index: selectedIndex, animated: true, viewPosition: 0.35 });
      } catch {}
    }
  }, [selectedIndex]);

  // ── Game Boy button handlers (always-fresh via ref,
  //    re-registered whenever this screen gains focus) ──
  const actionsRef = useRef({});
  actionsRef.current = {
    onUp: () => setSelectedIndex(prev => Math.max(0, prev - 1)),
    onDown: () => setSelectedIndex(prev => Math.min(filteredPokemon.length - 1, prev + 1)),
    onLeft: () => {
      setGenIndex(prev => (prev - 1 + GENERATIONS.length) % GENERATIONS.length);
      setSelectedIndex(0);
    },
    onRight: () => {
      setGenIndex(prev => (prev + 1) % GENERATIONS.length);
      setSelectedIndex(0);
    },
    onA: () => {
      if (selectedPokemon) {
        navigation.navigate('Detail', {
          pokemonId: selectedPokemon.id,
          pokemonName: selectedPokemon.name,
          types: pokemonTypes[selectedPokemon.id] || [],
        });
      }
    },
    onB: () => {
      if (searchActive) {
        setSearchActive(false);
        setSearchText('');
      }
    },
    onStart: () => {
      setSearchActive(prev => !prev);
      setSearchText('');
    },
    onSelect: () => {
      setGenIndex(prev => (prev + 1) % GENERATIONS.length);
      setSelectedIndex(0);
    },
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

  const handlePokemonPress = useCallback((index) => {
    playSfx('blip');
    setSelectedIndex(index);
  }, []);

  const handlePokemonOpen = useCallback((pokemon) => {
    playSfx('confirm');
    navigation.navigate('Detail', {
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
      types: pokemonTypes[pokemon.id] || [],
    });
  }, [navigation, pokemonTypes]);

  const renderItem = useCallback(({ item, index }) => {
    const isSelected = index === selectedIndex;
    return (
      <TouchableOpacity
        style={[styles.listItem, isSelected && styles.listItemSelected]}
        onPress={() => handlePokemonPress(index)}
        onLongPress={() => handlePokemonOpen(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.listNumber, isSelected && styles.listNumberSelected]}>
          {String(item.id).padStart(3, '0')}
        </Text>
        <Image
          source={{ uri: PIXEL_SPRITE(item.id) }}
          style={styles.listSprite}
          resizeMode="contain"
        />
        <Text
          style={[styles.listName, isSelected && styles.listTextSelected]}
          numberOfLines={1}
        >
          {formatPokemonName(item.name).toUpperCase()}
        </Text>
        {isSelected && <Text style={styles.cursor}>◄</Text>}
      </TouchableOpacity>
    );
  }, [selectedIndex, handlePokemonPress, handlePokemonOpen]);

  const keyExtractor = useCallback((item) => String(item.id), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={SCREEN.phosphor} />
        <Text style={styles.loadingText}>CARGANDO DATOS...</Text>
      </View>
    );
  }

  const gen = GENERATIONS[genIndex];
  const selTypes = selectedPokemon ? (pokemonTypes[selectedPokemon.id] || []) : [];
  const typeColor = selTypes.length ? (TYPE_COLORS[selTypes[0]] || SCREEN.phosphor) : SCREEN.border;

  return (
    <View style={styles.container}>
      {/* ─── Status bar ─── */}
      <View style={styles.statusBar}>
        <Text style={styles.statusTitle}>POKéDEX</Text>
        <View style={styles.statusRight}>
          <Text style={styles.statusGen}>{gen.label.toUpperCase()}</Text>
          <Text style={styles.statusCount}>{filteredPokemon.length}</Text>
        </View>
      </View>

      {/* ─── Search bar ─── */}
      {searchActive && (
        <View style={styles.searchBar}>
          <Text style={styles.searchLabel}>&gt;</Text>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="buscar nombre o numero_"
            placeholderTextColor={SCREEN.textMuted}
            selectionColor={SCREEN.phosphor}
          />
        </View>
      )}

      {/* ─── Main: showcase + list ─── */}
      <View style={styles.mainContent}>
        {/* Left: showcase */}
        <View style={styles.showcase}>
          <View style={[styles.showcaseFrame, { borderColor: typeColor }]}>
            <View style={[styles.showcaseGlow, { backgroundColor: typeColor }]} />
            {selectedPokemon && (
              <Image
                source={{ uri: selectedPokemon.artwork }}
                style={styles.showcaseImage}
                resizeMode="contain"
              />
            )}
            {/* frame corner ticks */}
            <View style={[styles.tick, styles.tickTL]} />
            <View style={[styles.tick, styles.tickTR]} />
            <View style={[styles.tick, styles.tickBL]} />
            <View style={[styles.tick, styles.tickBR]} />
          </View>
          <Text style={styles.showcaseId}>
            #{selectedPokemon ? String(selectedPokemon.id).padStart(3, '0') : '---'}
          </Text>
          <Text style={styles.showcaseName} numberOfLines={1}>
            {selectedPokemon ? formatPokemonName(selectedPokemon.name).toUpperCase() : ''}
          </Text>
          <View style={styles.showcaseTypes}>
            {selTypes.map(t => (
              <View key={t} style={[styles.typePip, { backgroundColor: TYPE_COLORS[t] || SCREEN.border }]}>
                <Text style={styles.typePipText}>{t.slice(0, 3).toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Right: list */}
        <View style={styles.listPanel}>
          <FlatList
            ref={listRef}
            data={filteredPokemon}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            initialNumToRender={14}
            maxToRenderPerBatch={16}
            windowSize={8}
            getItemLayout={(_, index) => ({
              length: ROW_HEIGHT,
              offset: ROW_HEIGHT * index,
              index,
            })}
            onScrollToIndexFailed={() => {}}
          />
        </View>
      </View>

      {/* ─── Footer hints ─── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>A:VER</Text>
        <Text style={styles.footerText}>◄►:GEN</Text>
        <Text style={styles.footerText}>START:BUSCAR</Text>
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

  // Status bar
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SCREEN.panelDark,
    borderBottomWidth: 1,
    borderBottomColor: SCREEN.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusTitle: {
    fontFamily: THEME.pixelFont,
    fontSize: 8,
    color: SCREEN.phosphor,
    textShadowColor: 'rgba(123,226,91,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  statusRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusGen: {
    fontFamily: THEME.pixelFont,
    fontSize: 6,
    color: SCREEN.textDim,
  },
  statusCount: {
    fontFamily: THEME.pixelFont,
    fontSize: 7,
    color: SCREEN.gold,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SCREEN.panelDark,
    borderBottomWidth: 1,
    borderBottomColor: SCREEN.phosphorDim,
    paddingHorizontal: 8,
    gap: 6,
  },
  searchLabel: {
    fontFamily: THEME.termFont,
    fontSize: 16,
    color: SCREEN.phosphor,
  },
  searchInput: {
    flex: 1,
    fontFamily: THEME.termFont,
    fontSize: 16,
    color: SCREEN.phosphor,
    paddingVertical: 3,
    ...(typeof document !== 'undefined' ? { outlineStyle: 'none' } : {}),
  },

  // Main
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },

  // Showcase (left)
  showcase: {
    width: '42%',
    borderRightWidth: 1,
    borderRightColor: SCREEN.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    backgroundColor: SCREEN.panelDark,
  },
  showcaseFrame: {
    width: '94%',
    aspectRatio: 1,
    borderWidth: 1,
    backgroundColor: SCREEN.panel,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  showcaseGlow: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderRadius: 999,
    opacity: 0.16,
  },
  showcaseImage: {
    width: '86%',
    height: '86%',
  },
  tick: { position: 'absolute', width: 6, height: 6, borderColor: SCREEN.phosphor },
  tickTL: { top: 2, left: 2, borderTopWidth: 2, borderLeftWidth: 2 },
  tickTR: { top: 2, right: 2, borderTopWidth: 2, borderRightWidth: 2 },
  tickBL: { bottom: 2, left: 2, borderBottomWidth: 2, borderLeftWidth: 2 },
  tickBR: { bottom: 2, right: 2, borderBottomWidth: 2, borderRightWidth: 2 },
  showcaseId: {
    fontFamily: THEME.pixelFont,
    fontSize: 8,
    color: SCREEN.gold,
    marginTop: 6,
  },
  showcaseName: {
    fontFamily: THEME.termFont,
    fontSize: 16,
    letterSpacing: 1,
    color: SCREEN.text,
    marginTop: 3,
  },
  showcaseTypes: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 5,
    minHeight: 12,
  },
  typePip: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  typePipText: {
    fontFamily: THEME.pixelFont,
    fontSize: 5,
    color: '#FFF',
  },

  // List (right)
  listPanel: {
    flex: 1,
    backgroundColor: SCREEN.bg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    height: ROW_HEIGHT,
    gap: 5,
  },
  listItemSelected: {
    backgroundColor: SCREEN.phosphorDark,
    borderLeftWidth: 2,
    borderLeftColor: SCREEN.phosphor,
  },
  listNumber: {
    fontFamily: THEME.termFont,
    fontSize: 15,
    color: SCREEN.textMuted,
    width: 30,
  },
  listNumberSelected: {
    color: SCREEN.gold,
  },
  listSprite: {
    width: 22,
    height: 22,
  },
  listName: {
    fontFamily: THEME.termFont,
    fontSize: 17,
    letterSpacing: 0.5,
    color: SCREEN.text,
    flex: 1,
  },
  listTextSelected: {
    color: SCREEN.phosphor,
    textShadowColor: 'rgba(123,226,91,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  cursor: {
    fontFamily: THEME.pixelFont,
    fontSize: 7,
    color: SCREEN.phosphor,
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
