// Generates retro square-wave SFX as WAV files into assets/sfx/
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 22050;

function squareWave(freq, durationSec, volume = 0.5, decay = true) {
  const n = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env = decay ? Math.pow(1 - i / n, 1.5) : 1;
    samples[i] = (Math.sin(2 * Math.PI * freq * t) >= 0 ? 1 : -1) * volume * env;
  }
  return samples;
}

function silence(durationSec) {
  return new Float32Array(Math.floor(SAMPLE_RATE * durationSec));
}

function concat(...arrays) {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Float32Array(total);
  let off = 0;
  for (const a of arrays) { out.set(a, off); off += a.length; }
  return out;
}

function toWav(samples) {
  const n = samples.length;
  const buffer = Buffer.alloc(44 + n * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + n * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);          // PCM
  buffer.writeUInt16LE(1, 22);          // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767))), 44 + i * 2);
  }
  return buffer;
}

const outDir = path.join(__dirname, '..', 'assets', 'sfx');
fs.mkdirSync(outDir, { recursive: true });

// Game Boy style boot "ba-DING"
const boot = concat(
  squareWave(1046.5, 0.07, 0.25, false),
  silence(0.02),
  squareWave(2093, 0.5, 0.25, true),
);
fs.writeFileSync(path.join(outDir, 'boot.wav'), toWav(boot));

// Menu navigation blip
const blip = squareWave(1760, 0.045, 0.18, true);
fs.writeFileSync(path.join(outDir, 'blip.wav'), toWav(blip));

// Confirm (A button) — quick rising two-tone
const confirm = concat(
  squareWave(1318.5, 0.05, 0.2, false),
  squareWave(1976, 0.09, 0.2, true),
);
fs.writeFileSync(path.join(outDir, 'confirm.wav'), toWav(confirm));

// Cancel (B button) — falling tone
const cancel = concat(
  squareWave(988, 0.05, 0.2, false),
  squareWave(659, 0.09, 0.2, true),
);
fs.writeFileSync(path.join(outDir, 'cancel.wav'), toWav(cancel));

console.log('SFX written to', outDir);
