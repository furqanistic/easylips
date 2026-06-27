import { useRef } from 'react'
import ColorBends from '@/components/ColorBends/ColorBends'
import { motion, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'

// Refined on-brand red: fewer, richer bands -> a calmer, more premium flow
const HERO_BEND_COLORS = ['#ff5a6a', '#ea0a1a', '#7a0612']

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050308' }}
    >
      {/* Living backdrop */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ y: bgY, scale: bgScale }}
        aria-hidden
      >
        <ColorBends
          className="absolute inset-0 size-full"
          style={{ width: '100%', height: '100%' }}
          colors={HERO_BEND_COLORS}
          rotation={30}
          speed={0.16}
          autoRotate={1.2}
          scale={1.1}
          frequency={0.85}
          warpStrength={1.15}
          mouseInfluence={0.4}
          parallax={0.25}
          noise={0.025}
          iterations={3}
          intensity={1.25}
          bandWidth={3.2}
          transparent
        />
      </motion.div>

      {/* Legibility washes — darker focal vignette so type pops over the bends */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 44%, rgba(5,3,8,0.72) 0%, rgba(5,3,8,0.45) 38%, rgba(5,3,8,0.2) 62%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-44"
          style={{ background: 'linear-gradient(180deg, rgba(5,3,8,0.95), transparent)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-44"
          style={{ background: 'linear-gradient(0deg, rgba(5,3,8,0.95), transparent)' }}
        />
      </div>

      {/* Cinematic content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-20 mx-auto flex w-full flex-col items-center px-6 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.12 }}
          className="max-w-5xl"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2.75rem, 6.4vw, 5.5rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.05em',
            textRendering: 'geometricPrecision',
            color: '#FFFFFF',
            textShadow: '0 2px 40px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.6)',
          }}
        >
          Speak your language.
          <br />
          <span
            style={{
              color: '#ff2d3f',
              textShadow:
                '0 0 50px rgba(255,45,63,0.45), 0 0 18px rgba(255,45,63,0.35), 0 2px 30px rgba(0,0,0,0.5)',
            }}
          >
            They hear theirs.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.22 }}
          className="mt-7 max-w-xl"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(17px, 1.7vw, 21px)',
            lineHeight: 1.5,
            letterSpacing: '-0.012em',
            color: 'rgba(255,255,255,0.82)',
            textShadow: '0 1px 18px rgba(0,0,0,0.6)',
          }}
        >
          AI voice translation for meetings, calls, and live streams — delivered in
          70+ languages with natural-sounding voices and imperceptible latency.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.32 }}
          className="mt-9 flex flex-wrap items-center justify-center"
          style={{ gap: '12px' }}
        >
          <PrimaryCta />
          <SecondaryCta />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.44 }}
          className="mt-14 w-full"
          style={{ maxWidth: 680 }}
        >
          <LiveTranslationStrip />
        </motion.div>
      </motion.div>

      <ScrollCue />
    </section>
  )
}

function PrimaryCta() {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
      <Link
        to="/auth"
        className="inline-flex items-center gap-2.5"
        style={{
          textDecoration: 'none',
          background: `linear-gradient(135deg, ${RED} 0%, ${RED_BRIGHT} 100%)`,
          color: '#ffffff',
          fontSize: '15px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          padding: '14px 26px',
          borderRadius: '14px',
          boxShadow: '0 10px 30px rgba(234,10,26,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
      >
        <WaveformIcon />
        Start Translating
      </Link>
    </motion.div>
  )
}

function SecondaryCta() {
  return (
    <motion.a
      href="#capabilities"
      whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.22)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease }}
      className="inline-flex items-center gap-2.5"
      style={{
        textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        color: 'rgba(255,255,255,0.86)',
        fontSize: '15px',
        fontWeight: 500,
        letterSpacing: '-0.02em',
        padding: '14px 26px',
        borderRadius: '14px',
      }}
    >
      <PlayIcon />
      See how it works
    </motion.a>
  )
}

function LiveTranslationStrip() {
  return (
    <div
      className="relative mx-auto flex flex-col items-stretch overflow-hidden sm:flex-row sm:items-center"
      style={{
        borderRadius: '18px',
        border: '1px solid rgba(255,255,255,0.14)',
        background: 'linear-gradient(180deg, rgba(10,8,12,0.82), rgba(5,4,8,0.72))',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        boxShadow:
          '0 24px 70px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 50px rgba(234,10,26,0.06)',
      }}
    >
      <Phrase label="You speak" lang="Urdu" phrase="آپ کیسے ہیں؟" arabic />
      <Divider />
      <Phrase label="They hear" lang="English" phrase="How are you?" />
    </div>
  )
}

function Phrase({
  label,
  lang,
  phrase,
  arabic,
}: {
  label: string
  lang: string
  phrase: string
  arabic?: boolean
}) {
  return (
    <div
      className="flex flex-1 flex-col items-center"
      style={{ padding: '18px 16px', minWidth: 0 }}
    >
      <div className="flex items-center" style={{ gap: 8, marginBottom: 10 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.16em',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: '#FCA5A5',
            padding: '2px 9px',
            borderRadius: '999px',
            background: 'rgba(234,10,26,0.16)',
            border: '1px solid rgba(234,10,26,0.32)',
            letterSpacing: '0.04em',
          }}
        >
          {lang}
        </span>
      </div>
      <div
        style={{
          fontFamily: arabic ? "'Noto Naskh Arabic', serif" : "'Manrope', sans-serif",
          fontSize: arabic ? 'clamp(22px, 3.2vw, 30px)' : 'clamp(21px, 3vw, 29px)',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: arabic ? '0' : '-0.03em',
          color: '#FFFFFF',
          direction: arabic ? 'rtl' : 'ltr',
          textShadow: '0 2px 18px rgba(0,0,0,0.5)',
        }}
      >
        {phrase}
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center justify-center" style={{ flex: '0 0 auto' }}>
      <div
        className="hidden sm:block"
        style={{ width: 1, height: 44, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)' }}
      />
      <div
        className="sm:hidden"
        style={{ width: 44, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
      />
    </div>
  )
}

function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease, delay: 0.9 }}
      className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2"
      aria-hidden
    >
      <div
        className="flex flex-col items-center"
        style={{ gap: 8, color: 'rgba(255,255,255,0.4)' }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9.5px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
        <span className="scroll-cue-line" style={{ width: 1, height: 34, background: 'rgba(255,255,255,0.25)' }} />
      </div>
    </motion.div>
  )
}

function WaveformIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="1" y="7" width="2" height="4" rx="1" fill="#ffffff" />
      <rect x="4.6" y="4" width="2" height="10" rx="1" fill="#ffffff" />
      <rect x="8.2" y="2" width="2" height="14" rx="1" fill="#ffffff" />
      <rect x="11.8" y="5" width="2" height="8" rx="1" fill="#ffffff" />
      <rect x="15.4" y="7.5" width="2" height="3" rx="1" fill="#ffffff" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <path d="M7 5.8L12.3 9L7 12.2V5.8Z" fill="currentColor" />
    </svg>
  )
}
