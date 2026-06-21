import { useRef, useState, type CSSProperties } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'
const CTA_FOOTER_IMAGE = '/hero/footer.avif'

const languageBadges = [
  { label: 'Hello', style: { top: '18%', left: '8%' } },
  { label: 'Bonjour', style: { top: '16%', right: '8%' } },
  { label: 'Hola', style: { bottom: '28%', left: '10%' } },
  { label: 'こんにちは', style: { bottom: '26%', right: '7%' } },
] as const

const features = [
  {
    label: '70+ languages',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="5.75" stroke="currentColor" strokeWidth="1.1" />
        <ellipse cx="7" cy="7" rx="2.25" ry="5.75" stroke="currentColor" strokeWidth="1.1" />
        <path d="M1.25 7h11.5" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    ),
  },
  {
    label: 'Private & secure',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M7 1.5L2.5 3.5v3.25c0 2.84 1.92 5.5 4.5 6.25 2.58-.75 4.5-3.41 4.5-6.25V3.5L7 1.5Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path d="M5.25 7l1.25 1.25L8.75 6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Low latency',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M7.75 1.75 2.5 8h4.25L6.25 12.25 11.5 6H7.25L7.75 1.75Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const

export function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section
      id="get-started"
      ref={ref}
      className="relative overflow-hidden bg-black"
      style={{ padding: 'clamp(96px, 12vw, 140px) 24px clamp(88px, 10vw, 120px)' }}
    >
      <BottomGlow />

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 920 }}>
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
          {languageBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.35 + i * 0.08 }}
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
            style={{ marginBottom: 18 }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(36px, 5.2vw, 58px)',
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                color: '#ffffff',
                maxWidth: 620,
              }}
            >
              Ready to remove the
              <br />
              <span className="relative inline-block">
                language gap
                <span style={{ color: RED_BRIGHT }}>?</span>
                <SparkleIcon
                  className="absolute"
                  style={{ top: -8, right: -18 }}
                />
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            style={{
              marginBottom: 36,
              maxWidth: 500,
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              lineHeight: 1.55,
              letterSpacing: '-0.01em',
              color: 'rgba(255, 255, 255, 0.48)',
            }}
          >
            Launch meetings, support, and live streams
            <br className="hidden sm:block" />
            {' '}
            without translation friction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.16 }}
            style={{ width: '100%', maxWidth: 520, marginBottom: 28 }}
          >
            <WaitlistForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.24 }}
            className="flex flex-wrap items-center justify-center"
          >
            {features.map((feature, i) => (
              <div key={feature.label} className="flex items-center">
                {i > 0 && (
                  <span
                    aria-hidden
                    style={{
                      width: 1,
                      height: 14,
                      margin: '0 18px',
                      background: 'rgba(255, 255, 255, 0.1)',
                    }}
                  />
                )}
                <div
                  className="flex items-center"
                  style={{
                    gap: 7,
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: 'rgba(255, 255, 255, 0.42)',
                  }}
                >
                  {feature.icon}
                  {feature.label}
                </div>
              </div>
            ))}
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
        padding: 4,
        borderRadius: 14,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.02)',
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
          padding: '12px 20px',
          borderRadius: 10,
          border: 'none',
          cursor: 'pointer',
          background: `linear-gradient(135deg, ${RED} 0%, ${RED_BRIGHT} 100%)`,
          color: '#ffffff',
          fontSize: 14.5,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          boxShadow: '0 6px 20px rgba(234,10,26,0.28)',
        }}
      >
        <WaveformIcon />
        Join Waitlist
      </button>
    </form>
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
        background: 'rgba(12, 12, 14, 0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
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

function BottomGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
      aria-hidden
      style={{ height: 'clamp(130px, 20vw, 260px)' }}
    >
      <img
        src={CTA_FOOTER_IMAGE}
        alt=""
        className="absolute inset-x-0 bottom-0 block h-full w-full"
        style={{
          objectFit: 'cover',
          objectPosition: 'center bottom',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.55) 28%, transparent 62%)',
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
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M7 0.5 8.1 5.9 13.5 7 8.1 8.1 7 13.5 5.9 8.1 0.5 7 5.9 5.9 7 0.5Z"
        fill={RED_BRIGHT}
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1" />
      <path d="M2.5 5 8 9.25 13.5 5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
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
