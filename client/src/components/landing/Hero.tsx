import { motion } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'

const features = ['70+ languages', 'Low latency', 'Meetings + Live streams']

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 50% 0%, rgba(234,10,26,0.16), transparent 38%), linear-gradient(180deg, #010104 0%, #020206 55%, #010104 100%)',
      }}
    >
      <HeroBackground />

      <div
        className="relative z-30 mx-auto flex w-full flex-col items-center px-5 sm:px-6 lg:px-8"
        style={{ maxWidth: 980, paddingTop: 'clamp(96px, 9vw, 120px)', paddingBottom: 'clamp(20px, 2vw, 28px)' }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.03 }}
          className="text-center"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(30px, 5vw, 60px)',
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            textRendering: 'geometricPrecision',
          }}
        >
          <span style={{ color: '#F4F4F5' }}>Speak your language.</span>
          <br />
          <span style={{ color: RED }}>They hear theirs.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.1 }}
          className="text-center"
          style={{
            marginTop: '10px',
            maxWidth: 520,
            fontSize: 'clamp(14px, 1.3vw, 17px)',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
            color: 'rgba(255, 255, 255, 0.55)',
          }}
        >
          Real-time AI voice translation for meetings, calls, support, and live streams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.18 }}
          className="flex flex-wrap items-center justify-center"
          style={{ marginTop: '14px', gap: '10px' }}
        >
          <PrimaryCta />
          <SecondaryCta />
          <WindowsDownloadBtn />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.26 }}
          style={{ marginTop: 'clamp(20px, 3vw, 32px)', width: '100%' }}
        >
          <TranslationStrip />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.36 }}
          style={{ marginTop: 'clamp(14px, 2vw, 20px)' }}
        >
          <FeatureBar items={features} />
        </motion.div>
      </div>
    </section>
  )
}

function TranslationStrip() {
  return (
    <div
      className="mx-auto flex flex-col items-stretch overflow-hidden"
      style={{
        maxWidth: 720,
        borderRadius: '18px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(180deg, rgba(20,20,22,0.7), rgba(10,10,12,0.55))',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="flex flex-col items-stretch sm:flex-row sm:items-center"
        style={{ padding: 'clamp(10px, 2vw, 16px)' }}
      >
        <PhraseBlock
          label="You speak"
          lang="Urdu"
          phrase="آپ کیسے ہیں؟"
          isArabic
        />

        <FlowDivider />

        <PhraseBlock
          label="They hear"
          lang="English"
          phrase="How are you?"
        />
      </div>
    </div>
  )
}

function PhraseBlock({
  label,
  lang,
  phrase,
  isArabic,
}: {
  label: string
  lang: string
  phrase: string
  isArabic?: boolean
}) {
  return (
    <div
      className="flex flex-1 flex-col"
      style={{
        textAlign: 'center',
        padding: 'clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 16px)',
        minWidth: 0,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ gap: '7px', marginBottom: '6px' }}
      >
        <span
          style={{
            fontSize: '10.5px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10.5px',
            fontWeight: 600,
            color: '#FCA5A5',
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'rgba(234,10,26,0.12)',
            border: '1px solid rgba(234,10,26,0.24)',
          }}
        >
          {lang}
        </span>
      </div>

      <div
        style={{
          fontFamily: isArabic ? "'Noto Naskh Arabic', serif" : "'Manrope', sans-serif",
          fontSize: isArabic ? 'clamp(22px, 3.5vw, 30px)' : 'clamp(20px, 3vw, 28px)',
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: isArabic ? '0' : '-0.03em',
          color: '#F4F4F5',
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        {phrase}
      </div>
    </div>
  )
}

function FlowDivider() {
  return (
    <div
      className="flex items-center justify-center"
        style={{
          flex: '0 0 auto',
          padding: '2px 0',
      }}
    >
      {/* Horizontal on desktop */}
      <div
        className="hidden sm:flex items-center"
        style={{ gap: '8px' }}
      >
        <WaveLine />
        <AiBadge />
        <WaveLine flipped />
      </div>

      {/* Vertical on mobile */}
      <div
        className="flex sm:hidden flex-col items-center"
        style={{ gap: '8px' }}
      >
        <WaveLine vertical />
        <AiBadge />
        <WaveLine vertical flipped />
      </div>
    </div>
  )
}

function AiBadge() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 'clamp(44px, 6vw, 54px)', height: 'clamp(44px, 6vw, 54px)' }}
    >
      <span
        className="absolute inset-0 rounded-full ring-pulse"
        style={{ border: `1px solid ${RED}` }}
      />
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 'clamp(38px, 5vw, 46px)',
          height: 'clamp(38px, 5vw, 46px)',
          background: 'linear-gradient(180deg, rgba(26,20,22,0.96), rgba(14,12,13,0.96))',
          border: `1px solid rgba(234,10,26,0.4)`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5), 0 0 20px rgba(234,10,26,0.25)',
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
        width="24"
        height="28"
        viewBox="0 0 24 28"
        fill="none"
        aria-hidden
        style={{
          transform: flipped ? 'rotate(180deg)' : 'none',
          filter: 'drop-shadow(0 0 4px rgba(234,10,26,0.35))',
        }}
      >
        <path
          d="M12 2 Q 4 8, 12 14 T 12 26"
          stroke={RED_BRIGHT}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          className="dash-flow"
          opacity="0.7"
        />
      </svg>
    )
  }
  return (
    <svg
      width="56"
      height="20"
      viewBox="0 0 56 20"
      fill="none"
      aria-hidden
      style={{
        transform: flipped ? 'scaleX(-1)' : 'none',
        filter: 'drop-shadow(0 0 4px rgba(234,10,26,0.35))',
      }}
    >
      <path
        d="M2 10 Q 10 2, 18 10 T 34 10 T 50 10"
        stroke={RED_BRIGHT}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 4"
        className="dash-flow"
        opacity="0.7"
      />
    </svg>
  )
}

function PrimaryCta() {
  return (
    <motion.a
      href="#get-started"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease }}
      className="inline-flex items-center gap-2"
      style={{
        textDecoration: 'none',
        background: `linear-gradient(135deg, ${RED} 0%, ${RED_BRIGHT} 100%)`,
        color: '#ffffff',
        fontSize: '14.5px',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        padding: '11px 20px',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(234,10,26,0.25)',
      }}
    >
      <WaveformIcon />
      Start Translating
    </motion.a>
  )
}

function SecondaryCta() {
  return (
    <motion.a
      href="#demo"
      whileHover={{ y: -1, borderColor: 'rgba(255,255,255,0.18)' }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease }}
      className="inline-flex items-center gap-2"
      style={{
        textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.02)',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '14.5px',
        fontWeight: 500,
        letterSpacing: '-0.02em',
        padding: '11px 20px',
        borderRadius: '12px',
      }}
    >
      <PlayIcon />
      Watch Demo
    </motion.a>
  )
}

function WindowsDownloadBtn() {
  return (
    <motion.a
      href="#download-windows"
      whileHover={{ y: -1, borderColor: 'rgba(234,10,26,0.5)', boxShadow: '0 6px 24px rgba(234,10,26,0.22)' }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease }}
      className="inline-flex items-center gap-2.5"
      style={{
        textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'linear-gradient(180deg, rgba(22,22,24,0.9), rgba(12,12,14,0.8))',
        color: '#F4F4F5',
        fontSize: '14.5px',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        padding: '11px 20px',
        borderRadius: '12px',
      }}
    >
      <WindowsIcon />
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Download for
        </span>
        Windows
      </span>
    </motion.a>
  )
}

function FeatureBar({ items }: { items: string[] }) {
  return (
    <div
      className="mx-auto flex flex-wrap items-center justify-center"
      style={{
        padding: '7px 4px',
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
            padding: '4px 14px',
            borderRight: i < items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}
        >
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.25)',
              marginRight: 8,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '-0.01em',
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

function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(circle at 50% 60%, black 0%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 60%, black 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute bottom-[5%] left-[-10%] h-[320px] w-[320px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(234,10,26,0.10), transparent 70%)' }}
      />
      <div
        className="absolute bottom-[10%] right-[-8%] h-[280px] w-[280px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(234,10,26,0.08), transparent 70%)' }}
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

function WindowsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 5.4L10.3 4.4V11H3V5.4Z" fill="#ea0a1a" />
      <path d="M12 4.1L21 2.8V11H12V4.1Z" fill="#ea0a1a" />
      <path d="M3 13H10.3V19.6L3 18.6V13Z" fill="#ea0a1a" />
      <path d="M12 13H21V21.2L12 19.9V13Z" fill="#ea0a1a" />
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
