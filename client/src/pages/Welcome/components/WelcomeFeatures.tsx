import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const cardVariant = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease, delay: i * 0.08 },
  }),
}

const features = [
  {
    tag: 'Real-time', title: 'Ultra-low latency streaming',
    description: 'Continuous voice translation under 80ms with no interruptions. Conversations flow as naturally as speaking face-to-face.',
    accent: 'rgba(86,194,255,0.08)', accentBorder: 'rgba(86,194,255,0.12)', accentColor: '#56c2ff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2v4M9 12v4M2 9h4M12 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    tag: 'Voice AI', title: 'Preserve your voice\'s personality',
    description: 'Our AI captures tone, pitch, pacing, and emotional nuance — not just words. Your translated voice feels authentically yours.',
    accent: 'rgba(82,48,145,0.1)', accentBorder: 'rgba(82,48,145,0.15)', accentColor: '#a78bfa',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="7" y="2" width="4" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 9c0 2.76 2.24 5 5 5s5-2.24 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 14v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    tag: 'Detection', title: 'Auto language detection',
    description: 'Switch languages mid-conversation. OneLingo detects the source language instantly so you never have to configure anything.',
    accent: 'rgba(89,212,153,0.08)', accentBorder: 'rgba(89,212,153,0.12)', accentColor: '#59d499',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 2c0 0-3 3-3 7s3 7 3 7M9 2c0 0 3 3 3 7s-3 7-3 7" stroke="currentColor" strokeWidth="1" />
        <path d="M2 9h14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    tag: 'Dubbing', title: 'Multilingual video dubbing',
    description: 'Dub your videos in 70+ languages with lip-sync aware AI voice cloning. Grow your global audience instantly.',
    accent: 'rgba(255,99,99,0.08)', accentBorder: 'rgba(255,99,99,0.12)', accentColor: '#ff6363',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 6h4M3 9h2M3 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 4l6 5-6 5V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const transcriptRows = [
  { speaker: 'Alex', lang: 'EN', text: 'Our Q3 target is 40% growth...', color: '#56c2ff', time: '0:04' },
  { speaker: 'María', lang: 'ES', text: 'Nuestro objetivo para el T3 es un crecimiento del 40%...', color: '#a78bfa', time: '0:05' },
  { speaker: 'Kenji', lang: 'JA', text: '私たちの第3四半期の目標は40%の成長です...', color: '#59d499', time: '0:06' },
]

export function WelcomeFeatures() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section id="features" ref={ref} style={{ position: 'relative', padding: '128px 0', overflow: 'hidden', background: '#040506' }}>
      {/* Violet atmosphere */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(86.88% 75.47% at 50% 24.53%, rgba(82,48,145,0.45), rgba(26,11,51,0.1))',
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
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: '999px', marginBottom: '20px',
            background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
            color: '#a78bfa', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.073em', textTransform: 'uppercase',
          }}>
            Platform Features
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1,
            letterSpacing: '-0.04em', fontWeight: 600, color: '#ffffff',
            marginBottom: '16px',
          }}>
            Translation that understands
            <br />more than language
          </h2>
          <p style={{ maxWidth: '420px', fontSize: '16px', lineHeight: 1.6, color: '#6a6b6c' }}>
            Built on the latest multimodal AI models to deliver nuanced, contextually aware translation at real-time speed.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="bento-grid">

          {/* Large card — col span 2 */}
          <motion.div
            custom={0} variants={cardVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="bento-large"
            style={{ padding: '6px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div style={{ borderRadius: '15px', padding: '28px', minHeight: '280px', display: 'flex', flexDirection: 'column',
              background: '#07080a', boxShadow: 'rgba(255,255,255,0.03) 0px 1px 0px 0px inset' }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', marginBottom: '20px', width: 'fit-content',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 500,
                background: '#1b1c1e', color: '#56c2ff', letterSpacing: '0.04em' }}>
                AI Transcription
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', width: 'fit-content', marginBottom: '16px',
                background: 'rgba(86,194,255,0.1)', color: '#56c2ff' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 6h12M4 10h8M4 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                Every word, perfectly captured
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#6a6b6c', marginBottom: '24px' }}>
                Speaker-separated transcription with full punctuation, timestamps, and export in 12 formats. Perfect for meetings, lectures, and interviews.
              </p>
              <div style={{ marginTop: 'auto', padding: '16px', borderRadius: '11px',
                background: '#111214', border: '1px solid rgba(255,255,255,0.05)' }}>
                {transcriptRows.map((row, i) => (
                  <div key={row.speaker} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '8px 0',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 500,
                      color: row.color, letterSpacing: '0.04em', flexShrink: 0, marginTop: '2px' }}>
                      {row.lang}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '11px', fontWeight: 500, color: '#ffffff' }}>{row.speaker}</span>
                      <p style={{ fontSize: '12px', color: '#6a6b6c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.text}
                      </p>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#454647', flexShrink: 0 }}>
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column — 2 stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.slice(0, 2).map((feat, i) => (
              <motion.div
                key={feat.title}
                custom={i + 1} variants={cardVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                style={{ flex: 1, padding: '6px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div style={{ borderRadius: '15px', padding: '24px', height: '100%',
                  background: feat.accent, border: `1px solid ${feat.accentBorder}`,
                  boxShadow: 'rgba(255,255,255,0.03) 0px 1px 0px 0px inset' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', marginBottom: '16px', width: 'fit-content',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 500,
                    background: '#1b1c1e', color: feat.accentColor, letterSpacing: '0.04em' }}>
                    {feat.tag}
                  </span>
                  <div style={{ padding: '8px', borderRadius: '8px', width: 'fit-content', marginBottom: '12px',
                    background: `${feat.accentColor}18`, color: feat.accentColor }}>
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#6a6b6c' }}>{feat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom row — 2 cards + 1 */}
          {features.slice(2).map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i + 3} variants={cardVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              style={{ padding: '6px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div style={{ borderRadius: '15px', padding: '24px', height: '100%',
                background: feat.accent, border: `1px solid ${feat.accentBorder}`,
                boxShadow: 'rgba(255,255,255,0.03) 0px 1px 0px 0px inset' }}>
                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', marginBottom: '16px', width: 'fit-content',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 500,
                  background: '#1b1c1e', color: feat.accentColor, letterSpacing: '0.04em' }}>
                  {feat.tag}
                </span>
                <div style={{ padding: '8px', borderRadius: '8px', width: 'fit-content', marginBottom: '12px',
                  background: `${feat.accentColor}18`, color: feat.accentColor }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 500, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#6a6b6c' }}>{feat.description}</p>
              </div>
            </motion.div>
          ))}

          {/* Scale card */}
          <motion.div
            custom={5} variants={cardVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ padding: '6px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div style={{ borderRadius: '15px', padding: '24px', height: '100%',
              background: 'rgba(89,212,153,0.07)', border: '1px solid rgba(89,212,153,0.12)',
              boxShadow: 'rgba(255,255,255,0.03) 0px 1px 0px 0px inset' }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', marginBottom: '16px', width: 'fit-content',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 500,
                background: '#1b1c1e', color: '#59d499', letterSpacing: '0.04em' }}>
                Scale
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', width: 'fit-content', marginBottom: '12px',
                background: 'rgba(89,212,153,0.15)', color: '#59d499' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 5h12M3 9h8M3 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 500, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                2,000+ language combinations
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#6a6b6c' }}>
                From Spanish to Japanese, Arabic to Swahili — every pair you need with the same quality and speed.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
