import { Link } from 'react-router-dom'
import { Navbar } from '@/components/landing'
import { useSeo } from '@/lib/seo'

const RED = '#ff1f2e'
const RED_DEEP = '#ea0a1a'
const SITE = 'https://onelingo.app'
const BLOG_URL = `${SITE}/tools/noise-remover`
const APP_URL = `${SITE}/tools/noise-remover/app`
const OG_IMAGE = `${SITE}/og-image.png`

// < 60 chars, leads with the target keyword, year hook.
const SEO_TITLE = 'Noise Remover (2026) — Remove Background Noise from Audio'
// < 155 chars, keyword once, ends with a CTA.
const SEO_DESCRIPTION =
  'Remove background noise from audio and voice recordings with this free browser-based noise remover. No upload, no signup — try it now.'

const FAQ = [
  {
    q: 'How do I remove background noise from an audio file?',
    a: 'Upload your file (or record from your microphone), click "Remove background noise," then compare the original and denoised versions and download the result as a WAV. The whole process runs in your browser and takes a few seconds.',
  },
  {
    q: 'Is this noise remover free to use?',
    a: 'Yes. The Noise Remover is 100% free, with no signup, no watermark, and no usage limits. It runs entirely on your device.',
  },
  {
    q: 'Does the noise remover upload my audio?',
    a: 'No. All processing happens locally in your browser using WebAssembly and the Web Audio API. Your recordings and files never leave your device, which makes it safe for confidential or sensitive audio.',
  },
  {
    q: 'Can I remove noise from a microphone recording?',
    a: 'Yes. Click "Record from microphone," capture your voice, then run noise removal on the recording. Browser noise suppression is disabled during capture so RNNoise receives the cleanest possible signal.',
  },
  {
    q: 'What is RNNoise?',
    a: 'RNNoise is an open-source noise suppression library developed by Xiph.Org and Mozilla. It uses a lightweight recurrent neural network trained on speech to remove background noise in real time, and is widely used in voice communication apps.',
  },
  {
    q: 'What audio formats can I import and export?',
    a: 'You can import WAV, MP3, M4A, OGG, and FLAC files. The denoised result is exported as a 16-bit WAV at 48 kHz, which imports cleanly into video editors, DAWs, and transcription tools.',
  },
]

const JSON_LD = [
  {
    '@type': 'Article',
    headline: 'Free Noise Remover for Voice & Audio Recordings',
    description: SEO_DESCRIPTION,
    datePublished: '2026-07-05',
    dateModified: '2026-07-05',
    author: { '@type': 'Organization', name: 'OneLingo', url: SITE },
    publisher: { '@id': `${SITE}/#organization` },
    mainEntityOfPage: BLOG_URL,
    image: OG_IMAGE,
  },
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Noise Remover', item: BLOG_URL },
    ],
  },
  {
    '@type': 'WebApplication',
    name: 'Noise Remover',
    url: APP_URL,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any (web browser)',
    browserRequirements: 'Requires WebAssembly and Web Audio API support',
    isAccessibleForFree: true,
    description: SEO_DESCRIPTION,
    featureList: [
      'RNNoise neural noise suppression',
      'Voice activity detection (VAD)',
      'Voice enhancer: volume boost, compressor, high-pass filter, auto-level',
      'Microphone recording and file upload',
      '100% local processing — no uploads',
      'WAV export at 48 kHz',
    ],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': `${SITE}/#organization` },
  },
  {
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
].map((o) => ({ '@context': 'https://schema.org', ...o }))

export function NoiseRemoverBlogPage() {
  useSeo({
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    canonical: BLOG_URL,
    ogType: 'article',
    ogImage: OG_IMAGE,
    jsonLd: JSON_LD,
  })

  return (
    <div className="dark relative">
      <div className="grain-overlay" aria-hidden />
      <Navbar />
      <main style={{ background: 'transparent', color: '#fff', paddingTop: '96px' }}>
        <article
          className="mx-auto w-full max-w-[760px] px-5 pb-28"
          style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
        >
          <nav className="mb-6 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }} aria-label="Breadcrumb">
            <Link to="/" style={linkStyle}>Home</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Noise Remover</span>
          </nav>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: RED }}>
            Free Audio Tool
          </p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-[2.75rem]" style={{ letterSpacing: '-0.02em' }}>
            Free Noise Remover for Voice &amp; Audio Recordings
          </h1>
          <p className="mt-5 text-lg leading-7" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Remove hiss, hum, room echo, and background noise from any voice recording in seconds — right in your browser.
            Powered by RNNoise, 100% private, no signup, no upload.
          </p>

          {/* Top CTA → tool */}
          <CtaCard />

          {/* Body */}
          <div className="article-prose" style={proseStyle}>
            <h2 id="what-is">What is a noise remover?</h2>
            <p>
              A <strong>noise remover</strong> strips unwanted background sound — air-conditioner hum, keyboard clicks,
              room reverb, fan hiss, traffic — from an audio recording while keeping your voice clear. The result is a
              clean, professional-sounding track you can publish, share, or transcribe without listeners straining to
              hear you. This noise remover uses <a href="https://github.com/xiph/rnnoise" target="_blank" rel="noreferrer" style={redLink}>RNNoise</a>,
              a neural-network noise suppression library, running locally in your browser through WebAssembly.
            </p>

            <h2 id="how-it-works">How this noise remover works</h2>
            <p>
              When you load an audio file or record from your microphone, the tool decodes the audio to 48 kHz mono PCM
              and sends it to RNNoise. RNNoise processes the signal in 10-millisecond frames using a recurrent neural
              network trained specifically on speech, removing non-speech noise while preserving your voice. For every
              frame it also returns a <em>voice activity detection</em> (VAD) score, which the tool uses to show where
              speech actually happens and to power the enhancer.
            </p>
            <p>
              After denoising, an optional <strong>voice enhancer</strong> chain runs the result through a high-pass
              filter (to cut low rumble), a speech compressor (to even out loud and quiet parts), and a clean gain boost
              with clipping protection — so quiet recordings end up loud, consistent, and broadcast-ready.
            </p>

            <h2 id="how-to">How to remove background noise from audio — step by step</h2>
            <ol>
              <li>
                <strong>Add your audio.</strong> Drag and drop a file (WAV, MP3, M4A, OGG, FLAC) onto the uploader, or
                click <em>Record from microphone</em> to capture your voice live.
              </li>
              <li>
                <strong>Click "Remove background noise."</strong> RNNoise processes the recording locally. A progress
                bar shows how far along it is.
              </li>
              <li>
                <strong>Compare and enhance.</strong> Switch between <em>Original</em> and <em>Denoised</em> to hear the
                difference, then tweak volume boost, rumble reduction, compression, and auto-level until it sounds
                right.
              </li>
              <li>
                <strong>Download.</strong> Export the cleaned audio as a 16-bit WAV at 48 kHz — ready for your video
                editor, podcast host, or transcription tool.
              </li>
            </ol>

            <h2 id="who-uses">Who uses a noise remover?</h2>
            <ul>
              <li><strong>Podcasters</strong> — clean up remote interviews and home-studio recordings without a treated booth.</li>
              <li><strong>Video creators &amp; YouTubers</strong> — remove room tone from voiceover takes before editing.</li>
              <li><strong>Remote workers</strong> — polish meeting recordings and Loom-style walkthroughs recorded in less-than-ideal spaces.</li>
              <li><strong>Students &amp; lecturers</strong> — clear up lecture captures and study recordings made in noisy halls.</li>
              <li><strong>Voiceover artists</strong> — produce clean audition tapes from any location.</li>
              <li><strong>Researchers &amp; transcribers</strong> — improve transcription accuracy by removing noise before sending audio to a speech-to-text tool.</li>
            </ul>

            <h2 id="features">Noise remover features</h2>
            <h3>RNNoise neural noise suppression</h3>
            <p>The same engine used in real-time communication apps, now applied offline for higher quality on recorded audio.</p>
            <h3>Voice activity detection</h3>
            <p>A per-frame VAD timeline shows exactly where speech occurs — useful for editing and for the noise gate.</p>
            <h3>Voice enhancer</h3>
            <p>Boost volume, cut low-end rumble, compress dynamics, and auto-level the result — all with live preview.</p>
            <h3>Microphone + file input</h3>
            <p>Record directly in the browser or upload an existing file. Browser DSP is disabled on capture so RNNoise gets a clean signal.</p>
            <h3>100% private</h3>
            <p>Nothing is uploaded. All processing happens on your device, so confidential audio stays confidential.</p>

            <h2 id="private">Is my audio private?</h2>
            <p>
              Yes. Unlike online noise removers that upload your file to a server, this tool runs entirely in your
              browser. The RNNoise model loads as a WebAssembly binary on your machine, and your audio is processed by
              the Web Audio API — never transmitted anywhere. That makes it safe for confidential meetings, medical
              dictation, legal recordings, and any audio you'd rather not hand to a third party.
            </p>

            <h2 id="why-rnnoise">Why RNNoise?</h2>
            <p>
              RNNoise was created by Jean-Marc Valin at Xiph.Org and sponsored by Mozilla. It was the first practical
              noise suppressor to combine a recurrent neural network with DSP classic signal processing, and it's now
              used inside voice communication platforms and browsers. It's fast, lightweight, and tuned for speech —
              which makes it ideal for a browser-based noise remover that needs to feel instant and work without a GPU.
            </p>

            <h2 id="faq">Noise remover FAQ</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <details key={f.q} style={faqItemStyle}>
                  <summary style={faqSummaryStyle}>{f.q}</summary>
                  <p style={{ marginTop: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{f.a}</p>
                </details>
              ))}
            </div>

            <h2 id="related">Related audio tools</h2>
            <p>
              Building a workflow? Pair the noise remover with other free, in-browser audio tools from{' '}
              <Link to="/" style={redLink}>OneLingo</Link>:
            </p>
            <ul>
              <li><Link to="/tools/speech-to-text" style={redLink}>Speech to Text</Link> — transcribe your cleaned audio into editable text.</li>
              <li><Link to="/tools/voice-recorder" style={redLink}>Voice Recorder</Link> — capture and export high-quality voice clips.</li>
              <li><Link to="/tools/audio-converter" style={redLink}>Audio Converter</Link> — convert between WAV, MP3, OGG, FLAC, and M4A.</li>
              <li><Link to="/tools/text-to-speech" style={redLink}>Text to Speech</Link> — generate natural-sounding voiceover from text.</li>
            </ul>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(234,10,26,0.25)', background: 'rgba(234,10,26,0.04)' }}>
            <h2 className="text-2xl font-bold">Ready to clean up your audio?</h2>
            <p className="mx-auto mt-2 max-w-[440px] text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Open the Noise Remover and remove background noise from your recording in seconds. Free, private, no signup.
            </p>
            <Link to="/tools/noise-remover/app" className="mt-5 inline-flex items-center gap-2 no-underline" style={primaryBtnStyle}>
              Open Noise Remover <ArrowIcon />
            </Link>
          </div>

          <p className="mt-8 text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Last updated July 2026 · Built with RNNoise · © OneLingo
          </p>
        </article>
      </main>
    </div>
  )
}

function CtaCard() {
  return (
    <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between" style={{ border: '1px solid rgba(234,10,26,0.25)', background: 'rgba(234,10,26,0.05)' }}>
      <div>
        <p className="text-base font-semibold">Try the Noise Remover tool</p>
        <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Upload a file or record — remove noise in one click.</p>
      </div>
      <Link to="/tools/noise-remover/app" className="inline-flex shrink-0 items-center gap-2 no-underline" style={primaryBtnStyle}>
        Open tool <ArrowIcon />
      </Link>
    </div>
  )
}

/* --------------------------------- styles --------------------------------- */

const linkStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }
const redLink: React.CSSProperties = { color: RED, textDecoration: 'none' }

const proseStyle: React.CSSProperties = {
  marginTop: '2.5rem',
  color: 'rgba(255,255,255,0.78)',
  fontSize: '16px',
  lineHeight: 1.75,
}

const primaryBtnStyle: React.CSSProperties = {
  padding: '12px 22px',
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  color: '#fff',
  background: `linear-gradient(135deg, ${RED_DEEP} 0%, ${RED} 100%)`,
  boxShadow: '0 0 24px rgba(234,10,26,0.3)',
  transition: 'transform 0.2s',
}

const faqItemStyle: React.CSSProperties = {
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.02)',
  padding: '14px 16px',
}

const faqSummaryStyle: React.CSSProperties = {
  cursor: 'pointer',
  fontWeight: 600,
  color: '#fff',
  fontSize: 15,
  listStyle: 'none',
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
