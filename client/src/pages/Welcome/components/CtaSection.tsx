import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="get-started" ref={ref} style={{ position: 'relative', padding: '128px 0', overflow: 'hidden', background: '#040506' }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(84.6% 73.49% at 50% 26.51%, rgba(4,63,150,0.6), rgba(6,18,37,0.2))',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(50% 40% at 50% 80%, rgba(82,48,145,0.35), transparent)',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: '32px' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: '999px',
            background: 'rgba(89,212,153,0.1)', border: '1px solid rgba(89,212,153,0.2)',
            color: '#59d499', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.073em', textTransform: 'uppercase',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#59d499', boxShadow: '0 0 6px #59d499' }} />
            Free to start — no credit card
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          style={{
            fontSize: 'clamp(32px, 5vw, 60px)', lineHeight: 1.05,
            letterSpacing: '-0.04em', fontWeight: 600, color: '#ffffff', marginBottom: '20px',
          }}
        >
          Start speaking every
          <br />language today
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          style={{ fontSize: '16px', lineHeight: 1.6, color: '#9c9c9d', maxWidth: '480px', marginBottom: '40px' }}
        >
          Join 180,000+ users who communicate across borders with AI-powered voice translation. Set up in under 60 seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}
        >
          <CtaPrimary />
          <CtaGhost />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.45 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px' }}
        >
          {['No credit card required', 'Setup in 60 seconds', 'Cancel anytime'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#454647' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l2.5 2.5L10 3.5" stroke="#363739" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 500,
        background: hovered ? '#ffffff' : '#e6e6e6', color: '#2f3031', textDecoration: 'none',
        boxShadow: 'rgba(0,0,0,0.03) 0px 7px 3px 0px, rgba(0,0,0,0.25) 0px 4px 4px 0px',
        transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      Create free account
      <span style={{
        width: '20px', height: '20px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.12)',
        transform: hovered ? 'translate(2px, -1px)' : 'translate(0,0)',
        transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 8L8 2M8 2H4M8 2V6" stroke="#2f3031" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 400,
        color: hovered ? '#ffffff' : '#9c9c9d', textDecoration: 'none',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
        transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      Talk to sales
    </a>
  )
}
