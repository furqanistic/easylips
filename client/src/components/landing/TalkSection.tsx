import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'

const cardShell = {
  borderRadius: 18,
  border: '1px solid rgba(255, 255, 255, 0.09)',
  background: 'linear-gradient(180deg, rgba(18, 18, 20, 0.82), rgba(10, 10, 12, 0.65))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
} as const

export function TalkSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })

  return (
    <section
      id="talk"
      ref={ref}
      className="relative overflow-hidden bg-black px-5 py-12 sm:px-6 lg:px-6 lg:py-[clamp(72px,9vw,112px)] lg:pb-[clamp(80px,10vw,120px)]"
    >
      <div className="relative z-10 mx-auto w-full lg:max-w-[1080px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease }}
          className="flex flex-col items-center text-center"
        >
          <h2
            className="max-w-[640px] text-[28px] leading-[1.12] tracking-[-0.02em] text-white sm:text-[32px] lg:text-[clamp(34px,5vw,56px)]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
            }}
          >
            Talk naturally.
            <br />
            Be understood{' '}
            <span className="relative inline-block whitespace-nowrap">
              instantly.
              <BrushUnderline />
            </span>
          </h2>

          <p
            className="mt-3 max-w-[520px] text-[13px] leading-snug tracking-[-0.01em] text-white/48 sm:mt-4 sm:text-[14px] sm:leading-normal lg:mt-[18px] lg:text-[clamp(14px,1.4vw,16px)] lg:leading-[1.55]"
          >
            Easy Lips translates your voice live for meetings, support, and conversations.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-5 sm:gap-2.5 lg:mt-6">
            <PrimaryCta />
            <SecondaryCta />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.12 }}
          className="relative mx-auto mt-6 sm:mt-8 lg:mt-[clamp(40px,6vw,64px)] lg:max-w-[1040px]"
        >
          <div className="lg:hidden">
            <MobileCompactDemo />
          </div>

          <div className="relative z-10 hidden lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(0,0.55fr)] lg:items-end lg:gap-4">
            <YouSpeakCard />
            <TheyHearCard />
            <LanguagesCard />
          </div>
          <FlowLines />
        </motion.div>
      </div>
    </section>
  )
}

function MobileCompactDemo() {
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: 14,
        border: '1px solid rgba(255, 255, 255, 0.09)',
        background: 'linear-gradient(180deg, rgba(18, 18, 20, 0.82), rgba(10, 10, 12, 0.65))',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.35)',
      }}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3 sm:px-4 sm:py-3.5">
        <MobilePhrase side="input" lang="Urdu" phrase="آپ کیسے ہیں؟" arabic />
        <MobileFlowIcon />
        <MobilePhrase side="output" lang="English" phrase="How are you?" />
      </div>

      <div
        className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-3 py-2 sm:px-4"
        style={{ background: 'rgba(0, 0, 0, 0.2)' }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="animate-pulse-glow rounded-full"
            style={{ width: 6, height: 6, background: RED_BRIGHT, boxShadow: `0 0 8px ${RED_BRIGHT}` }}
          />
          <span style={{ fontSize: 11, fontWeight: 600, color: RED_BRIGHT }}>Translating live</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.42)' }}>
          <GlobeIcon compact />
          70+ languages
        </div>
      </div>
    </div>
  )
}

function MobilePhrase({
  side,
  lang,
  phrase,
  arabic,
}: {
  side: 'input' | 'output'
  lang: string
  phrase: string
  arabic?: boolean
}) {
  return (
    <div className="min-w-0 text-center">
      <p style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' }}>
        {side === 'input' ? 'You speak' : 'They hear'}
      </p>
      <p style={{ marginTop: 2, fontSize: 10, color: 'rgba(255,255,255,0.42)', fontWeight: 500 }}>{lang}</p>
      <p
        style={{
          marginTop: 4,
          fontFamily: arabic ? "'Noto Naskh Arabic', serif" : "'Manrope', sans-serif",
          fontSize: arabic ? 15 : 14,
          lineHeight: 1.2,
          fontWeight: 600,
          color: '#F4F4F5',
          direction: arabic ? 'rtl' : 'ltr',
          letterSpacing: arabic ? 0 : '-0.02em',
        }}
      >
        {phrase}
      </p>
    </div>
  )
}

function MobileFlowIcon() {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: 28,
        height: 28,
        border: `1px solid rgba(234,10,26,0.35)`,
        background: 'rgba(234,10,26,0.08)',
        boxShadow: '0 0 14px rgba(234,10,26,0.2)',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M2 6h6M6.5 3.5 9 6 6.5 8.5" stroke={RED_BRIGHT} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function YouSpeakCard() {
  return (
    <div className="flex flex-col" style={{ ...cardShell, padding: '18px 16px 16px', minHeight: 220 }}>
      <CardLabel icon={<SpeechIcon />} label="You speak" />
      <p style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.42)', fontWeight: 500 }}>Urdu</p>
      <p
        style={{
          marginTop: 8,
          fontFamily: "'Noto Naskh Arabic', serif",
          fontSize: 'clamp(22px, 2.4vw, 28px)',
          lineHeight: 1.25,
          fontWeight: 600,
          color: '#F4F4F5',
          direction: 'rtl',
        }}
      >
        آپ کیسے ہیں؟
      </p>
      <div className="mt-auto flex items-center justify-between" style={{ marginTop: 28, gap: 10 }}>
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 36,
            height: 36,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <MicIcon />
        </div>
        <WaveformBars />
      </div>
    </div>
  )
}

function TheyHearCard() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ ...cardShell, padding: '20px 20px 18px', minHeight: 248 }}
    >
      <CardLabel icon={<HeadphoneIcon />} label="They hear" />
      <p style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.42)', fontWeight: 500 }}>English</p>
      <p
        style={{
          marginTop: 8,
          fontFamily: "'Manrope', sans-serif",
          fontSize: 'clamp(26px, 3vw, 34px)',
          lineHeight: 1.15,
          fontWeight: 600,
          letterSpacing: '-0.03em',
          color: '#F4F4F5',
        }}
      >
        How are you?
      </p>

      <div className="flex items-center" style={{ marginTop: 22, gap: 7 }}>
        <span
          className="animate-pulse-glow rounded-full"
          style={{ width: 7, height: 7, background: RED_BRIGHT, boxShadow: `0 0 10px ${RED_BRIGHT}` }}
        />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: RED_BRIGHT, letterSpacing: '-0.01em' }}>
          Translating live
        </span>
      </div>

      <TranslationGlow />
    </div>
  )
}

function LanguagesCard() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ ...cardShell, padding: '20px 14px', minHeight: 168, aspectRatio: '1 / 1' }}
    >
      <GlobeIcon />
      <p
        style={{
          marginTop: 12,
          fontSize: 'clamp(28px, 3vw, 34px)',
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#F4F4F5',
        }}
      >
        70+
      </p>
      <p style={{ marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,0.42)', fontWeight: 500 }}>languages</p>
    </div>
  )
}

function CardLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center" style={{ gap: 7 }}>
      {icon}
      <span style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.38)', letterSpacing: '-0.01em' }}>
        {label}
      </span>
    </div>
  )
}

function FlowLines() {
  return (
    <svg
      className="pointer-events-none absolute z-0 hidden lg:block"
      style={{ top: '18%', left: '8%', width: '52%', height: '55%' }}
      viewBox="0 0 520 180"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 92 C 90 48, 150 36, 220 58 S 360 118, 500 78"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M8 108 C 100 72, 170 64, 240 82 S 380 132, 508 96"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M8 124 C 110 96, 185 92, 255 104 S 395 148, 512 118"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TranslationGlow() {
  return (
    <div className="pointer-events-none absolute" style={{ right: '-2%', top: '22%', width: '48%', height: '72%' }} aria-hidden>
      <div
        className="absolute rounded-full ring-pulse"
        style={{
          right: '18%',
          top: '34%',
          width: 88,
          height: 88,
          border: `1px solid ${RED}`,
          opacity: 0.45,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          right: '24%',
          top: '40%',
          width: 56,
          height: 56,
          background: `radial-gradient(circle, ${RED_BRIGHT} 0%, rgba(234,10,26,0.35) 45%, transparent 72%)`,
          boxShadow: `0 0 40px rgba(234,10,26,0.55), 0 0 80px rgba(234,10,26,0.25)`,
        }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 160" fill="none">
        <path
          d="M0 80 C 40 60, 70 50, 110 70 S 160 110, 200 88"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M0 96 C 45 78, 78 68, 118 86 S 168 122, 200 102"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M0 112 C 50 98, 85 90, 125 104 S 175 134, 200 118"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function BrushUnderline() {
  return (
    <svg
      className="pointer-events-none absolute left-0 w-full"
      style={{ bottom: -4, height: 10 }}
      viewBox="0 0 180 10"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M3 7 C 28 3, 58 9, 88 5.5 S 148 3, 177 6.5"
        stroke={RED_BRIGHT}
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.92"
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
      className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold tracking-[-0.02em] lg:rounded-xl lg:px-5 lg:py-[11px] lg:text-[14.5px]"
      style={{
        textDecoration: 'none',
        background: `linear-gradient(135deg, ${RED} 0%, ${RED_BRIGHT} 100%)`,
        color: '#ffffff',
        boxShadow: '0 6px 20px rgba(234,10,26,0.25)',
      }}
    >
      Start Translating
    </motion.a>
  )
}

function SecondaryCta() {
  return (
    <motion.a
      href="#demo"
      whileHover={{ y: -1, borderColor: 'rgba(234,10,26,0.65)' }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease }}
      className="inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[13px] font-medium tracking-[-0.02em] lg:gap-2 lg:rounded-xl lg:px-5 lg:py-[11px] lg:text-[14.5px]"
      style={{
        textDecoration: 'none',
        border: '1px solid rgba(234,10,26,0.38)',
        background: 'transparent',
        color: '#ffffff',
      }}
    >
      <PlayIcon />
      Watch Demo
    </motion.a>
  )
}

function WaveformBars() {
  const heights = [6, 10, 14, 9, 12, 7]
  return (
    <div className="flex items-end" style={{ gap: 3, height: 16 }}>
      {heights.map((h, i) => (
        <span
          key={i}
          className="wave-bar rounded-full"
          style={{
            width: 3,
            height: h,
            background: RED_BRIGHT,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  )
}

function SpeechIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path
        d="M2.5 4.5a4 4 0 0 1 8 0v2.5a4 4 0 0 1-8 0V4.5Z"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <path d="M6.5 9.5v1.5M4.5 11h4" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function HeadphoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path
        d="M2.5 7.5v-1.5a4 4 0 0 1 8 0v1.5"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <rect x="1.5" y="7" width="2.5" height="3.5" rx="1" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <rect x="9" y="7" width="2.5" height="3.5" rx="1" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
    </svg>
  )
}

function GlobeIcon({ compact }: { compact?: boolean }) {
  const size = compact ? 14 : 34
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden>
      <circle cx="17" cy="17" r="13" stroke={RED_BRIGHT} strokeWidth="1.2" opacity="0.85" />
      <ellipse cx="17" cy="17" rx="5.5" ry="13" stroke={RED_BRIGHT} strokeWidth="1.2" opacity="0.85" />
      <path d="M4 17h26" stroke={RED_BRIGHT} strokeWidth="1.2" opacity="0.85" />
      <path d="M6.5 11.5h21M6.5 22.5h21" stroke={RED_BRIGHT} strokeWidth="0.9" opacity="0.55" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="h-[13px] w-[13px] lg:h-[15px] lg:w-[15px]" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <path d="M7 5.8L12.3 9L7 12.2V5.8Z" fill="currentColor" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="5.5" y="2" width="5" height="7.5" rx="2.5" fill="#ffffff" opacity="0.9" />
      <path
        d="M3.5 7.5v1a4.5 4.5 0 0 0 9 0v-1"
        stroke="#ffffff"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path d="M8 12v2" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" opacity="0.9" />
    </svg>
  )
}
