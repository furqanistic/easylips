import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const testimonials = [
  {
    quote: 'OneLingo transformed our international client calls. We close deals in 5 languages now without hiring a single interpreter. The voice quality is indistinguishable from native speech.',
    name: 'Sarah Chen', role: 'VP of Sales', company: 'GlobalTech Inc.', avatar: 'SC', color: '#56c2ff', stars: 5,
  },
  {
    quote: 'I stream to audiences in Japan, Brazil, and Germany simultaneously. My subscriber count tripled in 3 months. OneLingo didn\'t just break the language barrier — it dissolved it.',
    name: 'Marcus Osei', role: 'Content Creator', company: '2.1M subscribers', avatar: 'MO', color: '#a78bfa', stars: 5,
  },
  {
    quote: 'We use it for our global medical training programs. The accuracy and contextual understanding are remarkable — even complex medical terminology translates correctly.',
    name: 'Dr. Priya Nair', role: 'Medical Education Director', company: 'HealthBridge', avatar: 'PN', color: '#59d499', stars: 5,
  },
  {
    quote: '68ms latency feels like magic. My Mandarin clients think I\'m speaking their language. This is the future of global business, and OneLingo is years ahead.',
    name: 'Alex Petrov', role: 'Founder & CEO', company: 'TradeLink', avatar: 'AP', color: '#ff6363', stars: 5,
  },
  {
    quote: 'Launched our app in 12 markets without a localization team. Customer support in 12 languages, handled by 3 agents. OneLingo is our secret weapon.',
    name: 'Lucia Torres', role: 'Head of Customer Success', company: 'AppVault', avatar: 'LT', color: '#56c2ff', stars: 5,
  },
  {
    quote: 'The tone preservation is what sold me. My energy, my humor, my warmth — all of it comes through in Spanish and French. My students say I seem like a native.',
    name: 'James Whitfield', role: 'Online Educator', company: 'LinguaFlow Academy', avatar: 'JW', color: '#a78bfa', stars: 5,
  },
]

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section ref={ref} style={{ position: 'relative', padding: '128px 0', overflow: 'hidden', background: '#040506' }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(86.88% 75.47% at 50% 24.53%, rgba(82,48,145,0.4), rgba(26,11,51,0.1))',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px' }}
        >
          <span style={{
            display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', marginBottom: '20px',
            background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
            color: '#a78bfa', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.073em', textTransform: 'uppercase',
          }}>
            Testimonials
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1,
            letterSpacing: '-0.04em', fontWeight: 600, color: '#ffffff', marginBottom: '16px',
          }}>
            Trusted by thousands of
            <br />creators and businesses
          </h2>
          <p style={{ fontSize: '15px', color: '#6a6b6c' }}>From solo creators to enterprise teams — here&apos;s what they say.</p>
        </motion.div>

        {/* Masonry grid */}
        <div style={{ columnGap: '12px' }} className="columns-1 md:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.07 }}
              style={{
                breakInside: 'avoid', marginBottom: '12px',
                padding: '6px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ borderRadius: '15px', padding: '24px',
                background: '#07080a', boxShadow: 'rgba(255,255,255,0.03) 0px 1px 0px 0px inset' }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <svg key={j} width="12" height="12" viewBox="0 0 12 12" fill={t.color}>
                      <path d="M6 1l1.3 3.9H11L8.1 7l1 3.9L6 9 2.9 10.9l1-3.9L1 4.9h3.7L6 1z" />
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#9c9c9d', marginBottom: '20px' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 600, flexShrink: 0,
                    background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}25`,
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#e6e6e6' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#454647', letterSpacing: '0.01em' }}>
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0', marginTop: '48px',
            paddingTop: '48px', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {[
            { label: 'Active users', value: '180K+' },
            { label: 'Sessions translated', value: '12M+' },
            { label: 'Customer rating', value: '4.9 / 5' },
            { label: 'Uptime SLA', value: '99.97%' },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 32px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <span style={{ fontWeight: 600, fontSize: '20px', color: '#ffffff', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                {item.value}
              </span>
              <span style={{ fontSize: '12px', color: '#454647', letterSpacing: '0.02em' }}>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
