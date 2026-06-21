import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
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

const ring1 = ['EN', 'ZH', 'ES', 'FR', 'DE', 'JA']
const ring2 = ['HI', 'AR', 'PT', 'KO', 'TR', 'IT', 'PL', 'NL']
const ring3 = ['UR', 'RU', 'EN', 'JA', 'ES', 'FR', 'ZH', 'DE', 'HI', 'AR']

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
        paddingTop: 'clamp(80px, 10vw, 120px)',
        paddingBottom: 'clamp(72px, 9vw, 110px)',
        background:
          'radial-gradient(ellipse at 50% 40%, rgba(234,10,26,0.06), transparent 55%), #050507',
      }}
    >
      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 1120 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center text-center"
        >
          <SectionLabel>70+ Languages</SectionLabel>
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 'clamp(30px, 4.5vw, 52px)',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              fontWeight: 700,
              color: '#F4F4F5',
              maxWidth: 580,
              marginTop: 16,
            }}
          >
            The world's languages,
            <br />
            <span style={{ color: RED }}>one engine</span>.
          </h2>
        </motion.div>

        <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between" style={{ marginTop: 'clamp(40px, 6vw, 64px)', gap: 'clamp(32px, 5vw, 56px)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
          >
            <OrbitalConstellation />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="flex flex-col"
            style={{ gap: 18, maxWidth: 340 }}
          >
            <p
              style={{
                fontSize: 'clamp(15px, 1.5vw, 18px)',
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '-0.01em',
              }}
            >
              From the most widely spoken to regional dialects — every combination handled with equal accuracy.
            </p>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {[
                { k: 'Native-level prosody', v: true },
                { k: 'Auto language detection', v: true },
                { k: 'Code-switching support', v: true },
                { k: 'Regional dialects', v: true },
              ].map((item) => (
                <div key={item.k} className="flex items-center" style={{ gap: 10 }}>
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: 18, height: 18, borderRadius: 6,
                      background: 'rgba(234,10,26,0.12)',
                      border: '1px solid rgba(234,10,26,0.25)',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2L8 3" stroke={RED_BRIGHT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.01em' }}>
                    {item.k}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
        >
          <div className="ticker-wrap" style={{ marginTop: 'clamp(40px, 6vw, 60px)', marginBottom: 10 }}>
            <div className="ticker-inner">
              {doubled.map((lang, i) => (
                <LangChip key={`a-${i}`} lang={lang} />
              ))}
            </div>
          </div>
          <div className="ticker-wrap" style={{ marginBottom: 10 }}>
            <div className="ticker-inner reverse">
              {[...doubled].reverse().map((lang, i) => (
                <LangChip key={`b-${i}`} lang={lang} />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
          className="flex flex-wrap justify-center"
          style={{ marginTop: 'clamp(40px, 5vw, 56px)', gap: 'clamp(24px, 5vw, 64px)' }}
        >
          {stats.map((s) => (
            <CountUpStat key={s.label} {...s} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function OrbitalConstellation() {
  return (
    <div
      className="relative"
      style={{ width: 'clamp(280px, 32vw, 400px)', height: 'clamp(280px, 32vw, 400px)' }}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{ width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(234,10,26,0.25), transparent 70%)' }}
      />

      <div className="absolute inset-0 rounded-full" style={{ border: '1px dashed rgba(255,255,255,0.08)' }} />
      <div className="absolute rounded-full" style={{ inset: '12%', border: '1px dashed rgba(234,10,26,0.15)' }} />
      <div className="absolute rounded-full" style={{ inset: '26%', border: '1px dashed rgba(255,255,255,0.06)' }} />

      <div className="spin-cw-50 absolute inset-0">
        {ring1.map((code, i) => (
          <OrbitDot key={code} code={code} angle={(360 / ring1.length) * i} radius="48%" />
        ))}
      </div>
      <div className="spin-ccw-40 absolute" style={{ inset: '12%' }}>
        {ring2.map((code, i) => (
          <OrbitDot key={code} code={code} angle={(360 / ring2.length) * i} radius="48%" small />
        ))}
      </div>
      <div className="spin-cw-30 absolute" style={{ inset: '26%' }}>
        {ring3.map((code, i) => (
          <OrbitDot key={`c-${code}-${i}`} code={code} angle={(360 / ring3.length) * i} radius="46%" tiny />
        ))}
      </div>

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-full"
        style={{
          width: '28%',
          height: '28%',
          background: 'linear-gradient(180deg, rgba(20,16,18,0.95), rgba(10,8,10,0.95))',
          border: '1px solid rgba(234,10,26,0.35)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 40px rgba(234,10,26,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            fontWeight: 700,
            color: '#F4F4F5',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          70+
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            fontWeight: 600,
            color: RED_BRIGHT,
            letterSpacing: '0.14em',
            marginTop: 4,
          }}
        >
          LANGUAGES
        </span>
      </div>
    </div>
  )
}

function OrbitDot({ code, angle, radius, small, tiny }: { code: string; angle: number; radius: string; small?: boolean; tiny?: boolean }) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `rotate(${angle}deg) translateX(calc(${radius} * 0.5)) rotate(-${angle}deg)`,
        marginLeft: small ? -14 : -16,
        marginTop: small ? -14 : -16,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: tiny ? 24 : small ? 28 : 32,
          height: tiny ? 24 : small ? 28 : 32,
          borderRadius: '50%',
          background: 'rgba(8,8,11,0.9)',
          border: `1px solid ${tiny ? 'rgba(255,255,255,0.1)' : 'rgba(234,10,26,0.25)'}`,
          boxShadow: tiny ? 'none' : `0 0 12px rgba(234,10,26,0.15), inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: tiny ? 8 : small ? 9 : 10,
            fontWeight: 600,
            color: tiny ? 'rgba(255,255,255,0.4)' : RED_BRIGHT,
            letterSpacing: '0.04em',
          }}
        >
          {code}
        </span>
      </div>
    </div>
  )
}

function LangChip({ lang }: { lang: { code: string; name: string; speakers: string } }) {
  return (
    <div
      className="mx-1.5 flex shrink-0 items-center"
      style={{
        gap: 10,
        padding: '10px 14px',
        borderRadius: '12px',
        background: 'rgba(8,8,11,0.7)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          fontWeight: 600,
          color: RED_BRIGHT,
          letterSpacing: '0.06em',
        }}
      >
        {lang.code}
      </span>
      <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{lang.name}</span>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{lang.speakers}</span>
    </div>
  )
}

function CountUpStat({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const display = useCountUp(value, inView, decimals)

  return (
    <div ref={ref} className="flex flex-col items-center">
      <span
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: 'clamp(28px, 3.5vw, 40px)',
          fontWeight: 700,
          color: '#F4F4F5',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {display}
        <span style={{ color: RED_BRIGHT }}>{suffix}</span>
      </span>
      <span
        style={{
          marginTop: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.1em',
        }}
      >
        {label.toUpperCase()}
      </span>
    </div>
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
