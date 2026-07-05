import React, { useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED_BRIGHT = '#ff1f2e'

const testimonials = [
  {
    quote: 'My team speaks Urdu and Hindi, but our clients are in the US and UK. Now they hear us in perfect English — no awkward pauses.',
    name: 'Sarah Chen',
    role: 'VP of Sales',
    company: 'GlobalTech Inc.',
    avatar: 'SC',
  },
  {
    quote: 'I host webinars in Japan, Brazil, and Germany simultaneously. My subscriber count tripled. OneLingo dissolved the language barrier.',
    name: 'Marcus Osei',
    role: 'Content Creator',
    company: '2.1M subscribers',
    avatar: 'MO',
  },
  {
    quote: 'We use it for global medical training. Even complex terminology translates correctly in real-time. Truly remarkable.',
    name: 'Dr. Priya Nair',
    role: 'Medical Education Director',
    company: 'HealthBridge',
    avatar: 'PN',
  },
  {
    quote: '68ms latency feels like magic. My Urdu-speaking clients think I speak their language. This is the future of global business.',
    name: 'Alex Petrov',
    role: 'Founder & CEO',
    company: 'TradeLink',
    avatar: 'AP',
  },
  {
    quote: 'Our support team handles 12 languages with just 3 agents. Customer satisfaction went up 40% in international markets.',
    name: 'Lucia Torres',
    role: 'Head of Customer Success',
    company: 'AppVault',
    avatar: 'LT',
  },
  {
    quote: 'I teach online to students across South Asia and the Middle East. They hear me in their native language. Enrollment doubled.',
    name: 'James Whitfield',
    role: 'Online Educator',
    company: 'LinguaFlow Academy',
    avatar: 'JW',
  },
]

const stats = [
  { value: 180, suffix: 'K+', label: 'Active users' },
  { value: 4.2, suffix: 'M+', label: 'Calls translated', decimals: 1 },
  { value: 4.9, suffix: '/5', label: 'Customer rating', decimals: 1 },
  { value: 99.97, suffix: '%', label: 'Uptime SLA', decimals: 2 },
]

const doubledTestimonials = [...testimonials, ...testimonials]

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        paddingTop: 'clamp(80px, 10vw, 120px)',
        paddingBottom: 'clamp(80px, 9vw, 110px)',
        background:
          'radial-gradient(ellipse at 50% 20%, rgba(234,10,26,0.05), transparent 55%), #050507',
      }}
    >
      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 1200, paddingLeft: 24, paddingRight: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center text-center"
        >
          <SectionLabel>Testimonials</SectionLabel>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              fontWeight: 500,
              color: '#ffffff',
              maxWidth: 560,
              marginTop: 16,
            }}
          >
            Trusted by thousands
          </h2>
        </motion.div>
      </div>

      <div
        className="ticker-wrap relative"
        style={{ marginTop: 'clamp(40px, 6vw, 60px)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="ticker-inner flex"
          style={{
            animationDuration: '55s',
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {doubledTestimonials.map((t, i) => (
            <div key={`${t.name}-${i}`} className="mx-3 shrink-0" style={{ width: 360 }}>
              <TiltCard>
                <TestimonialCard testimonial={t} />
              </TiltCard>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 1200, paddingLeft: 24, paddingRight: 24 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={headingInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
          className="flex flex-wrap justify-center"
          style={{
            marginTop: 'clamp(52px, 7vw, 72px)',
            paddingTop: 'clamp(36px, 5vw, 56px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            gap: 'clamp(24px, 5vw, 64px)',
          }}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 'clamp(28px, 3vw, 40px)',
                  fontWeight: 700,
                  color: '#F4F4F5',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                {s.decimals ? s.value.toFixed(s.decimals) : s.value.toLocaleString()}
                <span style={{ color: RED_BRIGHT }}>{s.suffix}</span>
              </span>
              <span
                style={{
                  marginTop: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10.5px',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.1em',
                }}
              >
                {s.label.toUpperCase()}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial: t }: { testimonial: typeof testimonials[0] }) {
  return (
    <div
      className="flex h-full flex-col"
      style={{
        padding: '26px 24px 22px',
        borderRadius: '18px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(180deg, rgba(14,14,17,0.7), rgba(7,7,10,0.6))',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex" style={{ gap: 2, marginBottom: 16 }}>
        {Array.from({ length: 5 }).map((_, j) => (
          <svg key={j} width="14" height="14" viewBox="0 0 12 12" fill={RED_BRIGHT} opacity={0.8}>
            <path d="M6 1l1.3 3.9H11L8.1 7l1 3.9L6 9 2.9 10.9l1-3.9L1 4.9h3.7L6 1z" />
          </svg>
        ))}
      </div>

      <div className="flex-1">
        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.58,
            color: 'rgba(255,255,255,0.78)',
            letterSpacing: '-0.01em',
          }}
        >
          {t.quote}
        </p>
      </div>

      <div className="mt-5 flex items-center" style={{ gap: 12 }}>
        <div
          className="flex shrink-0 items-center justify-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            background: 'rgba(234,10,26,0.12)',
            color: RED_BRIGHT,
            border: '1px solid rgba(234,10,26,0.22)',
            letterSpacing: '0.02em',
          }}
        >
          {t.avatar}
        </div>
        <div className="flex flex-col min-w-0">
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#e6e6e6', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            {t.name}
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: 2, lineHeight: 1.2 }}>
            {t.role} · {t.company}
          </span>
        </div>
      </div>
    </div>
  )
}

function TiltCard({ children }: { children: ReactNode }) {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), { stiffness: 180, damping: 22 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), { stiffness: 180, damping: 22 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transition: 'box-shadow 0.3s ease',
      }}
      whileHover={{
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(234,10,26,0.12)',
      }}
    >
      {children}
    </motion.div>
  )
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
        style={{ width: 5, height: 5, borderRadius: 999, background: RED_BRIGHT, boxShadow: `0 0 6px ${RED_BRIGHT}` }}
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
