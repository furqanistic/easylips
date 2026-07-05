import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'

const plans = [
  {
    name: 'Starter',
    price: '$4.99',
    period: '/month',
    description: 'For casual users.',
    minutes: '90',
    unit: 'min / month',
    features: ['All 70+ languages'],
    cta: 'Get started',
    style: 'ghost' as const,
  },
  {
    name: 'Plus',
    price: '$14.99',
    period: '/month',
    description: 'For freelancers, students, and small meetings.',
    minutes: '275',
    unit: 'min / month',
    features: ['All 70+ languages', 'Priority support'],
    cta: 'Go Plus',
    style: 'ghost' as const,
  },
  {
    name: 'Pro',
    price: '$39.99',
    period: '/month',
    description: 'For serious users, client calls, daily usage.',
    minutes: '750',
    unit: 'min / month',
    badge: 'Most popular',
    features: ['All 70+ languages', 'Priority support', 'API access'],
    cta: 'Start Pro',
    style: 'primary' as const,
  },
  {
    name: 'Enterprise',
    price: 'from $99',
    period: '/month',
    description: 'For teams and organizations.',
    minutes: 'Custom',
    unit: 'limits',
    features: ['Team seats', 'Shared minutes', 'Admin dashboard', 'Priority support'],
    cta: 'Contact sales',
    style: 'ghost' as const,
  },
]

export function Pricing() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative overflow-hidden px-5 sm:px-6 lg:px-8"
      style={{
        paddingTop: 'clamp(80px, 10vw, 130px)',
        paddingBottom: 'clamp(80px, 10vw, 120px)',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(234,10,26,0.06), transparent 60%), #050208',
      }}
    >
      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 1080 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center text-center"
        >
          <SectionLabel>Pricing</SectionLabel>
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 'clamp(32px, 4.5vw, 54px)',
              lineHeight: 1.06,
              letterSpacing: '-0.045em',
              fontWeight: 700,
              color: '#F4F4F5',
              maxWidth: 520,
              marginTop: 18,
            }}
          >
            AI voice translator pricing,
            <br />
            <span style={{ color: RED }}>no surprises</span>.
          </h2>
        </motion.div>

        <div
          className="mt-14 grid gap-4 lg:mt-20"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="relative"
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 z-10 whitespace-nowrap"
                  style={{
                    transform: 'translateX(-50%)',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    background: `linear-gradient(135deg, ${RED}, ${RED_BRIGHT})`,
                    color: '#fff',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  {plan.badge}
                </div>
              )}
              <div
                className="pricing-card flex h-full flex-col"
                style={{
                  borderRadius: '18px',
                  border: plan.style === 'primary'
                    ? `1px solid ${RED}30`
                    : '1px solid rgba(255,255,255,0.06)',
                  background: plan.style === 'primary'
                    ? `linear-gradient(180deg, ${RED}08, transparent 40%), rgba(10,10,14,0.7)`
                    : 'rgba(10,10,14,0.5)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  padding: '28px 24px',
                  boxShadow: plan.style === 'primary'
                    ? `0 20px 50px ${RED}10, inset 0 1px 0 rgba(255,255,255,0.04)`
                    : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: plan.style === 'primary' ? RED_BRIGHT : 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.12em',
                  }}
                >
                  {plan.name.toUpperCase()}
                </span>

                <div className="mt-4 flex items-end" style={{ gap: 2 }}>
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 'clamp(32px, 3.5vw, 42px)',
                      fontWeight: 700,
                      color: '#F4F4F5',
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.3)',
                      marginBottom: 4,
                    }}
                  >
                    {plan.period}
                  </span>
                </div>

                <p
                  style={{
                    marginTop: 10,
                    fontSize: '14px',
                    lineHeight: 1.5,
                    color: 'rgba(255,255,255,0.45)',
                    minHeight: '42px',
                  }}
                >
                  {plan.description}
                </p>

                <div
                  style={{
                    marginTop: 14,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 'clamp(28px, 3vw, 36px)',
                      fontWeight: 800,
                      color: plan.style === 'primary' ? RED_BRIGHT : '#F4F4F5',
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {plan.minutes}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.4)',
                      lineHeight: 1,
                    }}
                  >
                    {plan.unit}
                  </span>
                </div>

                <div
                  className="my-5"
                  style={{
                    height: 1,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                  }}
                />

                <ul className="flex flex-1 flex-col" style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', gap: 10 }}>
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start" style={{ gap: 10 }}>
                      <span
                        className="mt-0.5 flex shrink-0 items-center justify-center"
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          background: plan.style === 'primary' ? `${RED}15` : 'rgba(255,255,255,0.05)',
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1.5 4l1.5 1.5L6.5 2"
                            stroke={plan.style === 'primary' ? RED_BRIGHT : 'rgba(255,255,255,0.3)'}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.5)' }}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#get-started"
                  className="mt-auto flex items-center justify-center text-center"
                  style={{
                    padding: '11px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: "'Manrope', sans-serif",
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
                    ...(plan.style === 'primary'
                      ? {
                          background: RED,
                          color: '#fff',
                          boxShadow: `0 0 24px ${RED}30`,
                        }
                      : {
                          background: 'transparent',
                          color: 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }),
                  }}
                >
                  {plan.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
          className="mt-10 text-center"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.02em',
          }}
        >
          Need more? Extra minutes available at $6 / 100 min.
        </motion.p>
      </div>
    </section>
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
