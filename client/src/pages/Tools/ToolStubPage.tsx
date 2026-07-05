import { Link, useParams } from 'react-router-dom'

const RED = '#ff1f2e'
const RED_DEEP = '#ea0a1a'
const BG = '#030308'

interface ToolMeta {
  title: string
  description: string
  status: 'planned' | 'beta'
}

const TOOLS: Record<string, ToolMeta> = {
  'audio-translator': {
    title: 'Audio Translator',
    description: 'Translate spoken audio into another language in real time, preserving voice and tone.',
    status: 'planned',
  },
  'voice-recorder': {
    title: 'Voice Recorder',
    description: 'Record high-quality voice clips with optional live noise removal and one-click export.',
    status: 'planned',
  },
  'audio-converter': {
    title: 'Audio Converter',
    description: 'Convert between MP3, WAV, OGG, FLAC and M4A entirely in your browser — no uploads.',
    status: 'planned',
  },
  'speech-to-text': {
    title: 'Speech to Text',
    description: 'Transcribe audio or live speech into editable, timestamped text using on-device models.',
    status: 'planned',
  },
  'text-to-speech': {
    title: 'Text to Speech',
    description: 'Generate natural-sounding voiceover from text with multiple voices and languages.',
    status: 'planned',
  },
}

export function ToolStubPage() {
  const { toolId } = useParams()
  const meta = toolId ? TOOLS[toolId] : undefined

  return (
    <main className="min-h-screen" style={{ background: BG, color: '#fff' }}>
      <div className="grain-overlay" aria-hidden />
      <header className="sticky top-0 z-40" style={{ background: 'rgba(3,3,8,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(234,10,26,0.12)' }}>
        <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between px-5 py-3.5">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src="/assets/logoicon.png" alt="OneLingo" className="h-8 w-auto object-contain" />
          </Link>
          <Link to="/" className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1080px] px-5 pb-24 pt-20">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em]" style={{ color: RED }}>
          Tools · Audio
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">{meta?.title ?? 'Tool'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {meta?.description ?? 'This tool is on the roadmap.'}
        </p>

        <div className="mt-10 max-w-[520px] rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.4)' }} />
              Coming soon
            </span>
          </div>
          <p className="mt-4 text-sm leading-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            We're still building this one. The first audio tool — <strong style={{ color: '#fff' }}>Noise Remover</strong> — is live now and runs RNNoise entirely in your browser.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/tools/noise-remover"
              className="inline-flex items-center no-underline"
              style={{
                padding: '10px 20px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                background: `linear-gradient(135deg, ${RED_DEEP} 0%, ${RED} 100%)`,
                boxShadow: '0 0 20px rgba(234,10,26,0.3)',
              }}
            >
              Try Noise Remover
            </Link>
            <Link
              to="/"
              className="inline-flex items-center no-underline"
              style={{
                padding: '10px 20px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.14)',
              }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
