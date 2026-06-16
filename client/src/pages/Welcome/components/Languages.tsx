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

const accentColors = ['#56c2ff', '#a78bfa', '#59d499', '#ff6363', '#56c2ff', '#a78bfa', '#59d499', '#ff6363', '#56c2ff', '#a78bfa']

const doubled = [...languages, ...languages]

export function Languages() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section id="languages" ref={ref} style={{ position: 'relative', padding: '128px 0', overflow: 'hidden', background: '#040506' }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(86.88% 75.47% at 50% 24.53%, rgba(82,48,145,0.4), rgba(26,11,51,0.1))',
      }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px', padding: '0 24px' }}
        >
          <span style={{
            display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', marginBottom: '20px',
            background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
            color: '#a78bfa', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.073em', textTransform: 'uppercase',
          }}>
            70+ Languages
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1,
            letterSpacing: '-0.04em', fontWeight: 600, color: '#ffffff', marginBottom: '16px',
          }}>
            The world's most spoken
            <br />languages, all in one place
          </h2>
          <p style={{ maxWidth: '400px', fontSize: '15px', lineHeight: 1.6, color: '#6a6b6c' }}>
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
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '48px', marginTop: '48px', padding: '0 24px' }}
        >
          {[
            { value: '2,000+', label: 'Language pairs' },
            { value: '8B+', label: 'People reachable' },
            { value: '99.3%', label: 'Average accuracy' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '28px', color: '#ffffff', marginBottom: '4px', letterSpacing: '-0.03em' }}>
                {s.value}
              </span>
              <span style={{ fontSize: '13px', color: '#6a6b6c', letterSpacing: '0.02em' }}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function LangCard({ lang, color }: { lang: { code: string; name: string; speakers: string }; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      margin: '0 6px', padding: '12px 16px', borderRadius: '11px',
      background: '#07080a', border: '1px solid rgba(255,255,255,0.06)',
      minWidth: '160px', flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 500, color, letterSpacing: '0.04em' }}>
        {lang.code}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#ffffff' }}>{lang.name}</span>
        <span style={{ fontSize: '11px', color: '#454647' }}>{lang.speakers} speakers</span>
      </div>
    </div>
  )
}
