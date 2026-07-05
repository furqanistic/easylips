import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { RNNOISE_SAMPLE_RATE } from '@/lib/rnnoise'
import { downmixToMono, encodePcmToWav, rms } from '@/lib/wav'
import { enhancePcm, DEFAULT_ENHANCE, type EnhanceSettings } from '@/lib/enhance'
import { useSeo } from '@/lib/seo'
import { Navbar } from '@/components/landing'
import type { RnnoiseFileResponse } from '../../workers/rnnoiseFile.worker'

const RED = '#ff1f2e'
const RED_DEEP = '#ea0a1a'
const GREEN = '#34d399'

interface AudioSource {
  name: string
  url: string
  blob: Blob
}

type Stage = 'idle' | 'processing' | 'done'

export function NoiseRemoverPage() {
  // The blog page is the canonical, indexable entry; the interactive tool is
  // a utility route that should not compete with it in search.
  useSeo({
    title: 'Noise Remover Tool — OneLingo',
    description: 'Free in-browser noise remover tool. Upload or record audio and remove background noise with RNNoise.',
    canonical: 'https://onelingo.app/tools/noise-remover',
    noIndex: true,
  })

  const [source, setSource] = useState<AudioSource | null>(null)
  const [recording, setRecording] = useState(false)
  const [recordSecs, setRecordSecs] = useState(0)
  const [stage, setStage] = useState<Stage>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null)
  const [vad, setVad] = useState<Float32Array | null>(null)
  const [duration, setDuration] = useState(0)
  const [reductionDb, setReductionDb] = useState<number | null>(null)
  const [compare, setCompare] = useState<'original' | 'denoised'>('denoised')

  const [boost, setBoost] = useState(DEFAULT_ENHANCE.boostDb)
  const [rumble, setRumble] = useState(DEFAULT_ENHANCE.rumbleHz)
  const [compress, setCompress] = useState(DEFAULT_ENHANCE.compress)
  const [normalize, setNormalize] = useState(DEFAULT_ENHANCE.normalize)
  const [enhancing, setEnhancing] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const reqIdRef = useRef(0)
  const urlsRef = useRef<string[]>([])
  const denoisedPcmRef = useRef<Float32Array | null>(null)
  const originalPcmRef = useRef<Float32Array | null>(null)

  const trackUrl = useCallback((url: string) => {
    urlsRef.current.push(url)
    return url
  }, [])

  const resetResults = useCallback(() => {
    setStage('idle')
    setProgress(0)
    setVad(null)
    setReductionDb(null)
    setDuration(0)
    setCleanedUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null })
    denoisedPcmRef.current = null
    originalPcmRef.current = null
  }, [])

  const handleSource = useCallback(
    (blob: Blob, name: string) => {
      if (source) URL.revokeObjectURL(source.url)
      const url = trackUrl(URL.createObjectURL(blob))
      setSource({ name, url, blob })
      resetResults()
      setError('')
    },
    [source, trackUrl, resetResults],
  )

  const removeNoise = useCallback(async () => {
    if (!source) return
    setError('')
    setStage('processing')
    setProgress(0)
    setVad(null)
    setReductionDb(null)

    try {
      const arrayBuffer = await source.blob.arrayBuffer()
      const ctx = new AudioContext({ sampleRate: RNNOISE_SAMPLE_RATE })
      const audioBuf = await ctx.decodeAudioData(arrayBuffer)
      ctx.close().catch(() => {})
      const mono = downmixToMono(audioBuf)
      setDuration(mono.length / RNNOISE_SAMPLE_RATE)

      const origUrl = trackUrl(URL.createObjectURL(encodePcmToWav(mono, RNNOISE_SAMPLE_RATE)))
      setOriginalUrl(origUrl)
      originalPcmRef.current = mono

      const id = ++reqIdRef.current
      if (!workerRef.current) {
        workerRef.current = new Worker(new URL('../../workers/rnnoiseFile.worker.ts', import.meta.url), { type: 'module' })
        workerRef.current.onmessage = (e: MessageEvent<RnnoiseFileResponse>) => {
          const msg = e.data
          if (msg.id !== reqIdRef.current) return
          if (msg.type === 'progress') {
            setProgress(msg.progress)
          } else {
            denoisedPcmRef.current = msg.denoised
            setVad(msg.vad)
            const inRms = originalPcmRef.current ? rms(originalPcmRef.current) : 0
            const outRms = rms(msg.denoised)
            setReductionDb(inRms > 0 && outRms > 0 ? 20 * Math.log10(inRms / outRms) : 0)
            setStage('done')
            setCompare('denoised')
            setProgress(1)
          }
        }
      }

      const pcm = mono.slice()
      workerRef.current.postMessage({ id, pcm, sampleRate: RNNOISE_SAMPLE_RATE, denoise: true }, [pcm.buffer])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not process this audio.')
      setStage('idle')
    }
  }, [source, trackUrl])

  const replace = useCallback(() => {
    setSource((prev) => {
      if (prev) URL.revokeObjectURL(prev.url)
      return null
    })
    resetResults()
    setError('')
  }, [resetResults])

  useEffect(
    () => () => {
      workerRef.current?.terminate()
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u))
    },
    [],
  )

  // Re-render the enhanced preview whenever the RNNoise output or enhancer
  // settings change. Debounced so slider drags don't thrash OfflineAudioContext.
  useEffect(() => {
    if (stage !== 'done' || !denoisedPcmRef.current) return
    const pcm = denoisedPcmRef.current
    setEnhancing(true)
    const handle = window.setTimeout(async () => {
      const settings: EnhanceSettings = { boostDb: boost, rumbleHz: rumble, compress, normalize }
      try {
        const enhanced = await enhancePcm(pcm, settings)
        const url = URL.createObjectURL(encodePcmToWav(enhanced, RNNOISE_SAMPLE_RATE))
        urlsRef.current.push(url)
        setCleanedUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url })
      } catch {
        // ignore render failures — keep previous preview
      } finally {
        setEnhancing(false)
      }
    }, 250)
    return () => window.clearTimeout(handle)
  }, [stage, boost, rumble, compress, normalize])

  return (
    <div className="dark relative">
      <div className="grain-overlay" aria-hidden />
      <Navbar />
      <main className="min-h-screen" style={{ background: 'transparent', color: '#fff', paddingTop: '80px' }}>

      <section className="mx-auto w-full max-w-[760px] px-5 pb-28 pt-10 sm:pt-16">
        <div className="mb-10 text-center">
          <Link to="/tools/noise-remover" className="mb-4 inline-block text-xs font-medium no-underline" style={{ color: 'rgba(255,255,255,0.5)' }}>
            ← About this tool
          </Link>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium" style={{ border: '1px solid rgba(234,10,26,0.2)', background: 'rgba(234,10,26,0.06)', color: RED }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: RED, boxShadow: `0 0 8px ${RED}` }} />
            Powered by RNNoise · runs in your browser
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Noise Remover</h1>
          <p className="mx-auto mt-4 max-w-[520px] text-sm leading-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Upload a recording or use your microphone, then remove background noise with one click. Your audio never leaves your device.
          </p>
        </div>

        {/* SOURCE */}
        {!source && !recording && (
          <div className="grid gap-4 sm:grid-cols-2">
            <UploadCard onFile={(f) => handleSource(f, f.name)} />
            <RecordCard onRecordingChange={setRecording} />
          </div>
        )}

        {recording && (
          <RecordingPanel
            secs={recordSecs}
            setSecs={setRecordSecs}
            onComplete={(blob, name) => {
              setRecording(false)
              handleSource(blob, name)
            }}
            onCancel={() => setRecording(false)}
          />
        )}

        {source && (
          <SourceCard source={source} duration={duration} onReplace={replace} />
        )}

        {error && (
          <p className="mt-4 rounded-xl px-4 py-3 text-sm" style={{ color: RED, background: 'rgba(234,10,26,0.08)', border: '1px solid rgba(234,10,26,0.2)' }}>
            {error}
          </p>
        )}

        {/* ACTION */}
        {source && stage !== 'done' && (
          <div className="mt-6">
            <RemoveNoiseButton onClick={removeNoise} processing={stage === 'processing'} progress={progress} />
          </div>
        )}

        {/* RESULTS */}
        {stage === 'done' && cleanedUrl && (
          <div className="mt-8 space-y-5">
            <ComparePlayer
              compare={compare}
              onCompare={setCompare}
              originalUrl={originalUrl}
              cleanedUrl={cleanedUrl}
              fileName={source?.name ?? 'audio'}
              enhancing={enhancing}
            />

            <EnhanceCard
              boost={boost}
              rumble={rumble}
              compress={compress}
              normalize={normalize}
              onBoost={setBoost}
              onRumble={setRumble}
              onCompress={setCompress}
              onNormalize={setNormalize}
              enhancing={enhancing}
            />

            <div className="grid grid-cols-2 gap-3">
              <Stat
                label="Noise removed"
                value={reductionDb != null ? `${reductionDb >= 0 ? '+' : ''}${reductionDb.toFixed(1)} dB` : '—'}
                hint={reductionDb != null && reductionDb > 0 ? 'Background attenuated' : 'Minimal change'}
                accent={RED}
              />
              <Stat
                label="Voice detected"
                value={vad ? `${Math.round((voiceShare(vad, 0.5) / vad.length) * 100)}%` : '—'}
                hint="Share of speech frames"
                accent={GREEN}
              />
            </div>

            {vad && <VadTimeline vad={vad} duration={duration} />}

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={cleanedUrl}
                download={`denoised-${(source?.name ?? 'audio').replace(/\.[^.]+$/, '')}.wav`}
                className="inline-flex items-center gap-2 no-underline"
                style={primaryBtnStyle}
              >
                <DownloadIcon /> Download denoised
              </a>
              <button onClick={replace} style={ghostBtnStyle}>Start over</button>
            </div>
          </div>
        )}
      </section>
    </main>
    </div>
  )
}

/* ------------------------------- sub-panels ------------------------------- */

function UploadCard({ onFile }: { onFile: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [drag, setDrag] = useState(false)
  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f) }}
      className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl px-6 py-10 text-center transition"
      style={{
        border: `1.5px dashed ${drag ? RED : 'rgba(255,255,255,0.16)'}`,
        background: drag ? 'rgba(234,10,26,0.06)' : 'rgba(255,255,255,0.02)',
      }}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <UploadIcon />
      </div>
      <p className="text-sm font-semibold">Upload a file</p>
      <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Drag & drop or click · WAV, MP3, M4A, OGG, FLAC</p>
      <input ref={inputRef} type="file" accept="audio/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }} />
    </div>
  )
}

function RecordCard({ onRecordingChange }: { onRecordingChange: (v: boolean) => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl px-6 py-10 text-center" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full" style={{ background: 'rgba(234,10,26,0.08)', border: '1px solid rgba(234,10,26,0.2)' }}>
        <MicIcon />
      </div>
      <p className="text-sm font-semibold">Record from microphone</p>
      <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Capture your voice, then denoise it</p>
      <button
        onClick={() => onRecordingChange(true)}
        className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition"
        style={{ color: '#fff', background: `linear-gradient(135deg, ${RED_DEEP}, ${RED})`, boxShadow: '0 0 18px rgba(234,10,26,0.3)' }}
      >
        <span style={{ width: 7, height: 7, borderRadius: 999, background: '#fff' }} /> Start recording
      </button>
    </div>
  )
}

function RecordingPanel({
  secs,
  setSecs,
  onComplete,
  onCancel,
}: {
  secs: number
  setSecs: (n: number) => void
  onComplete: (blob: Blob, name: string) => void
  onCancel: () => void
}) {
  const [level, setLevel] = useState(0)
  const [error, setError] = useState('')
  const [stopping, setStopping] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return }
        streamRef.current = stream
        const ctx = new AudioContext()
        ctxRef.current = ctx
        const source = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 1024
        source.connect(analyser)
        analyserRef.current = analyser

        chunksRef.current = []
        const rec = new MediaRecorder(stream)
        recorderRef.current = rec
        rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
        rec.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })
          const name = `recording-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.webm`
          cleanup()
          onComplete(blob, name)
        }
        rec.start()

        const buf = new Uint8Array(analyser.fftSize)
        const tick = () => {
          analyser.getByteTimeDomainData(buf)
          setLevel(Math.min(1, rmsByte(buf) * 1.6))
          rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)

        const startedAt = Date.now()
        timerRef.current = window.setInterval(() => setSecs(Math.floor((Date.now() - startedAt) / 1000)), 250)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not access microphone.')
        cleanup()
        onCancel()
      }
    }
    function cleanup() {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      if (timerRef.current != null) clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      ctxRef.current?.close().catch(() => {})
      streamRef.current = null
      ctxRef.current = null
      analyserRef.current = null
      recorderRef.current = null
      rafRef.current = null
      timerRef.current = null
    }
    start()
    return () => { cancelled = true; cleanup() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stop = () => {
    const rec = recorderRef.current
    if (!rec || rec.state === 'inactive') return
    setStopping(true)
    try {
      rec.stop()
    } catch {
      setStopping(false)
    }
  }

  return (
    <div className="rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(234,10,26,0.25)', background: 'rgba(234,10,26,0.04)' }}>
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full" style={{ border: `2px solid ${RED}`, boxShadow: `0 0 24px rgba(234,10,26,0.4)` }}>
        <span className="animate-pulse rounded-full" style={{ width: 22, height: 22, background: RED }} />
      </div>
      <p className="text-sm font-semibold">Recording…</p>
      <p className="mt-1 font-mono text-2xl tabular-nums">{formatSecs(secs)}</p>

      <div className="mx-auto mt-5 h-2 w-full max-w-[280px] overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ width: `${level * 100}%`, height: '100%', background: `linear-gradient(90deg, ${RED_DEEP}, ${RED})`, transition: 'width 0.06s linear' }} />
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={stop}
          disabled={stopping}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition"
          style={{
            color: '#fff',
            background: `linear-gradient(135deg, ${RED_DEEP}, ${RED})`,
            opacity: stopping ? 0.6 : 1,
            cursor: stopping ? 'default' : 'pointer',
          }}
        >
          {stopping ? (
            <Spinner />
          ) : (
            <span style={{ width: 9, height: 9, borderRadius: 2, background: '#fff' }} />
          )}
          {stopping ? 'Stopping…' : 'Stop & use recording'}
        </button>
      </div>
      {error && <p className="mt-3 text-xs" style={{ color: RED }}>{error}</p>}
    </div>
  )
}

function SourceCard({ source, duration, onReplace }: { source: AudioSource; duration: number; onReplace: () => void }) {
  return (
    <div className="rounded-2xl p-5" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{source.name}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{duration ? `${duration.toFixed(1)}s · 48 kHz mono` : 'Ready to denoise'}</p>
        </div>
        <button onClick={onReplace} className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition" style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
          Replace
        </button>
      </div>
      <audio src={source.url} controls className="w-full" style={{ filter: 'invert(1) hue-rotate(180deg)' }} />
    </div>
  )
}

function RemoveNoiseButton({ onClick, processing, progress }: { onClick: () => void; processing: boolean; disabled?: boolean; progress: number }) {
  if (processing) {
    return (
      <div className="rounded-full p-5 text-center" style={{ border: '1px solid rgba(234,10,26,0.25)', background: 'rgba(234,10,26,0.05)' }}>
        <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold">
          <Spinner /> Denoising with RNNoise… {Math.round(progress * 100)}%
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ width: `${Math.max(4, progress * 100)}%`, height: '100%', background: `linear-gradient(90deg, ${RED_DEEP}, ${RED})`, transition: 'width 0.15s linear' }} />
        </div>
      </div>
    )
  }
  return (
    <button onClick={onClick} className="flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-base font-semibold transition" style={primaryBtnStyle}>
      <SparkleIcon /> Remove background noise
    </button>
  )
}

function ComparePlayer({
  compare,
  onCompare,
  originalUrl,
  cleanedUrl,
  fileName,
  enhancing,
}: {
  compare: 'original' | 'denoised'
  onCompare: (v: 'original' | 'denoised') => void
  originalUrl: string | null
  cleanedUrl: string | null
  fileName: string
  enhancing: boolean
}) {
  const src = compare === 'original' ? originalUrl : cleanedUrl
  return (
    <div className="rounded-2xl p-5" style={{ border: '1px solid rgba(234,10,26,0.2)', background: 'rgba(234,10,26,0.03)' }}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-full p-1" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          {(['original', 'denoised'] as const).map((opt) => {
            const active = compare === opt
            return (
              <button
                key={opt}
                onClick={() => onCompare(opt)}
                className="rounded-full px-4 py-1.5 text-xs font-semibold transition"
                style={{
                  color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                  background: active ? (opt === 'denoised' ? `linear-gradient(135deg, ${RED_DEEP}, ${RED})` : 'rgba(255,255,255,0.08)') : 'transparent',
                  boxShadow: active && opt === 'denoised' ? '0 0 16px rgba(234,10,26,0.3)' : 'none',
                }}
              >
                {opt === 'original' ? 'Original' : 'Denoised'}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          {compare === 'denoised' && enhancing && (
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>updating…</span>
          )}
          {compare === 'denoised' && (
            <a href={cleanedUrl ?? '#'} download={`denoised-${fileName.replace(/\.[^.]+$/, '')}.wav`} className="text-xs font-medium no-underline" style={{ color: RED }}>
              Download ↓
            </a>
          )}
        </div>
      </div>
      <audio key={compare + (cleanedUrl ?? '')} src={src ?? undefined} controls className="w-full" style={{ filter: 'invert(1) hue-rotate(180deg)' }} />
    </div>
  )
}

function EnhanceCard({
  boost,
  rumble,
  compress,
  normalize,
  onBoost,
  onRumble,
  onCompress,
  onNormalize,
  enhancing,
}: {
  boost: number
  rumble: number
  compress: boolean
  normalize: boolean
  onBoost: (v: number) => void
  onRumble: (v: number) => void
  onCompress: (v: boolean) => void
  onNormalize: (v: boolean) => void
  enhancing: boolean
}) {
  return (
    <div className="rounded-2xl p-5" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Enhance voice</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Tweak the denoised result — updates the preview live</p>
        </div>
        {enhancing && <Spinner />}
      </div>

      <div className="space-y-4">
        <Slider
          label="Volume boost"
          value={boost}
          min={0}
          max={24}
          step={1}
          unit="dB"
          onChange={onBoost}
        />
        <Slider
          label="Reduce rumble"
          value={rumble}
          min={0}
          max={200}
          step={5}
          unit="Hz"
          onChange={onRumble}
          zeroLabel="off"
        />
        <div className="grid grid-cols-2 gap-3">
          <SwitchRow label="Even out voice" hint="Compressor" checked={compress} onChange={onCompress} />
          <SwitchRow label="Auto-level" hint="Peak normalize" checked={normalize} onChange={onNormalize} />
        </div>
      </div>
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  zeroLabel,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
  zeroLabel?: string
}) {
  const display = value === 0 && zeroLabel ? zeroLabel : `${value} ${unit}`
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
        <span className="font-mono tabular-nums" style={{ color: RED }}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: RED }}
      />
    </div>
  )
}

function SwitchRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-left transition"
      style={{ border: `1px solid ${checked ? 'rgba(234,10,26,0.3)' : 'rgba(255,255,255,0.08)'}`, background: checked ? 'rgba(234,10,26,0.05)' : 'transparent' }}
    >
      <span className="min-w-0">
        <span className="block text-xs font-semibold" style={{ color: checked ? '#fff' : 'rgba(255,255,255,0.8)' }}>{label}</span>
        <span className="block text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{hint}</span>
      </span>
      <span className="relative inline-block h-5 w-9 shrink-0 rounded-full" style={{ background: checked ? RED : 'rgba(255,255,255,0.12)', transition: 'background 0.25s' }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 22 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff', transition: 'left 0.25s cubic-bezier(0.32,0.72,0,1)' }} />
      </span>
    </button>
  )
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
      <p className="mt-1.5 text-2xl font-semibold" style={{ color: accent }}>{value}</p>
      {hint && <p className="mt-0.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{hint}</p>}
    </div>
  )
}

function VadTimeline({ vad, duration }: { vad: Float32Array; duration: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    const w = rect.width
    const h = rect.height
    ctx.clearRect(0, 0, w, h)

    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = (h / 4) * i
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(0, h * 0.5); ctx.lineTo(w, h * 0.5); ctx.stroke()
    ctx.setLineDash([])

    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, 'rgba(52,211,153,0.55)')
    grad.addColorStop(1, 'rgba(52,211,153,0.03)')
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let i = 0; i < vad.length; i++) {
      const x = (i / Math.max(1, vad.length - 1)) * w
      const y = h - vad[i] * h
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    ctx.beginPath()
    for (let i = 0; i < vad.length; i++) {
      const x = (i / Math.max(1, vad.length - 1)) * w
      const y = h - vad[i] * h
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = GREEN
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [vad])

  return (
    <div className="rounded-2xl p-5" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">Voice activity</p>
        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>RNNoise per-frame VAD</span>
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: 96, display: 'block' }} />
      <div className="mt-1 flex justify-between text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
        <span>0:00</span>
        <span>{formatSecs(Math.round(duration))}</span>
      </div>
    </div>
  )
}

/* --------------------------------- helpers -------------------------------- */

const primaryBtnStyle: React.CSSProperties = {
  padding: '12px 22px',
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  color: '#fff',
  background: `linear-gradient(135deg, ${RED_DEEP} 0%, ${RED} 100%)`,
  boxShadow: '0 0 24px rgba(234,10,26,0.3)',
  border: 'none',
  cursor: 'pointer',
}

const ghostBtnStyle: React.CSSProperties = {
  padding: '12px 22px',
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.8)',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.14)',
  cursor: 'pointer',
}

function voiceShare(vad: Float32Array, threshold: number): number {
  let n = 0
  for (let i = 0; i < vad.length; i++) if (vad[i] >= threshold) n++
  return n
}

function rmsByte(buf: Uint8Array): number {
  let sum = 0
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] - 128) / 128
    sum += v * v
  }
  return Math.sqrt(sum / buf.length)
}

function formatSecs(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

/* ---------------------------------- icons --------------------------------- */

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.7)' }}>
      <path d="M12 16V4M5 11l7-7 7 7M5 20h14" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: RED }}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8L12 3zM19 14l.9 2.3 2.1.9-2.1.9L19 20l-.9-2.1L16 17.2l2.1-.9L19 14z" />
    </svg>
  )
}

function Spinner() {
  return (
    <span className="animate-spin rounded-full" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', display: 'inline-block' }} />
  )
}
