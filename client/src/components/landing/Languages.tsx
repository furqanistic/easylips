import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const languages = [
  { code: 'EN', name: 'English', speakers: '1.5B' },
  { code: 'ZH', name: 'Chinese', speakers: '1.1B' },
  { code: 'HI', name: 'Hindi', speakers: '600M' },
  { code: 'ES', name: 'Spanish', speakers: '560M' },
  { code: 'AR', name: 'Arabic', speakers: '420M' },
  { code: 'FR', name: 'French', speakers: '280M' },
  { code: 'PT', name: 'Portuguese', speakers: '260M' },
  { code: 'RU', name: 'Russian', speakers: '255M' },
  { code: 'UR', name: 'Urdu', speakers: '230M' },
  { code: 'DE', name: 'German', speakers: '130M' },
  { code: 'JA', name: 'Japanese', speakers: '125M' },
  { code: 'KO', name: 'Korean', speakers: '81M' },
  { code: 'TR', name: 'Turkish', speakers: '88M' },
  { code: 'IT', name: 'Italian', speakers: '68M' },
  { code: 'PL', name: 'Polish', speakers: '45M' },
  { code: 'NL', name: 'Dutch', speakers: '30M' },
  { code: 'SV', name: 'Swedish', speakers: '13M' },
  { code: 'SW', name: 'Swahili', speakers: '200M' },
  { code: 'VI', name: 'Vietnamese', speakers: '95M' },
  { code: 'TH', name: 'Thai', speakers: '60M' },
]

const accentColors = [
  'oklch(0.55 0.22 25)',
  'oklch(0.6 0.2 20)',
  'oklch(0.7 0.2 120)',
  'oklch(0.65 0.22 30)',
  'oklch(0.6 0.2 200)',
]

const doubled = [...languages, ...languages]

export function Languages() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section
      id="languages"
      ref={ref}
      className="relative overflow-hidden px-6 py-32"
      style={{ background: '#050208' }}
    >
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(86.88% 75.47% at 50% 24.53%, oklch(0.6 0.2 20 / 0.06), transparent)',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-16 flex flex-col items-center px-6 text-center"
        >
          <span
            className="mb-5 inline-flex rounded-full px-3 py-1"
            style={{
              border: '1px solid oklch(0.6 0.2 20 / 0.15)',
              background: 'oklch(0.6 0.2 20 / 0.06)',
              fontSize: '11px',
              fontWeight: 500,
              color: 'oklch(0.6 0.2 20)',
              letterSpacing: '0.073em',
              textTransform: 'uppercase',
            }}
          >
            70+ Languages
          </span>
          <h2
            className="mb-4"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            The world's most spoken
            <br />
            languages, all in one place
          </h2>
          <p style={{ maxWidth: '440px', fontSize: '15px', lineHeight: 1.6, color: 'oklch(0.45 0 0)' }}>
            From the most widely-spoken to regional dialects, our AI handles every language combination with equal accuracy.
          </p>
        </motion.div>

        {/* Ticker 1 */}
        <div className="ticker-wrap" style={{ marginBottom: '12px' }}>
          <div className="ticker-inner">
            {doubled.map((lang, i) => (
              <LangCard key={`a-${i}`} lang={lang} color={accentColors[i % accentColors.length]} />
            ))}
          </div>
        </div>

        {/* Ticker 2 reversed */}
        <div className="ticker-wrap" style={{ marginBottom: '12px' }}>
          <div className="ticker-inner reverse">
            {[...doubled].reverse().map((lang, i) => (
              <LangCard key={`b-${i}`} lang={lang} color={accentColors[(i + 4) % accentColors.length]} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="mt-12 flex flex-wrap justify-center gap-12 px-6"
        >
          {[
            { value: '2,000+', label: 'Language pairs' },
            { value: '8B+', label: 'People reachable' },
            { value: '99.3%', label: 'Average accuracy' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span style={{ fontWeight: 600, fontSize: '28px', color: '#ffffff', marginBottom: '4px', letterSpacing: '-0.03em' }}>
                {s.value}
              </span>
              <span style={{ fontSize: '13px', color: 'oklch(0.45 0 0)', letterSpacing: '0.02em' }}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function LangCard({ lang, color }: { lang: { code: string; name: string; speakers: string }; color: string }) {
  return (
    <div
      className="mx-1.5 flex shrink-0 items-center gap-2"
      style={{
        padding: '12px 16px',
        borderRadius: '12px',
        background: '#07080a',
        border: '1px solid oklch(1 0 0 / 0.05)',
        minWidth: '160px',
      }}
    >
      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 500, color, letterSpacing: '0.04em' }}>
        {lang.code}
      </span>
      <div className="flex flex-col">
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#ffffff' }}>{lang.name}</span>
        <span style={{ fontSize: '11px', color: '#454647' }}>{lang.speakers} speakers</span>
      </div>
    </div>
  )
}
