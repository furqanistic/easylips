import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const steps = [
  {
    number: '01',
    title: 'Join your call',
    description: 'Start Google Meet, Zoom, or Teams as usual. BetterLips runs in the background — no extra apps needed.',
    tags: ['One-click setup', 'Works in background', 'Zero latency impact'],
  },
  {
    number: '02',
    title: 'Speak naturally',
    description: 'Talk in Urdu, Hindi, or any language. BetterLips captures your voice, detects the language, and streams it to our AI engine.',
    tags: ['Auto detection', 'Noise cancellation', 'Multi-speaker'],
  },
  {
    number: '03',
    title: 'They hear you',
    description: 'Your audience hears a natural-sounding translation in their language — with your tone, your pace, your personality.',
    tags: ['Voice cloning', 'Natural prosody', '70+ languages'],
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative overflow-hidden px-6 py-32"
      style={{ background: '#080808' }}
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(1 0 0 / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0 / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Top gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, oklch(0.55 0.22 25 / 0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <span
            className="mb-6 inline-flex rounded-full px-5 py-2"
            style={{
              border: '1px solid oklch(0.55 0.22 25 / 0.3)',
              background: 'oklch(0.55 0.22 25 / 0.06)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'oklch(0.55 0.22 25)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            How it works
          </span>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 52px)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              fontWeight: 700,
              color: '#ffffff',
              maxWidth: '600px',
            }}
          >
            From your mic to their ears
            <br />
            in three steps
          </h2>
        </motion.div>

        {/* Cards row */}
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0">
          {/* Connector line with dots */}
          <div className="pointer-events-none absolute top-[120px] left-[16.66%] right-[16.66%] hidden md:block">
            <div
              className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2"
              style={{ background: 'oklch(0.55 0.22 25 / 0.25)' }}
            />
            {/* Junction dots */}
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: '0%',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'oklch(0.55 0.22 25)',
                boxShadow: '0 0 12px oklch(0.55 0.22 25 / 0.5)',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: '50%',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'oklch(0.55 0.22 25)',
                boxShadow: '0 0 12px oklch(0.55 0.22 25 / 0.5)',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: '100%',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'oklch(0.55 0.22 25)',
                boxShadow: '0 0 12px oklch(0.55 0.22 25 / 0.5)',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.1 }}
              className="relative px-2 md:px-4"
            >
              {/* Card */}
              <div
                className="relative rounded-2xl p-8"
                style={{
                  background: 'linear-gradient(180deg, #111111 0%, #0c0c0c 100%)',
                  border: '1px solid oklch(0.55 0.22 25 / 0.12)',
                  minHeight: '340px',
                }}
              >
                {/* Number badge */}
                <div
                  className="mb-6 flex items-center justify-center"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    border: '1.5px solid oklch(0.55 0.22 25 / 0.4)',
                    background: 'oklch(0.55 0.22 25 / 0.06)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'oklch(0.55 0.22 25)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  className="mb-3"
                  style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}
                >
                  {step.title}
                </h3>
                <p className="mb-8" style={{ fontSize: '14px', lineHeight: 1.7, color: 'oklch(0.55 0 0)' }}>
                  {step.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        color: 'oklch(0.7 0 0)',
                        border: '1px solid oklch(0.55 0.22 25 / 0.2)',
                        background: 'oklch(0.55 0.22 25 / 0.04)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom glow */}
                <div
                  className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{
                    width: '60%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, oklch(0.55 0.22 25 / 0.6), transparent)',
                    boxShadow: '0 0 20px oklch(0.55 0.22 25 / 0.3), 0 0 40px oklch(0.55 0.22 25 / 0.15)',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Latency bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
          className="mx-auto mt-12 max-w-[640px]"
          style={{
            borderRadius: '16px',
            border: '1px solid oklch(1 0 0 / 0.08)',
            background: 'linear-gradient(180deg, #111111 0%, #0c0c0c 100%)',
          }}
        >
          <div className="flex items-center gap-5 p-6">
            {/* Waveform icon */}
            <div
              className="flex shrink-0 items-center justify-center"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '1px solid oklch(0.55 0.22 25 / 0.2)',
                background: 'oklch(0.55 0.22 25 / 0.06)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10V8M7 10V6M10 10V4M13 10V7M16 10V9" stroke="oklch(0.55 0.22 25)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#ffffff' }}>
                  Average translation latency
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: 'oklch(0.75 0.2 120)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  68ms
                </span>
              </div>

              {/* Progress bar */}
              <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{ background: '#1e1e1e' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: '8%',
                    background: 'linear-gradient(90deg, oklch(0.55 0.22 25), oklch(0.75 0.2 120))',
                    boxShadow: '0 0 8px oklch(0.75 0.2 120 / 0.4)',
                  }}
                />
              </div>

              {/* Labels */}
              <div className="mt-2 flex justify-between">
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#454647' }}>6ms</span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#454647' }}>
                  880ms (human interpreter)
                </span>
              </div>
            </div>

            {/* Optimal indicator */}
            <div className="flex shrink-0 items-center gap-2">
              <span
                className="animate-pulse-glow"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'oklch(0.75 0.2 120)',
                  boxShadow: '0 0 8px oklch(0.75 0.2 120)',
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'oklch(0.75 0.2 120)' }}>
                Optimal
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
