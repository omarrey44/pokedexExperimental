// Retro SFX + Pokémon cries (expo-audio) and button haptics.
import { Platform } from 'react-native';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';

const SFX_SOURCES = {
  boot:    require('../../assets/sfx/boot.wav'),
  blip:    require('../../assets/sfx/blip.wav'),
  confirm: require('../../assets/sfx/confirm.wav'),
  cancel:  require('../../assets/sfx/cancel.wav'),
};

const players = {};
let muted = false;

setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

export function setMuted(value) { muted = value; }
export function isMuted() { return muted; }

export function playSfx(name) {
  if (muted) return;
  try {
    if (!players[name]) players[name] = createAudioPlayer(SFX_SOURCES[name]);
    players[name].seekTo(0);
    players[name].play();
  } catch {}
}

const CRY_URL = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

let cryPlayer = null;

export function playCry(id) {
  if (muted) return;
  try {
    if (cryPlayer) { cryPlayer.remove(); cryPlayer = null; }
    cryPlayer = createAudioPlayer({ uri: CRY_URL(id) });
    cryPlayer.volume = 0.6;
    cryPlayer.play();
  } catch {}
}

export function buzz(style = 'light') {
  if (Platform.OS === 'web') return;
  try {
    const map = {
      light:  Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy:  Haptics.ImpactFeedbackStyle.Heavy,
    };
    Haptics.impactAsync(map[style] || map.light);
  } catch {}
}
