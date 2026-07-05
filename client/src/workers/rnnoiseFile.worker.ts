/// <reference lib="webworker" />
// Offline RNNoise processing for uploaded audio files.
// Runs on a dedicated worker so the WASM frame loop never blocks the UI.
// Uses RnnoiseProcessor directly (denoise + per-frame VAD scores).

// Relative path bypasses the package's `exports` map (which only exposes the
// worklet) and gives us main-thread access to the processor + inlined WASM.
import RnnoiseProcessor, { type IRnnoiseModule } from '../../node_modules/@timephy/rnnoise-wasm/dist/RnnoiseProcessor.js'
import createRNNWasmModuleSync from '../../node_modules/@timephy/rnnoise-wasm/dist/generated/rnnoise-sync.js'

const RNNOISE_SAMPLE_LENGTH = 480

export interface RnnoiseFileRequest {
  id: number
  pcm: Float32Array
  sampleRate: number
  denoise: boolean
}

export interface RnnoiseFileProgress {
  id: number
  type: 'progress'
  progress: number
}

export interface RnnoiseFileResult {
  id: number
  type: 'done'
  denoised: Float32Array
  vad: Float32Array
  sampleRate: number
  frames: number
}

export type RnnoiseFileResponse = RnnoiseFileProgress | RnnoiseFileResult

const processor = new RnnoiseProcessor(createRNNWasmModuleSync() as unknown as IRnnoiseModule)

self.onmessage = (event: MessageEvent<RnnoiseFileRequest>) => {
  const { id, pcm, sampleRate, denoise } = event.data

  if (sampleRate !== 48000) {
    // RnnoiseProcessor only accepts 48k frames; callers must resample first.
    throw new Error(`rnnoise requires 48000 Hz PCM, got ${sampleRate}`)
  }

  const frameCount = Math.ceil(pcm.length / RNNOISE_SAMPLE_LENGTH)
  const denoised = new Float32Array(frameCount * RNNOISE_SAMPLE_LENGTH)
  const vad = new Float32Array(frameCount)
  const frame = new Float32Array(RNNOISE_SAMPLE_LENGTH)

  for (let f = 0; f < frameCount; f++) {
    const start = f * RNNOISE_SAMPLE_LENGTH
    for (let i = 0; i < RNNOISE_SAMPLE_LENGTH; i++) {
      frame[i] = start + i < pcm.length ? pcm[start + i] : 0
    }
    const score = processor.processAudioFrame(frame, denoise)
    denoised.set(frame, start)
    vad[f] = score

    if ((f & 63) === 0) {
      const msg: RnnoiseFileProgress = { id, type: 'progress', progress: f / frameCount }
      ;(self as unknown as Worker).postMessage(msg)
    }
  }

  // Trim trailing padding so output length matches input.
  const trimmed = denoised.subarray(0, pcm.length)

  const result: RnnoiseFileResult = {
    id,
    type: 'done',
    denoised: trimmed,
    vad,
    sampleRate,
    frames: frameCount,
  }
  ;(self as unknown as Worker).postMessage(result, [result.denoised.buffer])
}
