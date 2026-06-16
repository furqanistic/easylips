import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const testimonials = [
  {
    quote: 'BetterLips changed everything for us. My team speaks Urdu and Hindi, but our clients are in the US and UK. Now they hear us in perfect English — no awkward pauses, no miscommunication.',
    name: 'Sarah Chen',
    role: 'VP of Sales',
    company: 'GlobalTech Inc.',
    avatar: 'SC',
    color: 'oklch(0.55 0.22 25)',
    stars: 5,
  },
  {
    quote: 'I host webinars for audiences in Japan, Brazil, and Germany simultaneously. My subscriber count tripled. BetterLips didn\'t just break the language barrier — it dissolved it.',
    name: 'Marcus Osei',
    role: 'Content Creator',
    company: '2.1M subscribers',
    avatar: 'MO',
    color: 'oklch(0.6 0.2 20)',
    stars: 5,
  },
  {
    quote: 'We use it for our global medical training programs. The accuracy and contextual understanding are remarkable — even complex medical terminology translates correctly in real-time.',
    name: 'Dr. Priya Nair',
    role: 'Medical Education Director',
    company: 'HealthBridge',
    avatar: 'PN',
    color: 'oklch(0.7 0.2 120)',
    stars: 5,
  },
  {
    quote: '68ms latency feels like magic. My Urdu-speaking clients think I\'m speaking their language. This is the future of global business, and BetterLips is years ahead.',
    name: 'Alex Petrov',
    role: 'Founder & CEO',
    company: 'TradeLink',
    avatar: 'AP',
    color: 'oklch(0.65 0.22 30)',
    stars: 5,
  },
  {
    quote: 'Our support team handles 12 languages with just 3 agents. BetterLips translates calls in real-time. Customer satisfaction went up 40% in international markets.',
    name: 'Lucia Torres',
    role: 'Head of Customer Success',
    company: 'AppVault',
    avatar: 'LT',
    color: 'oklch(0.55 0.22 25)',
    stars: 5,
  },
  {
    quote: 'I teach online to students across South Asia and the Middle East. They all hear me in their native language now. My enrollment rate doubled within a month.',
    name: 'James Whitfield',
    role: 'Online Educator',
    company: 'LinguaFlow Academy',
    avatar: 'JW',
    color: 'oklch(0.6 0.2 20)',
    stars: 5,
  },
]

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section
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

      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-16 flex flex-col items-center text-center"
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
            Testimonials
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
            Trusted by thousands of
            <br />
            creators and businesses
          </h2>
          <p style={{ fontSize: '15px', color: 'oklch(0.45 0 0)' }}>From solo creators to enterprise teams — here's what they say.</p>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 gap-3 md:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.07 }}
              className="mb-3"
              style={{
                breakInside: 'avoid',
                padding: '2px',
                borderRadius: '20px',
                background: 'oklch(1 0 0 / 0.03)',
                border: '1px solid oklch(1 0 0 / 0.06)',
              }}
            >
              <div
                className="rounded-[18px] p-6"
                style={{
                  background: '#07080a',
                  boxShadow: 'inset 0 1px 0 oklch(1 0 0 / 0.03)',
                }}
              >
                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 12 12" fill={t.color}>
                      <path d="M6 1l1.3 3.9H11L8.1 7l1 3.9L6 9 2.9 10.9l1-3.9L1 4.9h3.7L6 1z" />
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'oklch(0.6 0 0)', marginBottom: '20px' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex shrink-0 items-center justify-center"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: `${t.color}15`,
                      color: t.color,
                      border: `1px solid ${t.color}20`,
                    }}
                  >
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
          className="mt-12 flex flex-wrap justify-center border-t pt-12"
          style={{ borderColor: 'oklch(1 0 0 / 0.04)' }}
        >
          {[
            { label: 'Active users', value: '180K+' },
            { label: 'Calls translated', value: '4.2M+' },
            { label: 'Customer rating', value: '4.9 / 5' },
            { label: 'Uptime SLA', value: '99.97%' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col items-center px-8"
              style={{
                borderRight: i < 3 ? '1px solid oklch(1 0 0 / 0.04)' : 'none',
              }}
            >
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
