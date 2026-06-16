import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const useCases = [
  {
    id: 'meetings', tag: 'Business',
    title: 'Global meetings without language gaps',
    description: 'Run multilingual meetings on Zoom, Teams, or Google Meet. Everyone hears and speaks in their native language while you communicate in yours.',
    items: ['Real-time voice translation in calls', 'Speaker identification & transcript', 'Export meeting notes in any language', 'Integrates with Zoom, Teams, Meet'],
    color: '#56c2ff', gradient: 'rgba(86,194,255,0.06)', border: 'rgba(86,194,255,0.1)',
  },
  {
    id: 'travel', tag: 'Travel',
    title: 'Your pocket interpreter everywhere',
    description: 'Navigate airports, restaurants, hotels, and markets with instant voice translation. No internet required with offline mode for 30+ languages.',
    items: ['Works offline — 30+ languages', 'Instant two-way conversation mode', 'Cultural context hints', 'Whisper mode for quiet spaces'],
    color: '#59d499', gradient: 'rgba(89,212,153,0.06)', border: 'rgba(89,212,153,0.1)',
  },
  {
    id: 'streaming', tag: 'Content',
    title: 'Reach global audiences live',
    description: 'Broadcast to international viewers with real-time multilingual audio. Grow your audience beyond language barriers on YouTube, Twitch, and more.',
    items: ['Multi-language simultaneous streams', 'AI voice that matches your energy', 'Subtitle generation in real-time', 'Works with OBS, StreamLabs'],
    color: '#a78bfa', gradient: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.1)',
  },
  {
    id: 'education', tag: 'Education',
    title: 'Teach and learn across languages',
    description: 'Deliver lectures, tutoring sessions, and online courses to students worldwide. EasyLips keeps educational nuance intact across translation.',
    items: ['Lecture translation in real-time', 'Student Q&A in any language', 'Course content dubbing', 'LMS platform integrations'],
    color: '#ff6363', gradient: 'rgba(255,99,99,0.06)', border: 'rgba(255,99,99,0.1)',
  },
]

const avatarColors = [['#56c2ff20', '#56c2ff'], ['#a78bfa20', '#a78bfa'], ['#59d49920', '#59d499'], ['#ff636320', '#ff6363']]

export function UseCases() {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })
  const current = useCases[active]

  const waveData = Array.from({ length: 40 }, (_, j) => ({
    h: 6 + Math.abs(Math.sin(j * 0.5)) * 16,
    active: j % 3 !== 0,
    filled: j < 28,
  }))

  return (
    <section ref={ref} style={{ position: 'relative', padding: '128px 0', overflow: 'hidden', background: '#040506' }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(84.6% 73.49% at 50% 26.51%, rgba(4,63,150,0.45), rgba(6,18,37,0.15))',
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
            background: 'rgba(86,194,255,0.1)', border: '1px solid rgba(86,194,255,0.2)',
            color: '#56c2ff', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.073em', textTransform: 'uppercase',
          }}>
            Use Cases
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1,
            letterSpacing: '-0.04em', fontWeight: 600, color: '#ffffff',
          }}>
            Built for every voice,
            <br />every context
          </h2>
        </motion.div>

        {/* Tab selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '48px' }}
        >
          {useCases.map((uc, i) => (
            <button
              key={uc.id}
              onClick={() => setActive(i)}
              style={{
                padding: '8px 16px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 500,
                background: active === i ? '#07080a' : 'transparent',
                color: active === i ? '#ffffff' : '#6a6b6c',
                border: active === i ? `1px solid ${uc.color}30` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: active === i ? `0 0 12px ${uc.color}15` : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
              }}
            >
              <span style={{ color: active === i ? uc.color : 'inherit', marginRight: '6px' }}>·</span>
              {uc.tag}
            </button>
          ))}
        </motion.div>

        {/* Active case */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          style={{ padding: '6px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div style={{ borderRadius: '15px', padding: '40px',
            background: current.gradient, border: `1px solid ${current.border}` }}>
            <div className="grid-2" style={{ gap: '40px' }}>
              {/* Left */}
              <div>
                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', marginBottom: '20px', width: 'fit-content',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 500,
                  background: '#1b1c1e', color: current.color, letterSpacing: '0.04em' }}>
                  {current.tag}
                </span>
                <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 600, color: '#ffffff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                  {current.title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#9c9c9d', marginBottom: '24px' }}>
                  {current.description}
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
                  {current.items.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{
                        marginTop: '4px', width: '16px', height: '16px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        background: `${current.color}20`,
                      }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l1.5 1.5L6.5 2" stroke={current.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span style={{ fontSize: '14px', color: '#9c9c9d' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — mock */}
              <div>
                <div style={{ padding: '16px', borderRadius: '11px', background: '#07080a', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6a6b6c', letterSpacing: '0.04em' }}>
                      {current.id} · active session
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#59d499' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#59d499', boxShadow: '0 0 6px #59d499' }} />
                      Recording
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                    {[
                      { name: 'You', lang: 'EN', active: true },
                      { name: 'Carlos M.', lang: 'ES', active: false },
                      { name: 'Yuki T.', lang: 'JA', active: false },
                      { name: 'Fatima A.', lang: 'AR', active: false },
                    ].map((p, i) => (
                      <div key={p.name} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px',
                        background: p.active ? `${current.color}10` : '#111214',
                        border: p.active ? `1px solid ${current.color}25` : '1px solid rgba(255,255,255,0.04)',
                      }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 600, flexShrink: 0,
                          background: avatarColors[i][0], color: avatarColors[i][1],
                        }}>
                          {p.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 500, color: p.active ? '#ffffff' : '#9c9c9d' }}>{p.name}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.04em',
                            color: p.active ? current.color : '#454647' }}>{p.lang}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '32px' }}>
                    {waveData.map((bar, j) => (
                      <div key={j} style={{
                        width: '2px', borderRadius: '1px', flexShrink: 0,
                        height: `${bar.h}px`,
                        background: bar.active ? current.color : 'rgba(255,255,255,0.1)',
                        opacity: bar.filled ? 0.8 : 0.3,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
