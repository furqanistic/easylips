import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED_BRIGHT = '#ff1f2e'

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
]

const doubled = [...languages, ...languages]

const stats = [
  { value: 2000, suffix: '+', label: 'Language pairs' },
  { value: 8, suffix: 'B+', label: 'People reachable' },
  { value: 99.3, suffix: '%', label: 'Average accuracy', decimals: 1 },
]

export function Languages() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="languages"
      ref={ref}
      className="relative overflow-hidden px-5 sm:px-6 lg:px-8"
      style={{
        paddingTop: 'clamp(88px, 10vw, 140px)',
        paddingBottom: 'clamp(88px, 10vw, 140px)',
        background: '#030305',
      }}
    >
      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 1200 }}>
        <div className="text-center">
          <SectionLabel>70+ Languages</SectionLabel>
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 'clamp(36px, 5vw, 60px)',
              lineHeight: 1.05,
              letterSpacing: '-0.045em',
              fontWeight: 700,
              color: '#F4F4F5',
              maxWidth: 620,
              margin: '18px auto 0',
            }}
          >
            The world's languages.
            <br />
            <span style={{ color: RED_BRIGHT }}>One engine.</span>
          </h2>
          <p
            style={{
              marginTop: 18,
              fontSize: 'clamp(16px, 1.6vw, 19px)',
              color: 'rgba(255,255,255,0.5)',
              maxWidth: 520,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Every accent, every dialect, handled with the same precision.
          </p>
        </div>

        {/* Elegant marquee */}
        <div className="mt-14 overflow-hidden" style={{ marginBottom: 10 }}>
          <div className="ticker-wrap">
            <div className="ticker-inner">
              {doubled.map((lang, i) => (
                <LangChip key={`a-${i}`} lang={lang} />
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-hidden" style={{ marginBottom: 10 }}>
          <div className="ticker-wrap">
            <div className="ticker-inner reverse">
              {[...doubled].reverse().map((lang, i) => (
                <LangChip key={`b-${i}`} lang={lang} />
              ))}
            </div>
          </div>
        </div>

        {/* Big stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-8 border-t border-white/10 pt-12 sm:grid-cols-3"
        >
          {stats.map((s, idx) => (
            <div key={idx} className="text-center">
              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 'clamp(42px, 5vw, 64px)',
                  fontWeight: 700,
                  color: '#F4F4F5',
                  letterSpacing: '-0.03em',
                }}
              >
                <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.14em',
                }}
              >
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function LangChip({ lang }: { lang: { code: string; name: string; speakers: string } }) {
  return (
    <div
      className="mx-1 flex shrink-0 items-center"
      style={{
        gap: 12,
        padding: '11px 18px',
        borderRadius: '14px',
        background: 'rgba(10,10,13,0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          fontWeight: 700,
          color: RED_BRIGHT,
          letterSpacing: '0.08em',
        }}
      >
        {lang.code}
      </span>
      <span style={{ fontSize: '14px', fontWeight: 500, color: '#F4F4F5' }}>{lang.name}</span>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{lang.speakers}</span>
    </div>
  )
}

function CountUp({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const display = useCountUp(value, inView, decimals)

  return (
    <span ref={ref}>
      {display}
      <span style={{ color: RED_BRIGHT }}>{suffix}</span>
    </span>
  )
}

function useCountUp(target: number, active: boolean, decimals = 0, duration = 1800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center"
      style={{
        gap: 8,
        padding: '5px 13px',
        borderRadius: '999px',
        border: '1px solid rgba(234,10,26,0.2)',
        background: 'rgba(234,10,26,0.06)',
      }}
    >
      <span
        style={{
          width: 5, height: 5, borderRadius: 999, background: RED_BRIGHT,
          boxShadow: `0 0 6px ${RED_BRIGHT}`,
        }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10.5px',
          fontWeight: 600,
          color: RED_BRIGHT,
          letterSpacing: '0.16em',
        }}
      >
        {children}
      </span>
    </div>
  )
}
