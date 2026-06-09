import React, { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, Platform,
} from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import { DEVICE, SCREEN, THEME } from './src/constants/colors';
import { GameBoyProvider, useGameBoy } from './src/context/GameBoyContext';
import ScreenFX from './src/components/ScreenFX';
import BootScreen from './src/components/BootScreen';
import { playSfx, buzz } from './src/utils/sound';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();
const { width: W } = Dimensions.get('window');

// ─── D-PAD ────────────────────────────────────────────
function DPad() {
  const { pressButton } = useGameBoy();
  const SIZE = Math.min(W * 0.30, 118);
  const ARM = SIZE * 0.34;

  const press = (btn) => {
    playSfx('blip');
    buzz('light');
    pressButton(btn);
  };

  return (
    <View style={[dpadStyles.container, { width: SIZE, height: SIZE }]}>
      <View style={[dpadStyles.arm, { width: ARM, height: SIZE, borderRadius: 5 }]} />
      <View style={[dpadStyles.arm, { width: SIZE, height: ARM, borderRadius: 5 }]} />
      {/* glossy center dish */}
      <View style={[dpadStyles.center, {
        width: ARM * 0.62, height: ARM * 0.62, borderRadius: ARM * 0.31,
      }]} />
      {/* direction nubs */}
      <Text style={[dpadStyles.nub, { top: 5 }]}>▲</Text>
      <Text style={[dpadStyles.nub, { bottom: 5 }]}>▼</Text>
      <Text style={[dpadStyles.nub, { left: 7 }]}>◀</Text>
      <Text style={[dpadStyles.nub, { right: 7 }]}>▶</Text>

      <TouchableOpacity
        style={[dpadStyles.touch, { top: 0, width: ARM, height: SIZE * 0.4, alignSelf: 'center' }]}
        onPress={() => press('onUp')} activeOpacity={0.5}
      />
      <TouchableOpacity
        style={[dpadStyles.touch, { bottom: 0, width: ARM, height: SIZE * 0.4, alignSelf: 'center' }]}
        onPress={() => press('onDown')} activeOpacity={0.5}
      />
      <TouchableOpacity
        style={[dpadStyles.touch, dpadStyles.touchSide, { left: 0, width: SIZE * 0.4, height: ARM }]}
        onPress={() => press('onLeft')} activeOpacity={0.5}
      />
      <TouchableOpacity
        style={[dpadStyles.touch, dpadStyles.touchSide, { right: 0, width: SIZE * 0.4, height: ARM }]}
        onPress={() => press('onRight')} activeOpacity={0.5}
      />
    </View>
  );
}

const dpadStyles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  arm: {
    position: 'absolute',
    backgroundColor: DEVICE.dpad,
    borderBottomWidth: 3,
    borderRightWidth: 2,
    borderColor: 'rgba(0,0,0,0.45)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  center: {
    position: 'absolute',
    backgroundColor: DEVICE.dpadLight,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.35)',
    zIndex: 2,
  },
  nub: {
    position: 'absolute',
    color: 'rgba(255,255,255,0.18)',
    fontSize: 9,
    zIndex: 3,
  },
  touch: { position: 'absolute', zIndex: 10 },
  touchSide: { top: '50%', marginTop: -20, height: 40 },
});

// ─── A / B BUTTONS ────────────────────────────────────
function ABButtons() {
  const { pressButton } = useGameBoy();
  const BTN = Math.min(W * 0.125, 50);

  const press = (btn) => {
    playSfx(btn === 'onA' ? 'confirm' : 'cancel');
    buzz(btn === 'onA' ? 'medium' : 'light');
    pressButton(btn);
  };

  return (
    <View style={abStyles.slope}>
      <View style={abStyles.group}>
        <View style={abStyles.btnWrap}>
          <TouchableOpacity
            style={[abStyles.button, { width: BTN, height: BTN, borderRadius: BTN / 2 }]}
            onPress={() => press('onB')} activeOpacity={0.65}
          >
            <View style={[abStyles.shine, { width: BTN * 0.34, height: BTN * 0.18, borderRadius: BTN }]} />
          </TouchableOpacity>
          <Text style={abStyles.label}>B</Text>
        </View>
        <View style={[abStyles.btnWrap, { marginTop: -26 }]}>
          <TouchableOpacity
            style={[abStyles.button, { width: BTN, height: BTN, borderRadius: BTN / 2 }]}
            onPress={() => press('onA')} activeOpacity={0.65}
          >
            <View style={[abStyles.shine, { width: BTN * 0.34, height: BTN * 0.18, borderRadius: BTN }]} />
          </TouchableOpacity>
          <Text style={abStyles.label}>A</Text>
        </View>
      </View>
    </View>
  );
}

const abStyles = StyleSheet.create({
  slope: { transform: [{ rotate: '-22deg' }] },
  group: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  btnWrap: { alignItems: 'center' },
  button: {
    backgroundColor: DEVICE.buttonAB,
    borderBottomWidth: 4,
    borderRightWidth: 2,
    borderColor: DEVICE.buttonABDark,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: '14%',
    left: '18%',
    backgroundColor: 'rgba(255,255,255,0.30)',
    transform: [{ rotate: '-18deg' }],
  },
  label: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: DEVICE.label,
    marginTop: 6,
  },
});

// ─── START / SELECT ──────────────────────────────────
function StartSelectButtons() {
  const { pressButton } = useGameBoy();

  const press = (btn) => {
    playSfx('blip');
    buzz('light');
    pressButton(btn);
  };

  return (
    <View style={ssStyles.container}>
      <TouchableOpacity style={ssStyles.button} onPress={() => press('onSelect')} activeOpacity={0.6}>
        <View style={ssStyles.pillSocket}><View style={ssStyles.pill} /></View>
        <Text style={ssStyles.label}>SELECT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={ssStyles.button} onPress={() => press('onStart')} activeOpacity={0.6}>
        <View style={ssStyles.pillSocket}><View style={ssStyles.pill} /></View>
        <Text style={ssStyles.label}>START</Text>
      </TouchableOpacity>
    </View>
  );
}

const ssStyles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', gap: 26, marginTop: 6 },
  button: { alignItems: 'center' },
  pillSocket: {
    width: 44, height: 14, borderRadius: 7,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '-25deg' }],
  },
  pill: {
    width: 36, height: 9, borderRadius: 5,
    backgroundColor: DEVICE.pill,
    borderBottomWidth: 2,
    borderColor: DEVICE.pillDark,
  },
  label: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: DEVICE.label,
    marginTop: 5,
  },
});

// ─── SPEAKER (diagonal slots) ────────────────────────
function SpeakerGrille() {
  return (
    <View style={speakerStyles.container}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={speakerStyles.slot} />
      ))}
    </View>
  );
}

const speakerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 7,
    transform: [{ rotate: '-25deg' }],
    paddingRight: 6,
  },
  slot: {
    width: 8,
    height: 54,
    borderRadius: 4,
    backgroundColor: DEVICE.bodyDark,
    borderTopWidth: 2,
    borderColor: 'rgba(0,0,0,0.25)',
  },
});

// ─── MAIN APP ─────────────────────────────────────────
export default function App() {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular, VT323_400Regular });
  const [booted, setBooted] = useState(false);
  const navigationRef = useNavigationContainerRef();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GameBoyProvider>
      <View style={styles.root} onLayout={onLayoutRootView}>
        <StatusBar style="light" />

        {/* ═══ DMG SHELL ═══ */}
        <LinearGradient
          colors={[DEVICE.bodyLight, DEVICE.body, DEVICE.bodyDark]}
          locations={[0, 0.25, 1]}
          style={styles.body}
        >
          {/* top groove lines */}
          <View style={styles.grooves}>
            <View style={styles.groove} />
            <View style={styles.groove} />
          </View>

          {/* ─── Screen bezel ─── */}
          <View style={styles.bezel}>
            {/* stripes + DOT MATRIX text */}
            <View style={styles.stripeRow}>
              <View style={styles.stripeGroup}>
                <View style={[styles.stripe, { backgroundColor: DEVICE.stripeMagenta }]} />
                <View style={[styles.stripe, { backgroundColor: DEVICE.stripeNavy }]} />
              </View>
              <Text style={styles.dotMatrixText}>DOT MATRIX WITH STEREO SOUND</Text>
              <View style={styles.stripeGroup}>
                <View style={[styles.stripe, { backgroundColor: DEVICE.stripeMagenta }]} />
                <View style={[styles.stripe, { backgroundColor: DEVICE.stripeNavy }]} />
              </View>
            </View>

            <View style={styles.bezelMain}>
              {/* battery LED */}
              <View style={styles.batteryCol}>
                <View style={styles.led} />
                <Text style={styles.batteryLabel}>BATTERY</Text>
              </View>

              {/* the display */}
              <View style={styles.screenOuter}>
                <View style={styles.screenContent}>
                  <NavigationContainer
                    ref={navigationRef}
                    theme={{
                      dark: true,
                      colors: {
                        primary: SCREEN.phosphor,
                        background: SCREEN.bg,
                        card: SCREEN.bg,
                        text: SCREEN.text,
                        border: 'transparent',
                        notification: SCREEN.phosphor,
                      },
                      fonts: {
                        regular: { fontFamily: 'System', fontWeight: '400' },
                        medium: { fontFamily: 'System', fontWeight: '500' },
                        bold: { fontFamily: 'System', fontWeight: '700' },
                        heavy: { fontFamily: 'System', fontWeight: '900' },
                      },
                    }}
                  >
                    <Stack.Navigator
                      screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: SCREEN.bg },
                        animation: 'fade',
                        animationDuration: 150,
                      }}
                    >
                      <Stack.Screen name="Home" component={HomeScreen} />
                      <Stack.Screen name="Detail" component={DetailScreen} />
                    </Stack.Navigator>
                  </NavigationContainer>

                  {!booted && <BootScreen onFinish={() => setBooted(true)} />}
                  <ScreenFX />
                </View>
              </View>
            </View>
          </View>

          {/* ─── Logo ─── */}
          <View style={styles.labelRow}>
            <Text style={styles.labelLogo}>POKéDEX</Text>
            <Text style={styles.labelClassic}>CLASSIC™</Text>
          </View>

          {/* ─── Controls ─── */}
          <View style={styles.controlsArea}>
            <View style={styles.controls}>
              <DPad />
              <ABButtons />
            </View>
            <StartSelectButtons />
          </View>

          {/* ─── Speaker ─── */}
          <View style={styles.bottomRow}>
            <View style={{ flex: 1 }} />
            <SpeakerGrille />
          </View>
        </LinearGradient>
      </View>
    </GameBoyProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#15161A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: '100%',
    maxWidth: 410,
    flex: 1,
    ...(Platform.OS === 'web' ? { maxHeight: 770 } : {}),
    borderRadius: Platform.OS === 'web' ? 14 : 0,
    borderBottomRightRadius: Platform.OS === 'web' ? 56 : 0,
    overflow: 'hidden',
    paddingTop: Platform.OS === 'web' ? 14 : 48,
    paddingBottom: Platform.OS === 'web' ? 18 : 24,
    paddingHorizontal: 14,
  },

  grooves: {
    gap: 3,
    marginBottom: 10,
  },
  groove: {
    height: 2,
    borderRadius: 1,
    backgroundColor: DEVICE.groove,
    opacity: 0.55,
  },

  // Bezel
  bezel: {
    backgroundColor: DEVICE.bezel,
    borderRadius: 10,
    borderBottomRightRadius: 34,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: DEVICE.bezelDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  stripeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  stripeGroup: { flex: 1, gap: 3 },
  stripe: { height: 3, borderRadius: 1 },
  dotMatrixText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 5,
    color: DEVICE.bezelText,
    letterSpacing: 0.5,
  },
  bezelMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryCol: {
    width: 34,
    alignItems: 'center',
    gap: 5,
  },
  led: {
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: DEVICE.led,
    shadowColor: DEVICE.led,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  batteryLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 4,
    color: DEVICE.bezelText,
  },
  screenOuter: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1C1E24',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  screenContent: {
    backgroundColor: SCREEN.bg,
    aspectRatio: 10 / 9,
    overflow: 'hidden',
  },

  // Logo
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
    marginBottom: 2,
    paddingLeft: 10,
    gap: 8,
  },
  labelLogo: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 13,
    color: DEVICE.logoNavy,
    letterSpacing: 1,
  },
  labelClassic: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: DEVICE.logoMaroon,
    letterSpacing: 1,
  },

  // Controls
  controlsArea: {
    flex: 1,
    justifyContent: 'center',
    gap: 26,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    marginTop: 6,
    minHeight: 48,
  },
});
