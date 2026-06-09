// ═══════════════════════════════════════════════════════
//  DMG RESTOMOD POKÉDEX — COLOR SYSTEM
//  Classic Game Boy (DMG-01) shell + modern green-phosphor
//  display, like a restored console with custom firmware.
// ═══════════════════════════════════════════════════════

// Classic DMG shell (warm greige plastic)
export const DEVICE = {
  body:        '#C9C3B8',   // main shell plastic
  bodyLight:   '#DDD7CC',   // top highlight
  bodyDark:    '#A8A296',   // bottom shading
  groove:      '#8F897D',   // top groove lines
  bezel:       '#494B55',   // screen surround panel
  bezelDark:   '#33353D',   // bezel edge
  bezelText:   '#B9BBC4',   // "DOT MATRIX" text
  stripeMagenta:'#A02D5E',  // classic bezel stripe
  stripeNavy:  '#27409B',   // classic bezel stripe
  dpad:        '#2D2D33',   // d-pad plastic
  dpadLight:   '#45454D',
  buttonAB:    '#962D62',   // magenta A/B buttons
  buttonABDark:'#6E1F47',
  pill:        '#8E8878',   // start/select pills
  pillDark:    '#6E6858',
  label:       '#5A6A9E',   // engraved blue-gray labels
  logoNavy:    '#233B8E',   // logo text
  logoMaroon:  '#8B1F4B',   // logo accent
  led:         '#FF3B30',   // battery LED

  // Legacy aliases (still referenced by older components)
  red:         '#962D62',
  darkRed:     '#6E1F47',
  deepRed:     '#5A6A9E',
  cream:       '#DDD7CC',
  darkGray:    '#2D2D33',
  medGray:     '#45454D',
  lightGray:   '#8F897D',
  bezelGray:   '#494B55',
};

// Modern display: dark slate with green-phosphor accent
// (think backlit IPS mod running custom firmware)
export const SCREEN = {
  bg:          '#0A0E0B',   // near-black with green tint
  panelDark:   '#0E130F',
  panel:       '#131A14',   // raised panels
  panelLight:  '#1B241C',
  border:      '#27332A',   // panel borders
  phosphor:    '#7BE25B',   // bright green accent
  phosphorDim: '#4E9440',   // muted green
  phosphorDark:'#1E3A1E',   // selected row bg
  text:        '#DCE9D6',   // warm off-white
  textDim:     '#7E927B',   // dimmed text
  textMuted:   '#4A5A48',
  gold:        '#F2C14E',   // counters / highlights
  alert:       '#FF6B57',   // warnings / legendary

  // Legacy aliases
  bgLight:     '#131A14',
  spriteBg:    '#0E130F',
  spriteDark:  '#131A14',
  selected:    '#1E3A1E',
  listBg:      '#0A0E0B',
  barDark:     '#0E130F',
  barLight:    '#1B241C',
  textGold:    '#F2C14E',
  dot:         '#7BE25B',
};

// Shared theme tokens for components
export const THEME = {
  background:    SCREEN.bg,
  surface:       SCREEN.panel,
  surfaceLight:  SCREEN.panelLight,
  card:          SCREEN.panel,
  cardBorder:    SCREEN.border,
  textPrimary:   SCREEN.text,
  textSecondary: SCREEN.textDim,
  textMuted:     SCREEN.textMuted,
  accent:        SCREEN.phosphor,
  searchBg:      SCREEN.panelDark,
  searchBorder:  SCREEN.border,
  screenFrame:   '#1A1D22',
  pixelFont:     'PressStart2P_400Regular',
  termFont:      'VT323_400Regular',
};

// Original DMG LCD palette (used for retro flourishes)
export const GB = {
  lightest: '#C4CFA1',
  light:    '#8B956D',
  dark:     '#4A5234',
  darkest:  '#1A1C0E',
};

// Pokémon type colors
export const TYPE_COLORS = {
  normal:   '#A8A878',
  fire:     '#F08030',
  water:    '#6890F0',
  electric: '#F8D030',
  grass:    '#78C850',
  ice:      '#98D8D8',
  fighting: '#C03028',
  poison:   '#A040A0',
  ground:   '#E0C068',
  flying:   '#A890F0',
  psychic:  '#F85888',
  bug:      '#A8B820',
  rock:     '#B8A038',
  ghost:    '#705898',
  dragon:   '#7038F8',
  dark:     '#705848',
  steel:    '#B8B8D0',
  fairy:    '#EE99AC',
};

export const TYPE_GRADIENTS = {
  normal:   ['#6A6A4C', '#A8A878', '#C8C8A0'],
  fire:     ['#902010', '#F08030', '#F0A060'],
  water:    ['#284888', '#6890F0', '#90B0F0'],
  electric: ['#988010', '#F8D030', '#F8E070'],
  grass:    ['#386828', '#78C850', '#98E878'],
  ice:      ['#487888', '#98D8D8', '#B8F0F0'],
  fighting: ['#801818', '#C03028', '#E05048'],
  poison:   ['#602060', '#A040A0', '#C060C0'],
  ground:   ['#987028', '#E0C068', '#F0D890'],
  flying:   ['#5868A8', '#A890F0', '#C0B0F0'],
  psychic:  ['#A83058', '#F85888', '#F888A8'],
  bug:      ['#587010', '#A8B820', '#C8D850'],
  rock:     ['#786830', '#B8A038', '#D8C060'],
  ghost:    ['#303058', '#705898', '#9078B8'],
  dragon:   ['#3018C0', '#7038F8', '#9060F8'],
  dark:     ['#302828', '#705848', '#907868'],
  steel:    ['#606878', '#B8B8D0', '#D0D0E8'],
  fairy:    ['#A06878', '#EE99AC', '#F0B8C8'],
};
