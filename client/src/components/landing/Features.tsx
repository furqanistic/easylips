import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const features = [
  {
    title: 'Live call translation',
    description: 'Speak in your language on any video call — Google Meet, Zoom, or Teams — and participants hear you in their language instantly.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.22 25)" strokeWidth="1.5">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="7" width="12" height="10" rx="2" />
      </svg>
    ),
    color: 'oklch(0.55 0.22 25)',
    span: 'col-span-1 md:col-span-1',
  },
  {
    title: 'Neural voice cloning',
    description: 'Your translated voice sounds like you — same tone, same cadence, same personality. Clone any voice from 10 seconds of audio.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="oklch(0.6 0.2 20)" strokeWidth="1.5">
        <path d="M12 3C10.34 3 9 4.37 9 6V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V6C15 4.37 13.66 3 12 3Z" />
        <path d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10" strokeLinecap="round" />
        <path d="M12 19V22" strokeLinecap="round" />
      </svg>
    ),
    color: 'oklch(0.6 0.2 20)',
    span: 'col-span-1 md:col-span-2',
  },
  {
    title: '70+ languages',
    description: 'From Urdu to Japanese, Arabic to Spanish — every major language with native-level accuracy and natural prosody.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="oklch(0.7 0.2 120)" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <ellipse cx="12" cy="12" rx="4" ry="10" />
        <path d="M2 12H22" />
      </svg>
    ),
    color: 'oklch(0.7 0.2 120)',
    span: 'col-span-1 md:col-span-1',
  },
  {
    title: 'Auto language detection',
    description: 'Switch between languages mid-conversation — BetterLips detects the source language instantly, no manual setup required.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="oklch(0.65 0.22 30)" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: 'oklch(0.65 0.22 30)',
    span: 'col-span-1 md:col-span-2',
  },
  {
    title: '68ms translation latency',
    description: 'Sub-100ms voice translation that keeps conversations flowing naturally — faster than human interpreters.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="oklch(0.6 0.2 200)" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6V12L16 14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'oklch(0.6 0.2 200)',
    span: 'col-span-1 md:col-span-1',
  },
  {
    title: 'Works with your favorite apps',
    description: 'Plug into Google Meet, Zoom, Microsoft Teams, Webex, and any WebRTC-based platform. One click to activate.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.22 25)" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21H16" strokeLinecap="round" />
        <path d="M12 17V21" strokeLinecap="round" />
      </svg>
    ),
    color: 'oklch(0.55 0.22 25)',
    span: 'col-span-1 md:col-span-3',
  },
]

function FeatureCard({
  feature,
  index,
  inView,
}: {
  feature: typeof features[0]
  index: number
  inView: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden ${feature.span}`}
      style={{
        borderRadius: '20px',
        padding: '2px',
        background: hovered
          ? `linear-gradient(135deg, ${feature.color}30, oklch(0.085 0 0))`
          : 'oklch(1 0 0 / 0.04)',
        transition: 'all 0.5s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      <div
        className="h-full"
        style={{
          borderRadius: '18px',
          padding: '32px',
          background: hovered ? 'oklch(0.065 0 0)' : 'oklch(0.075 0 0)',
          transition: 'background 0.5s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex items-center justify-center"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: `${feature.color}12`,
              border: `1px solid ${feature.color}20`,
              boxShadow: hovered ? `0 0 20px ${feature.color}15` : 'none',
              transition: 'box-shadow 0.5s cubic-bezier(0.32,0.72,0,1)',
            }}
          >
            {feature.icon}
          </div>
        </div>
        <h3
          className="mb-3"
          style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'oklch(0.5 0 0)',
            maxWidth: feature.span.includes('3') ? '600px' : '320px',
          }}
        >
          {feature.description}
        </p>
      </div>
    </motion.article>
  )
}

export function Features() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="features"
      ref={ref}
      className="relative overflow-hidden px-6 py-24 sm:px-[50px]"
      style={{ background: '#050208' }}
    >
      {/* Background orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 'min(800px, 90vw)',
          height: 'min(600px, 70vw)',
          background: 'radial-gradient(ellipse at center, oklch(0.55 0.22 25 / 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center gap-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            border: '1px solid oklch(0.55 0.22 25 / 0.15)',
            background: 'oklch(0.55 0.22 25 / 0.06)',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'oklch(0.55 0.22 25)', letterSpacing: '0.073em', textTransform: 'uppercase' }}>
            Features
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="max-w-[620px] text-center"
          style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            fontWeight: 600,
            color: '#ffffff',
          }}
        >
          Every call, in every
          <br />
          <span style={{ color: 'oklch(0.55 0.22 25)' }}>language — instantly</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="max-w-[500px] text-center"
          style={{ fontSize: '15px', lineHeight: 1.6, color: 'oklch(0.5 0 0)' }}
        >
          Real-time voice translation that sits between you and your audience — turning every conversation into a multilingual experience.
        </motion.p>

        {/* Bento Grid */}
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
