const BASE_URL = 'https://pokeapi.co/api/v2';
const ARTWORK_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// Simple in-memory cache
const cache = {};

async function cachedFetch(url) {
  if (cache[url]) return cache[url];
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();
  cache[url] = data;
  return data;
}

/**
 * Fetch the full list of all 1025 Pokémon (name + url only)
 */
export async function fetchAllPokemon() {
  const data = await cachedFetch(`${BASE_URL}/pokemon?limit=1025&offset=0`);
  return data.results.map((pokemon, index) => ({
    id: index + 1,
    name: pokemon.name,
    url: pokemon.url,
    artwork: `${ARTWORK_BASE}/${index + 1}.png`,
  }));
}

/**
 * Fetch detailed data for a single Pokémon by ID
 */
export async function fetchPokemonDetail(id) {
  const data = await cachedFetch(`${BASE_URL}/pokemon/${id}`);
  return {
    id: data.id,
    name: data.name,
    types: data.types.map(t => t.type.name),
    stats: data.stats.map(s => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    height: data.height / 10,  // Convert to meters
    weight: data.weight / 10,  // Convert to kg
    abilities: data.abilities.map(a => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
    sprites: {
      front: data.sprites.front_default,
      artwork: data.sprites.other?.['official-artwork']?.front_default 
        || `${ARTWORK_BASE}/${data.id}.png`,
    },
    baseExperience: data.base_experience,
  };
}

/**
 * Fetch species data (description, generation, legendary status, etc.)
 */
export async function fetchPokemonSpecies(id) {
  const data = await cachedFetch(`${BASE_URL}/pokemon-species/${id}`);
  
  // Find English/Spanish flavor text
  const flavorEntry = data.flavor_text_entries.find(e => e.language.name === 'es')
    || data.flavor_text_entries.find(e => e.language.name === 'en');
  
  return {
    description: flavorEntry 
      ? flavorEntry.flavor_text.replace(/\n|\f|\r/g, ' ').replace(/\s+/g, ' ').trim()
      : 'No description available.',
    generation: data.generation?.name?.replace('generation-', '').toUpperCase() || '?',
    isLegendary: data.is_legendary,
    isMythical: data.is_mythical,
    color: data.color?.name || 'gray',
    captureRate: data.capture_rate,
    habitat: data.habitat?.name || 'Unknown',
  };
}

/**
 * Fetch types for a list of Pokémon IDs (batch, for filtering)
 */
export async function fetchPokemonTypes(ids) {
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const data = await cachedFetch(`${BASE_URL}/pokemon/${id}`);
        return {
          id,
          types: data.types.map(t => t.type.name),
        };
      } catch {
        return { id, types: [] };
      }
    })
  );
  return results;
}

/**
 * Get artwork URL for a Pokémon ID (without API call)
 */
export function getArtworkUrl(id) {
  return `${ARTWORK_BASE}/${id}.png`;
}
