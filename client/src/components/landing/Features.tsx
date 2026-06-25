import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'motion/react'
import MagicBento, { type BentoCardProps } from '@/components/MagicBento/MagicBento'
import Lightfall from '@/components/Lightfall/Lightfall'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'
const GLOW_RGB = '234, 10, 26'

const DESKTOP_BREAKPOINT = 1024

export function Features() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const cards: BentoCardProps[] = [
    {
      label: '01',
      title: 'Live call translation',
      description: 'Meet, Zoom, Teams, Webex. Participants hear you in their language — instantly.',
      meta: 'WORKS WITH ANY WEBRTC APP',
      span: 'lg:col-span-2 lg:row-span-2',
      children: <AppChips />,
      background: isDesktop ? <Lightfall /> : undefined,
      color: isDesktop ? 'rgba(10, 10, 13, 0.15)' : undefined,
    },
    {
      label: '02',
      title: '70+ languages',
      description: 'From Urdu to Japanese, with native-level accuracy.',
      meta: '2,000+ PAIRS',
      span: 'lg:col-span-2',
    },
    {
      label: '03',
      title: '68ms latency',
      description: 'Faster than human interpreters. Conversations stay natural.',
      meta: 'SUB-100MS · OPTIMAL',
      span: 'lg:col-span-1',
      children: <LatencyMeter />,
    },
    {
      label: '04',
      title: 'Neural voice cloning',
      description: 'Your translated voice sounds like you — same tone, same cadence.',
      meta: '10SEC SAMPLE',
      span: 'lg:col-span-1',
      children: <CloneWave />,
    },
  ]

  return (
    <section
      id="capabilities"
      ref={ref}
      className="relative overflow-hidden px-5 sm:px-6 lg:px-8"
      style={{
        paddingTop: 'clamp(80px, 10vw, 120px)',
        paddingBottom: 'clamp(72px, 9vw, 112px)',
        background:
          'radial-gradient(circle at 50% 100%, rgba(234,10,26,0.07), transparent 55%), #030306',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 75%)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full flex-col items-center" style={{ maxWidth: 1120 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center text-center"
        >
          <SectionLabel>Capabilities</SectionLabel>
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 'clamp(30px, 4.5vw, 52px)',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              fontWeight: 700,
              color: '#FFFFFF',
              maxWidth: 620,
              marginTop: 16,
              textShadow: '0 2px 30px rgba(0,0,0,0.5)',
            }}
          >
            Built for every
            <br />
            <span style={{ color: RED }}>conversation</span>.
          </h2>
          <p
            style={{
              marginTop: 14,
              maxWidth: 420,
              fontSize: 'clamp(14px, 1.3vw, 16px)',
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '-0.01em',
            }}
          >
            One engine. Every call, every language, every voice.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
          className="mt-14 w-full"
        >
          <MagicBento
            cards={cards}
            glowColor={GLOW_RGB}
            borderColor="rgba(255,255,255,0.08)"
            backgroundDark="#0b0a0d"
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt
            clickEffect={false}
            enableMagnetism={false}
            particleCount={10}
            spotlightRadius={320}
            gap="14px"
          />
        </motion.div>
      </div>
    </section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 8,
        padding: '5px 13px',
        borderRadius: '999px',
        border: '1px solid rgba(234,10,26,0.2)',
        background: 'rgba(234,10,26,0.06)',
      }}
    >
      <span
        style={{
          width: 5, height: 5, borderRadius: 999, background: RED_BRIGHT,
          boxShadow: `0 0 6px ${RED_BRIGHT}`,
        }}
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

function AppChips() {
  const apps = ['Meet', 'Zoom', 'Teams', 'Webex']
  return (
    <div className="flex flex-wrap" style={{ gap: 6 }}>
      {apps.map((app) => (
        <span
          key={app}
          style={{
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.02em',
          }}
        >
          {app}
        </span>
      ))}
    </div>
  )
}

function LatencyMeter() {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: '8%',
            background: `linear-gradient(90deg, ${RED}, ${RED_BRIGHT})`,
            boxShadow: `0 0 10px ${RED_BRIGHT}80`,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        68ms
      </span>
    </div>
  )
}

function CloneWave() {
  const bars = [10, 18, 26, 16, 22, 13, 20, 11, 17, 9, 14, 10, 19, 12, 8, 13]
  return (
    <div className="flex items-end" style={{ gap: 3, height: 30, maxWidth: 360 }}>
      {bars.map((h, i) => (
        <span
          key={i}
          className="ticker-bar rounded-full"
          style={{
            width: 3,
            height: h,
            background: `linear-gradient(180deg, ${RED_BRIGHT}, ${RED})`,
            animationDelay: `${i * 0.07}s`,
            flex: '0 0 auto',
          }}
        />
      ))}
    </div>
  )
}

function CallIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" stroke={RED_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="7" width="12" height="10" rx="2" stroke={RED_BRIGHT} strokeWidth="1.5" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.5" stroke={RED_BRIGHT} strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke={RED_BRIGHT} strokeWidth="1.5" />
      <path d="M2.5 12h19" stroke={RED_BRIGHT} strokeWidth="1.5" />
      <path d="M5 7.5h14M5 16.5h14" stroke={RED_BRIGHT} strokeWidth="1.2" opacity="0.55" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke={RED_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(234,10,26,0.08)" />
    </svg>
  )
}

function CloneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 4c-1.66 0-3 1.37-3 3v5c0 1.66 1.34 3 3 3s3-1.34 3-3V7c0-1.63-1.34-3-3-3z" stroke={RED_BRIGHT} strokeWidth="1.5" />
      <path d="M19 11v1c0 3.87-3.13 7-7 7s-7-3.13-7-7v-1" stroke={RED_BRIGHT} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 19v3" stroke={RED_BRIGHT} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
