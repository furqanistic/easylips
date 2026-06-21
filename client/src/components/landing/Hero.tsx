import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'

const metaPills = ['70+ LANGUAGES', '68MS LATENCY', 'VOICE CLONING']

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 50% 0%, rgba(234,10,26,0.18), transparent 42%), linear-gradient(180deg, #020205 0%, #030308 55%, #020205 100%)',
      }}
    >
      <HeroBackground />

      <div
        className="relative z-30 mx-auto flex w-full flex-col items-center px-5 sm:px-6 lg:px-8"
        style={{ paddingTop: 'clamp(110px, 10vw, 150px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.02 }}
        >
          <StatusPill />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.06 }}
          className="text-center"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(34px, 6vw, 72px)',
            lineHeight: 1.04,
            letterSpacing: '-0.045em',
            textRendering: 'geometricPrecision',
            marginTop: 'clamp(18px, 2.5vw, 26px)',
            maxWidth: 880,
          }}
        >
          <span style={{ color: '#F4F4F5' }}>Speak your language.</span>
          <br />
          <span style={{ color: RED }}>They hear theirs.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.14 }}
          className="text-center"
          style={{
            marginTop: '14px',
            maxWidth: 460,
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
            color: 'rgba(255, 255, 255, 0.55)',
          }}
        >
          Real-time AI voice translation for meetings, calls, and live streams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.22 }}
          className="flex flex-wrap items-center justify-center"
          style={{ marginTop: '18px', gap: '10px' }}
        >
          <PrimaryCta />
          <SecondaryCta />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.32 }}
          style={{ marginTop: 'clamp(32px, 5vw, 52px)', width: '100%', maxWidth: 760 }}
        >
          <TranslationConsole />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.44 }}
          style={{ marginTop: 'clamp(20px, 2.5vw, 28px)' }}
        >
          <MetaStrip items={metaPills} />
        </motion.div>
      </div>
    </section>
  )
}

function StatusPill() {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 10,
        padding: '6px 14px 6px 10px',
        borderRadius: '999px',
        border: '1px solid rgba(234,10,26,0.22)',
        background: 'rgba(234,10,26,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span
        className="animate-pulse-glow rounded-full"
        style={{ width: 7, height: 7, background: RED_BRIGHT, boxShadow: `0 0 10px ${RED_BRIGHT}` }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.78)',
          letterSpacing: '0.12em',
        }}
      >
        REAL-TIME · v2.0 · 68MS
      </span>
    </div>
  )
}

function TranslationConsole() {
  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        borderRadius: '22px',
        border: '1px solid rgba(255,255,255,0.09)',
        background: 'linear-gradient(180deg, rgba(16,16,20,0.78), rgba(8,8,11,0.62))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 60px rgba(234,10,26,0.08)',
      }}
    >
      <ConsoleHeader />

      <div
        className="relative flex flex-col items-stretch sm:flex-row sm:items-center"
        style={{ padding: 'clamp(16px, 3vw, 28px)' }}
      >
        <PhraseBlock label="YOU SPEAK" lang="Urdu" phrase="آپ کیسے ہیں؟" arabic />
        <FlowCore />
        <PhraseBlock label="THEY HEAR" lang="English" phrase="How are you?" />
        <ScanLine />
      </div>

      <ConsoleFooter />
    </div>
  )
}

function ConsoleHeader() {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '12px clamp(16px, 3vw, 22px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025), transparent)',
      }}
    >
      <div className="flex items-center" style={{ gap: 8 }}>
        <span
          className="animate-pulse-glow rounded-full"
          style={{ width: 6, height: 6, background: RED_BRIGHT, boxShadow: `0 0 8px ${RED_BRIGHT}` }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10.5px',
            fontWeight: 600,
            color: RED_BRIGHT,
            letterSpacing: '0.14em',
          }}
        >
          TRANSLATING LIVE
        </span>
      </div>
      <div
        className="flex items-center"
        style={{
          gap: 'clamp(10px, 2vw, 18px)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10.5px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.1em',
        }}
      >
        <span>UR → EN</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.62)' }}>68ms</span>
      </div>
    </div>
  )
}

function PhraseBlock({
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
      className="flex flex-1 flex-col"
      style={{
        textAlign: 'center',
        padding: 'clamp(8px, 2vw, 14px) clamp(12px, 2vw, 18px)',
        minWidth: 0,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ gap: 8, marginBottom: '10px' }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: 'rgba(255,255,255,0.38)',
            letterSpacing: '0.14em',
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '10px',
            fontWeight: 600,
            color: '#FCA5A5',
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'rgba(234,10,26,0.12)',
            border: '1px solid rgba(234,10,26,0.24)',
            letterSpacing: '0.04em',
          }}
        >
          {lang}
        </span>
      </div>

      <div
        style={{
          fontFamily: arabic ? "'Noto Naskh Arabic', serif" : "'Manrope', sans-serif",
          fontSize: arabic ? 'clamp(24px, 4vw, 34px)' : 'clamp(22px, 3.4vw, 32px)',
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: arabic ? '0' : '-0.03em',
          color: '#F4F4F5',
          direction: arabic ? 'rtl' : 'ltr',
        }}
      >
        {phrase}
      </div>
    </div>
  )
}

function FlowCore() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ flex: '0 0 auto', padding: '2px 0' }}
    >
      <div
        className="hidden sm:flex items-center"
        style={{ gap: '10px' }}
      >
        <WaveLine />
        <AiCore />
        <WaveLine flipped />
      </div>

      <div
        className="flex sm:hidden flex-col items-center"
        style={{ gap: '10px' }}
      >
        <WaveLine vertical />
        <AiCore />
        <WaveLine vertical flipped />
      </div>
    </div>
  )
}

function AiCore() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 'clamp(48px, 6vw, 58px)', height: 'clamp(48px, 6vw, 58px)' }}
    >
      <span
        className="absolute inset-0 rounded-full ring-pulse"
        style={{ border: `1px solid ${RED}` }}
      />
      <span
        className="absolute rounded-full ring-pulse"
        style={{
          inset: '14%',
          border: `1px solid ${RED_BRIGHT}`,
          animationDelay: '1.1s',
        }}
      />
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 'clamp(40px, 5vw, 48px)',
          height: 'clamp(40px, 5vw, 48px)',
          background: 'linear-gradient(180deg, rgba(28,22,24,0.96), rgba(14,12,13,0.96))',
          border: '1px solid rgba(234,10,26,0.42)',
          boxShadow: '0 4px 18px rgba(0,0,0,0.55), 0 0 24px rgba(234,10,26,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <MicIcon />
      </div>
    </div>
  )
}

function WaveLine({ flipped, vertical }: { flipped?: boolean; vertical?: boolean }) {
  if (vertical) {
    return (
      <svg
        width="24" height="30" viewBox="0 0 24 30" fill="none" aria-hidden
        style={{
          transform: flipped ? 'rotate(180deg)' : 'none',
          filter: 'drop-shadow(0 0 4px rgba(234,10,26,0.4))',
        }}
      >
        <path d="M12 2 Q 4 9, 12 16 T 12 28" stroke={RED_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" className="dash-flow" opacity="0.75" />
      </svg>
    )
  }
  return (
    <svg
      width="60" height="22" viewBox="0 0 60 22" fill="none" aria-hidden
      style={{
        transform: flipped ? 'scaleX(-1)' : 'none',
        filter: 'drop-shadow(0 0 4px rgba(234,10,26,0.4))',
      }}
    >
      <path d="M2 11 Q 11 2, 20 11 T 38 11 T 56 11" stroke={RED_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" className="dash-flow" opacity="0.75" />
    </svg>
  )
}

function ConsoleFooter() {
  const heights = [8, 14, 20, 12, 18, 10, 16, 9, 14, 7, 12, 9, 15, 11, 8, 13, 7, 10]
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '12px clamp(16px, 3vw, 22px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.22)',
        gap: 'clamp(12px, 3vw, 24px)',
      }}
    >
      <div className="flex items-end" style={{ gap: 3, height: 22, flex: 1, maxWidth: 240 }}>
        {heights.map((h, i) => (
          <span
            key={i}
            className="ticker-bar rounded-full"
            style={{
              width: 3,
              height: h,
              background: `linear-gradient(180deg, ${RED_BRIGHT}, ${RED})`,
              animationDelay: `${i * 0.08}s`,
              flex: '0 0 auto',
            }}
          />
        ))}
      </div>
      <div
        className="flex items-center shrink-0"
        style={{ gap: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.36)', letterSpacing: '0.1em' }}
      >
        <span>NOISE CANCEL · ON</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>CLONE · ON</span>
      </div>
    </div>
  )
}

function ScanLine() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="scan-line absolute left-0 right-0"
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${RED_BRIGHT}, transparent)`,
          opacity: 0.4,
        }}
      />
    </div>
  )
}

function MetaStrip({ items }: { items: string[] }) {
  return (
    <div
      className="mx-auto flex flex-wrap items-center justify-center"
      style={{
        padding: '8px 6px',
        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.015)',
      }}
    >
      {items.map((label, i) => (
        <div
          key={label}
          className="flex items-center"
          style={{
            padding: '4px 16px',
            borderRight: i < items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}
        >
          <span
            style={{
              width: 4, height: 4, borderRadius: 999, background: RED_BRIGHT, marginRight: 9, flexShrink: 0,
              boxShadow: `0 0 6px ${RED_BRIGHT}`,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.12em',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

function PrimaryCta() {
  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.2, ease }}>
      <Link
        to="/signup"
        className="inline-flex items-center gap-2"
        style={{
          textDecoration: 'none',
          background: `linear-gradient(135deg, ${RED} 0%, ${RED_BRIGHT} 100%)`,
          color: '#ffffff',
          fontSize: '14.5px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          padding: '12px 22px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(234,10,26,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
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
      whileHover={{ y: -1, borderColor: 'rgba(255,255,255,0.2)' }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease }}
      className="inline-flex items-center gap-2"
      style={{
        textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.02)',
        color: 'rgba(255,255,255,0.82)',
        fontSize: '14.5px',
        fontWeight: 500,
        letterSpacing: '-0.02em',
        padding: '12px 22px',
        borderRadius: '12px',
      }}
    >
      <PlayIcon />
      See how it works
    </motion.a>
  )
}

function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          maskImage: 'radial-gradient(circle at 50% 55%, black 0%, transparent 62%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 55%, black 0%, transparent 62%)',
        }}
      />
      <div
        className="aurora-drift absolute left-1/2 top-[12%] -translate-x-1/2 rounded-full blur-3xl"
        style={{ width: 460, height: 300, background: 'radial-gradient(circle, rgba(234,10,26,0.18), transparent 70%)' }}
      />
      <div
        className="absolute bottom-[4%] left-[-12%] h-[340px] w-[340px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(234,10,26,0.10), transparent 70%)' }}
      />
      <div
        className="absolute bottom-[8%] right-[-10%] h-[300px] w-[300px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(234,10,26,0.09), transparent 70%)' }}
      />
    </div>
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

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 30 30" fill="none" aria-hidden>
      <rect x="10.5" y="3" width="9" height="14" rx="4.5" fill="#ffffff" />
      <path
        d="M6 13V14.5C6 18.6 9.1 21.8 13 22.3V25H9.5V27.5H18.5V25H15V22.3C18.9 21.8 22 18.6 22 14.5V13"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="13" r="1.4" fill={RED_BRIGHT} />
    </svg>
  )
}
