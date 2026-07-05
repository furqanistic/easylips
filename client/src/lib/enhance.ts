// Voice enhancement chain applied to RNNoise output, rendered offline with the
// Web Audio API so it stays 100% local and sample-accurate.
//
// Chain: source -> high-pass (rumble) -> compressor (even out voice)
//        -> gain (boost) -> destination, then optional peak normalize.

export interface EnhanceSettings {
  boostDb: number       // make-up gain in dB (0 = unity)
  rumbleHz: number      // high-pass cutoff; 0 disables the filter
  compress: boolean     // speech compressor on/off
  normalize: boolean    // peak-normalize to ~0.95 to avoid clipping
}

export const DEFAULT_ENHANCE: EnhanceSettings = {
  boostDb: 6,
  rumbleHz: 80,
  compress: true,
  normalize: false,
}

const SAMPLE_RATE = 48000
// Tail padding so the compressor has room to release; trimmed from output.
const TAIL = 2048

export async function enhancePcm(pcm: Float32Array, settings: EnhanceSettings): Promise<Float32Array> {
  const length = pcm.length + TAIL
  const offline = new OfflineAudioContext(1, length, SAMPLE_RATE)

  const buffer = offline.createBuffer(1, length, SAMPLE_RATE)
  const channel = buffer.getChannelData(0)
  channel.set(pcm, 0) // remaining samples are zero (tail)

  const src = offline.createBufferSource()
  src.buffer = buffer

  let node: AudioNode = src

  if (settings.rumbleHz > 0) {
    const hp = offline.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = settings.rumbleHz
    hp.Q.value = 0.707
    node.connect(hp)
    node = hp
  }

  if (settings.compress) {
    const comp = offline.createDynamicsCompressor()
    comp.threshold.value = -24
    comp.knee.value = 30
    comp.ratio.value = 3
    comp.attack.value = 0.003
    comp.release.value = 0.25
    node.connect(comp)
    node = comp
  }

  const gain = offline.createGain()
  gain.gain.value = dbToLinear(settings.boostDb)
  node.connect(gain)
  gain.connect(offline.destination)

  src.start()
  const rendered = await offline.startRendering()
  const out = rendered.getChannelData(0).slice(0, pcm.length)

  let peak = 0
  for (let i = 0; i < out.length; i++) {
    const a = Math.abs(out[i])
    if (a > peak) peak = a
  }

  if (settings.normalize) {
    const target = 0.95
    if (peak > 1e-6) {
      const s = target / peak
      for (let i = 0; i < out.length; i++) out[i] *= s
    }
  } else if (peak > 1) {
    // Clipping protection when boosting.
    const s = 1 / peak
    for (let i = 0; i < out.length; i++) out[i] *= s
  }

  return out
}

function dbToLinear(db: number): number {
  return Math.pow(10, db / 20)
}
