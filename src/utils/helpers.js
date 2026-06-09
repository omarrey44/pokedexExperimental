/**
 * Capitalize the first letter of a string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format Pokémon name (handle hyphens, special names)
 */
export function formatPokemonName(name) {
  if (!name) return '';
  return name
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Format Pokémon ID with leading zeros (e.g., #001, #025, #1025)
 */
export function formatPokemonId(id) {
  return `#${String(id).padStart(3, '0')}`;
}

/**
 * Format stat name to shorter display version
 */
export function formatStatName(statName) {
  const map = {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SP.ATK',
    'special-defense': 'SP.DEF',
    'speed': 'SPD',
  };
  return map[statName] || statName.toUpperCase();
}

/**
 * Get stat max value for percentage calculation
 * Max base stat in the games is 255 (Blissey HP)
 */
export function getStatPercentage(value) {
  return Math.min(value / 255, 1);
}

/**
 * Format height (meters) with unit
 */
export function formatHeight(meters) {
  return `${meters.toFixed(1)} m`;
}

/**
 * Format weight (kg) with unit
 */
export function formatWeight(kg) {
  return `${kg.toFixed(1)} kg`;
}

/**
 * Format ability name
 */
export function formatAbilityName(name) {
  return name
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
}
