import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const steps = [
  {
    number: '01', title: 'Speak naturally', color: '#56c2ff',
    description: 'Start talking in your language. EasyLips captures your voice in real-time with noise cancellation — no push-to-talk, no pauses required.',
    tags: ['Continuous voice stream', 'Noise suppression', 'Speaker detection'],
  },
  {
    number: '02', title: 'AI translates instantly', color: '#a78bfa',
    description: 'Our multilingual AI model processes speech, preserves context, tone, and intent, then synthesizes a natural-sounding translation in under 80ms.',
    tags: ['Gemini 3.5 Live', 'Context-aware', 'Tone preservation'],
  },
  {
    number: '03', title: 'Your audience hears you', color: '#59d499',
    description: 'The translated voice plays back in real-time through calls, meetings, streams, or your device\'s speaker — matching your pacing and personality.',
    tags: ['WebRTC output', 'Natural prosody', '70+ languages'],
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section id="how-it-works" ref={ref} style={{ position: 'relative', padding: '128px 0', overflow: 'hidden', background: '#040506' }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(84.6% 73.49% at 50% 26.51%, rgba(4,63,150,0.5), rgba(6,18,37,0.15))',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '80px' }}
        >
          <span style={{
            display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', marginBottom: '20px',
            background: 'rgba(86,194,255,0.1)', border: '1px solid rgba(86,194,255,0.2)',
            color: '#56c2ff', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.073em', textTransform: 'uppercase',
          }}>
            How it works
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1,
            letterSpacing: '-0.04em', fontWeight: 600, color: '#ffffff',
          }}>
            From voice to translation
            <br />in three steps
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid-3" style={{ gap: '1px', position: 'relative' }}>
          {/* Connector */}
          <div className="hidden md:block" style={{
            position: 'absolute', top: '52px',
            left: 'calc(16.66% + 24px)', right: 'calc(16.66% + 24px)',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(86,194,255,0.4), rgba(167,139,250,0.4), rgba(89,212,153,0.4))',
          }} />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.12 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px' }}
            >
              <div style={{
                position: 'relative', zIndex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '48px', height: '48px', borderRadius: '50%', marginBottom: '24px',
                background: '#07080a',
                border: `1px solid ${step.color}30`,
                boxShadow: `0 0 20px ${step.color}15`,
              }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 500,
                  color: step.color, letterSpacing: '0.05em',
                }}>
                  {step.number}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#6a6b6c', marginBottom: '16px' }}>
                {step.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
                {step.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '6px',
                    fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.02em',
                    background: '#111214', color: '#6a6b6c',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Latency bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.5 }}
          style={{ marginTop: '64px', padding: '6px', borderRadius: '20px', maxWidth: '600px', margin: '64px auto 0',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div style={{ borderRadius: '15px', padding: '24px', background: '#07080a' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#ffffff' }}>Average translation latency</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', fontWeight: 600, color: '#59d499', letterSpacing: '-0.02em' }}>
                68ms
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '3px', overflow: 'hidden', background: '#1b1c1e' }}>
              <div style={{
                height: '100%', width: '8.5%', borderRadius: '3px',
                background: 'linear-gradient(90deg, #59d499, #56c2ff)',
                boxShadow: '0 0 8px rgba(89,212,153,0.4)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#454647' }}>0ms</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#454647' }}>800ms (industry avg)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
