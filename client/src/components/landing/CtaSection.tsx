import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="get-started"
      ref={ref}
      className="relative overflow-hidden px-6 py-32"
      style={{ background: '#050208' }}
    >
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(84.6% 73.49% at 50% 26.51%, oklch(0.55 0.22 25 / 0.1), transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(50% 40% at 50% 80%, oklch(0.6 0.2 20 / 0.08), transparent)',
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[800px] flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1"
            style={{
              background: 'oklch(0.7 0.2 120 / 0.08)',
              border: '1px solid oklch(0.7 0.2 120 / 0.15)',
              color: 'oklch(0.7 0.2 120)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.073em',
              textTransform: 'uppercase',
            }}
          >
            <span
              className="animate-pulse-glow"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'oklch(0.7 0.2 120)',
                boxShadow: '0 0 8px oklch(0.7 0.2 120)',
              }}
            />
            Free to start — no credit card
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="mb-5"
          style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            fontWeight: 600,
            color: '#ffffff',
          }}
        >
          Break the language
          <br />
          barrier today
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="mb-10"
          style={{ fontSize: '16px', lineHeight: 1.6, color: 'oklch(0.5 0 0)', maxWidth: '480px' }}
        >
          Join 180,000+ users who communicate across borders with real-time voice translation. Set up in under 60 seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
          className="mb-10 flex flex-wrap justify-center gap-3"
        >
          <CtaPrimary />
          <CtaGhost />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.45 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {['No credit card required', 'Setup in 60 seconds', 'Cancel anytime'].map((item) => (
            <div key={item} className="flex items-center gap-2" style={{ fontSize: '12px', color: 'oklch(0.35 0 0)' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l2.5 2.5L10 3.5" stroke="oklch(1 0 0 / 0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CtaPrimary() {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-2.5"
      style={{
        padding: '14px 28px',
        borderRadius: '999px',
        fontSize: '15px',
        fontWeight: 600,
        background: 'linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.6 0.2 20))',
        color: '#000000',
        textDecoration: 'none',
        boxShadow: hovered
          ? '0 0 40px oklch(0.55 0.22 25 / 0.35), 0 8px 32px oklch(0.55 0.22 25 / 0.2)'
          : '0 0 20px oklch(0.55 0.22 25 / 0.2)',
        transition: 'all 0.4s cubic-bezier(0.32,0.72,0,1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      Create free account
      <span
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'oklch(0 0 0 / 0.12)',
          transform: hovered ? 'translate(2px, -1px)' : 'translate(0,0)',
          transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 8L8 2M8 2H4M8 2V6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  )
}

function CtaGhost() {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-2"
      style={{
        padding: '14px 28px',
        borderRadius: '999px',
        fontSize: '15px',
        fontWeight: 400,
        color: hovered ? '#ffffff' : 'oklch(0.556 0 0)',
        textDecoration: 'none',
        border: `1px solid ${hovered ? 'oklch(1 0 0 / 0.15)' : 'oklch(1 0 0 / 0.08)'}`,
        transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      Talk to sales
    </a>
  )
}
