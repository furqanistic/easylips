import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'

const steps = [
  {
    number: '01',
    title: 'Join your call',
    description:
      'Start Google Meet, Zoom, or Teams as usual. EasyLips runs in the background — no extra apps, no setup.',
    tags: ['ONE-CLICK', 'BACKGROUND', 'ZERO LATENCY IMPACT'],
    image: '/landing/how-step-join.png',
    alt: 'Video meeting interface with EasyLips connected',
  },
  {
    number: '02',
    title: 'Speak naturally',
    description:
      'Talk in your language. Our engine detects it, captures your voice, and streams it through the AI pipeline.',
    tags: ['AUTO DETECT', 'NOISE CANCEL', 'MULTI-SPEAKER'],
    image: '/landing/how-step-speak.png',
    alt: 'Active speaker with waveform and language detection',
  },
  {
    number: '03',
    title: 'They hear you',
    description:
      'Your audience hears a natural-sounding translation — with your tone, your pace, your personality.',
    tags: ['VOICE CLONE', 'NATURAL PROSODY', '70+ LANGUAGES'],
    image: '/landing/how-step-hear.png',
    alt: 'Live translation panel with translated speech output',
  },
]

type Step = (typeof steps)[number]

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const headingInView = useInView(ref, { once: true, amount: 0.25 })

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative overflow-hidden px-5 sm:px-6 lg:px-8"
      style={{
        paddingTop: 'clamp(80px, 10vw, 130px)',
        paddingBottom: 'clamp(80px, 10vw, 120px)',
        background: 'linear-gradient(180deg, #030305 0%, #060608 48%, #030305 100%)',
      }}
    >
      <TechGridBackground />

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 1080 }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="mx-auto flex max-w-[640px] flex-col items-center text-center"
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
            <span style={{ color: RED_BRIGHT }}>their ears</span>.
          </h2>
        </motion.div>

        <div className="mt-16 flex flex-col gap-12 lg:mt-24 lg:gap-16">
          {steps.map((step, index) => (
            <StepRow key={step.number} step={step} reversed={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepRow({ step, reversed }: { step: Step; reversed: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay: 0.05 }}
      className={`flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-14 ${reversed ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* MacBook Mockup */}
      <div className="w-full max-w-[680px] flex-shrink-0">
        <MacBookMockup image={step.image} alt={step.alt} />
      </div>

      {/* Text Content */}
      <div className="flex w-full flex-col items-center text-center lg:w-auto lg:flex-1 lg:items-start lg:text-left">
        <div
          className="mb-4 flex items-center"
          style={{ gap: 12 }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 700,
              color: RED,
              lineHeight: 1,
              letterSpacing: '-0.06em',
              textShadow: `0 0 40px ${RED}40`,
            }}
          >
            {step.number}
          </span>
          <div
            style={{
              width: 60,
              height: 1,
              background: `linear-gradient(90deg, ${RED}60, transparent)`,
            }}
          />
        </div>

        <h3
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(24px, 2.8vw, 34px)',
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
            marginTop: 14,
            fontSize: 'clamp(15px, 1.5vw, 17px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: 440,
          }}
        >
          {step.description}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
          {step.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '5px 12px',
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
    </motion.article>
  )
}

function MacBookMockup({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="group relative">
      {/* Screen glow */}
      <div
        className="absolute -inset-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${RED}12, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* MacBook body */}
      <div className="relative">
        {/* Screen bezel */}
        <div
          style={{
            borderRadius: '12px 12px 0 0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderBottom: 'none',
            background: 'linear-gradient(180deg, rgba(20,20,24,0.95), rgba(12,12,16,0.95))',
            padding: '10px 10px 0 10px',
          }}
        >
          {/* Camera notch */}
          <div className="mb-3 flex justify-center">
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            />
          </div>

          {/* Screen content */}
          <div
            className="overflow-hidden"
            style={{
              borderRadius: '4px 4px 0 0',
              border: '1px solid rgba(255,255,255,0.06)',
              background: '#08080c',
            }}
          >
            <img
              src={image}
              alt={alt}
              loading="lazy"
              className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ aspectRatio: '16/10' }}
            />
          </div>
        </div>

        {/* Bottom bezel + hinge */}
        <div className="relative">
          {/* Hinge line */}
          <div
            style={{
              height: 2,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.1), rgba(255,255,255,0.04))',
            }}
          />

          {/* Bottom chassis */}
          <div
            style={{
              height: 10,
              borderRadius: '0 0 12px 12px',
              background: 'linear-gradient(180deg, rgba(18,18,22,0.95), rgba(14,14,18,0.95))',
              border: '1px solid rgba(255,255,255,0.06)',
              borderTop: 'none',
            }}
          />

          {/* Notch in bottom chassis */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: 4,
              width: 80,
              height: 3,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function TechGridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div
        className="absolute inset-x-0 top-1/2 h-px opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${RED}33, transparent)` }}
      />
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center rounded-full px-3 py-1.5"
      style={{
        gap: 8,
        border: '1px solid rgba(234,10,26,0.2)',
        background: 'rgba(234,10,26,0.055)',
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: RED_BRIGHT, boxShadow: `0 0 8px ${RED_BRIGHT}` }}
      />
      <span
        className="text-[10px] font-semibold uppercase"
        style={{
          color: RED_BRIGHT,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {children}
      </span>
    </div>
  )
}
