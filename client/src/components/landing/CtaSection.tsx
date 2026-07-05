import { useRef, useState, type CSSProperties } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'

const languageBadges = [
  { label: 'Hello', style: { top: '20%', left: '7%' } },
  { label: 'Bonjour', style: { top: '15%', right: '9%' } },
  { label: 'Hola', style: { bottom: '26%', left: '11%' } },
  { label: 'こんにちは', style: { bottom: '22%', right: '6%' } },
] as const

const pills = ['70+ LANGUAGES', 'PRIVATE & SECURE', 'LOW LATENCY']

export function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section
      id="get-started"
      ref={ref}
      className="relative overflow-hidden"
      style={{
        paddingTop: 'clamp(96px, 12vw, 150px)',
        paddingBottom: 'clamp(96px, 12vw, 140px)',
        paddingLeft: 24,
        paddingRight: 24,
        background:
          'radial-gradient(circle at 50% 100%, rgba(234,10,26,0.14), transparent 50%), linear-gradient(180deg, #030306 0%, #020205 100%)',
      }}
    >
      <AuroraGlow />

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 940 }}>
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
          {languageBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.4 + i * 0.09 }}
              className="absolute"
              style={badge.style}
            >
              <LanguageBadge label={badge.label} />
            </motion.div>
          ))}
        </div>

        <div className="relative mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease }}
            className="relative"
            style={{ marginBottom: 20 }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(40px, 6vw, 68px)',
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
                fontWeight: 500,
                color: '#ffffff',
                maxWidth: 640,
              }}
            >
              Start real-time AI
              <br />
              <span className="relative inline-block">
                voice translation
                <span style={{ color: RED_BRIGHT }}>?</span>
                <SparkleIcon className="absolute" style={{ top: -10, right: -20 } as CSSProperties} />
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            style={{
              marginBottom: 32,
              maxWidth: 440,
              fontSize: 'clamp(15px, 1.5vw, 17px)',
              lineHeight: 1.55,
              letterSpacing: '-0.01em',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            Join the waitlist for live meeting translation across Zoom, Google Meet, Teams, webinars,
            sales calls, support, and online classes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.18 }}
            style={{ width: '100%', maxWidth: 500, marginBottom: 26 }}
          >
            <WaitlistForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.26 }}
          >
            <PillRow items={pills} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function WaitlistForm() {
  const [email, setEmail] = useState('')

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch"
      style={{
        padding: 5,
        borderRadius: 14,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.025)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <label className="flex min-w-0 flex-1 items-center" style={{ gap: 10, padding: '0 14px' }}>
        <span className="sr-only">Email address</span>
        <MailIcon />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-white/35"
          style={{
            fontSize: 14.5,
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
            color: '#ffffff',
          }}
        />
      </label>

      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-2"
        style={{
          padding: '12px 22px',
          borderRadius: 10,
          border: 'none',
          cursor: 'pointer',
          background: `linear-gradient(135deg, ${RED} 0%, ${RED_BRIGHT} 100%)`,
          color: '#ffffff',
          fontSize: 14.5,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          boxShadow: '0 8px 24px rgba(234,10,26,0.32), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        <WaveformIcon />
        Join Waitlist
      </button>
    </form>
  )
}

function PillRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center" style={{ gap: '6px 22px' }}>
      {items.map((item) => (
        <div key={item} className="flex items-center" style={{ gap: 8 }}>
          <span
            style={{
              width: 4, height: 4, borderRadius: 999, background: RED_BRIGHT,
              boxShadow: `0 0 6px ${RED_BRIGHT}`,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.12em',
              whiteSpace: 'nowrap',
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  )
}

function LanguageBadge({ label }: { label: string }) {
  return (
    <div
      className="drift-x inline-flex items-center"
      style={{
        gap: 8,
        padding: '8px 14px',
        borderRadius: 10,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(10, 10, 13, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <MiniWaveform />
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: 'rgba(255, 255, 255, 0.82)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  )
}

function AuroraGlow() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden" aria-hidden style={{ height: 'clamp(180px, 26vw, 320px)' }}>
      <div
        className="aurora-drift absolute left-1/2 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          width: 'min(700px, 90vw)',
          height: 360,
          bottom: -120,
          background: 'radial-gradient(circle, rgba(234,10,26,0.22), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #030306 0%, rgba(3, 3, 6, 0.4) 35%, transparent 70%)',
        }}
      />
    </div>
  )
}

function SparkleIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden
    >
      <path d="M7 0.5 8.1 5.9 13.5 7 8.1 8.1 7 13.5 5.9 8.1 0.5 7 5.9 5.9 7 0.5Z" fill={RED_BRIGHT} />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.1" />
      <path d="M2.5 5 8 9.25 13.5 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WaveformIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="1" y="7" width="2" height="4" rx="1" fill="#ffffff" />
      <rect x="4.6" y="4" width="2" height="10" rx="1" fill="#ffffff" />
      <rect x="8.2" y="2" width="2" height="14" rx="1" fill="#ffffff" />
      <rect x="11.8" y="5" width="2" height="8" rx="1" fill="#ffffff" />
      <rect x="15.4" y="7.5" width="2" height="3" rx="1" fill="#ffffff" />
    </svg>
  )
}

function MiniWaveform() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1" y="5.5" width="1.5" height="3" rx="0.75" fill={RED_BRIGHT} />
      <rect x="3.5" y="3.5" width="1.5" height="7" rx="0.75" fill={RED_BRIGHT} />
      <rect x="6" y="2" width="1.5" height="10" rx="0.75" fill={RED_BRIGHT} />
      <rect x="8.5" y="4" width="1.5" height="6" rx="0.75" fill={RED_BRIGHT} />
      <rect x="11" y="6" width="1.5" height="2" rx="0.75" fill={RED_BRIGHT} />
    </svg>
  )
}
