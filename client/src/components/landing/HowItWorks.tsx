import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'

const steps = [
  {
    number: '01',
    title: 'Join your call',
    description: 'Start Google Meet, Zoom, or Teams as usual. EasyLips runs in the background — no extra apps, no setup.',
    tags: ['ONE-CLICK', 'BACKGROUND', 'ZERO LATENCY IMPACT'],
    visual: <CallWindowMock />,
  },
  {
    number: '02',
    title: 'Speak naturally',
    description: 'Talk in your language. Our engine detects it, captures your voice, and streams it through the AI pipeline.',
    tags: ['AUTO DETECT', 'NOISE CANCEL', 'MULTI-SPEAKER'],
    visual: <VoiceProcessingVisual />,
  },
  {
    number: '03',
    title: 'They hear you',
    description: 'Your audience hears a natural-sounding translation — with your tone, your pace, your personality.',
    tags: ['VOICE CLONE', 'NATURAL PROSODY', '70+ LANGUAGES'],
    visual: <TranslationOutputMock />,
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const headingInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative overflow-hidden px-5 sm:px-6 lg:px-8"
      style={{
        paddingTop: 'clamp(80px, 10vw, 130px)',
        paddingBottom: 'clamp(80px, 10vw, 120px)',
        background: 'linear-gradient(180deg, #040406 0%, #050508 30%, #040406 100%)',
      }}
    >
      <TechGridBackground />

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 1080 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center text-center"
        >
          <SectionLabel>How it works</SectionLabel>
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 'clamp(32px, 4.5vw, 54px)',
              lineHeight: 1.06,
              letterSpacing: '-0.045em',
              fontWeight: 700,
              color: '#F4F4F5',
              maxWidth: 560,
              marginTop: 18,
            }}
          >
            From your mic to
            <br />
            <span style={{ color: RED }}>their ears</span>.
          </h2>
        </motion.div>

        <div className="mt-14 flex flex-col lg:mt-20" style={{ gap: 0 }}>
          {steps.map((step) => (
            <StepRow key={step.number} step={step} isLast={step.number === '03'} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepRow({ step, isLast }: { step: typeof steps[0]; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease, delay: 0.05 }}
        className="relative overflow-hidden"
        style={{
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'linear-gradient(180deg, rgba(16,16,20,0.55), rgba(8,8,11,0.45))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex flex-col gap-10 p-7 lg:flex-row lg:items-center lg:gap-12 lg:p-10 lg:pl-12">
          <div className="flex min-w-0 flex-1 flex-col lg:order-2">
            <div className="flex items-center" style={{ gap: 12, marginBottom: 16 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(52px, 6vw, 80px)',
                  fontWeight: 700,
                  color: RED,
                  lineHeight: 1,
                  letterSpacing: '-0.06em',
                  textShadow: `0 0 40px ${RED}50`,
                }}
              >
                {step.number}
              </span>
              <div className="flex-1" style={{ height: 1, background: `linear-gradient(90deg, ${RED}40, transparent)` }} />
            </div>

            <h3
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 'clamp(22px, 2.4vw, 32px)',
                fontWeight: 700,
                color: '#F4F4F5',
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                marginTop: 13,
                fontSize: 'clamp(14.5px, 1.4vw, 16.5px)',
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.52)',
                letterSpacing: '-0.01em',
                maxWidth: 480,
              }}
            >
              {step.description}
            </p>

            <div className="-mx-1 mt-6 flex flex-wrap" style={{ gap: 6 }}>
              {step.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '7px',
                    border: '1px solid rgba(234,10,26,0.18)',
                    background: 'rgba(234,10,26,0.05)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 600,
                    color: RED_BRIGHT,
                    letterSpacing: '0.08em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center lg:order-1" style={{ width: 'clamp(200px, 28vw, 320px)' }}>
            {step.visual}
          </div>
        </div>

        <div
          className="pointer-events-none absolute"
          style={{
            bottom: 0, left: '12%', right: '12%', height: 1,
            background: `linear-gradient(90deg, transparent, ${RED}55, transparent)`,
          }}
          aria-hidden
        />
      </motion.div>

      {!isLast && (
        <div className="flex justify-center py-4 lg:py-5">
          <div className="flex flex-col items-center" style={{ gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: RED_BRIGHT, boxShadow: `0 0 10px ${RED_BRIGHT}` }} />
            <span
              className="spin-cw-30"
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: `1.5px solid ${RED}45`,
              }}
            />
            <span style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ width: 4, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.15)' }} />
          </div>
        </div>
      )}
    </div>
  )
}

function CallWindowMock() {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.35)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <div
        className="flex items-center"
        style={{
          gap: 6,
          padding: '12px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.015)',
        }}
      >
        {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
          <span key={color} style={{ width: 9, height: 9, borderRadius: 999, background: color, opacity: 0.8 }} />
        ))}
        <span
          style={{
            marginLeft: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.06em',
          }}
        >
          MEETING ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2" style={{ gap: 4, padding: 4 }}>
        <div
          className="flex items-center justify-center"
          style={{
            height: 52,
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${RED}25, ${RED_BRIGHT}18)`,
            border: `1px solid ${RED}40`,
          }}
        >
          <div className="flex flex-col items-center" style={{ gap: 3 }}>
            <MicIcon />
            <span style={{ fontSize: '9px', fontWeight: 600, color: RED_BRIGHT, letterSpacing: '0.06em' }}>YOU</span>
          </div>
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{
              height: 52,
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: `rgba(255,255,255,0.${10 + i * 5})` }} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center" style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span
          className="animate-pulse-glow rounded-full"
          style={{ width: 6, height: 6, background: RED_BRIGHT, boxShadow: `0 0 8px ${RED_BRIGHT}`, marginRight: 8 }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9.5px',
            fontWeight: 600,
            color: RED_BRIGHT,
            letterSpacing: '0.1em',
          }}
        >
          EASYLIPS CONNECTED
        </span>
      </div>
    </div>
  )
}

function VoiceProcessingVisual() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: '100%', aspectRatio: '1/1', maxHeight: 280 }}
    >
      <div className="absolute inset-0 rounded-full" style={{ border: '1px dashed rgba(234,10,26,0.12)' }} />
      <div className="absolute rounded-full spin-cw-50" style={{ inset: '9%', border: '1px dashed rgba(234,10,26,0.18)' }} />
      <div className="absolute rounded-full spin-ccw-40" style={{ inset: '20%', border: '1px solid rgba(234,10,26,0.14)' }} />

      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * 360
        const dist = '38%'
        return (
          <div
            key={i}
            className="ticker-bar absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: 4,
              height: 'clamp(14px, 3vw, 22px)',
              background: `linear-gradient(180deg, ${RED_BRIGHT}, ${RED})`,
              animationDelay: `${i * 0.14}s`,
              transformOrigin: 'top center',
              transform: `translate(-50%, -100%) rotate(${angle}deg) translate(0, calc(-1 * ${dist}))`,
            }}
          />
        )
      })}

      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: '32%',
          height: '32%',
          background: 'linear-gradient(180deg, rgba(20,16,18,0.95), rgba(8,6,8,0.95))',
          border: '1px solid rgba(234,10,26,0.3)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.5), 0 0 30px rgba(234,10,26,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <MicIcon />
      </div>

      <div
        className="absolute right-0"
        style={{ bottom: '12%' }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 9px',
            borderRadius: '8px',
            border: '1px solid rgba(234,10,26,0.25)',
            background: 'rgba(10,8,10,0.8)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            fontWeight: 600,
            color: RED_BRIGHT,
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          <span className="animate-pulse-glow rounded-full" style={{ width: 5, height: 5, background: RED_BRIGHT, boxShadow: `0 0 6px ${RED_BRIGHT}` }} />
          URDU
        </span>
      </div>
    </div>
  )
}

function TranslationOutputMock() {
  return (
    <div className="w-full overflow-hidden" style={{ borderRadius: '14px', border: '1px solid rgba(234,10,26,0.15)', background: 'rgba(8,6,8,0.5)' }}>
      <div
        className="flex items-center"
        style={{
          gap: 8,
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(234,10,26,0.06)',
        }}
      >
        <span className="animate-pulse-glow rounded-full" style={{ width: 7, height: 7, background: RED_BRIGHT, boxShadow: `0 0 10px ${RED_BRIGHT}` }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', fontWeight: 600, color: RED_BRIGHT, letterSpacing: '0.12em' }}>
          TRANSLATING LIVE · 68ms
        </span>
      </div>

      <div className="flex flex-col" style={{ gap: 0 }}>
        <div className="flex items-start" style={{ gap: 14, padding: '16px 14px 10px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginTop: 2 }}>
            IN
          </span>
          <p style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 600, color: 'rgba(255,255,255,0.5)', direction: 'rtl', lineHeight: 1.3, margin: 0 }}>
            آپ کیسے ہیں؟
          </p>
        </div>

        <div className="flex items-center" style={{ padding: '0 14px' }}>
          <div className="flex-1" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex items-center justify-center" style={{ width: 30 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h6.5M8 4.5l3 2.5-3 2.5" stroke={RED_BRIGHT} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1" style={{ height: 1, background: `linear-gradient(90deg, ${RED}30, transparent)` }} />
        </div>

        <div className="flex items-start" style={{ gap: 14, padding: '10px 14px 16px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: RED_BRIGHT, letterSpacing: '0.1em', marginTop: 2 }}>
            OUT
          </span>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: '#F4F4F5', letterSpacing: '-0.03em', lineHeight: 1.3, margin: 0 }}>
            How are you?
          </p>
        </div>
      </div>

      <div className="flex items-end" style={{ gap: 2.5, height: 22, padding: '0 14px 12px', justifyContent: 'flex-end' }}>
        {[10, 18, 26, 14, 20, 11, 16, 8, 13, 9, 15, 7, 12].map((h, i) => (
          <span
            key={i}
            className="ticker-bar rounded-full"
            style={{ width: 2.5, height: h, background: `linear-gradient(180deg, ${RED_BRIGHT}, ${RED})`, animationDelay: `${i * 0.07}s` }}
          />
        ))}
      </div>
    </div>
  )
}

function TechGridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ width: 'min(700px, 80vw)', height: 500, background: 'radial-gradient(circle, rgba(234,10,26,0.06), transparent 70%)' }}
      />
      <div
        className="absolute left-1/4 bottom-0 rounded-full blur-3xl"
        style={{ width: 300, height: 200, background: 'radial-gradient(circle, rgba(234,10,26,0.07), transparent 70%)' }}
      />
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center"
      style={{
        gap: 8,
        padding: '5px 13px',
        borderRadius: '999px',
        border: '1px solid rgba(234,10,26,0.2)',
        background: 'rgba(234,10,26,0.06)',
      }}
    >
      <span
        style={{ width: 5, height: 5, borderRadius: 999, background: RED_BRIGHT, boxShadow: `0 0 6px ${RED_BRIGHT}` }}
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

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 30 30" fill="none" aria-hidden>
      <rect x="10.5" y="3" width="9" height="14" rx="4.5" fill="#ffffff" />
      <path
        d="M6 13V14.5C6 18.6 9.1 21.8 13 22.3V25H9.5V27.5H18.5V25H15V22.3C18.9 21.8 22 18.6 22 14.5V13"
        stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="15" cy="13" r="1.4" fill={RED_BRIGHT} />
    </svg>
  )
}
