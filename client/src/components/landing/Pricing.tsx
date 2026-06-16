import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const plans = [
  {
    name: 'Starter',
    color: 'oklch(0.556 0 0)',
    ctaStyle: 'ghost',
    price: { monthly: '0', yearly: '0' },
    description: 'For individuals trying real-time voice translation.',
    cta: 'Get started free',
    features: ['10 hours translation / month', '5 language pairs', 'Standard AI voices', 'Web app only', 'Community support'],
  },
  {
    name: 'Pro',
    color: 'oklch(0.55 0.22 25)',
    ctaStyle: 'primary',
    badge: 'Most popular',
    price: { monthly: '29', yearly: '19' },
    description: 'For professionals who need unlimited translation.',
    cta: 'Start Pro free',
    features: ['Unlimited translation hours', 'All 70+ languages', 'Neural voice cloning', 'Desktop + mobile apps', 'API access', 'Priority support', 'Video dubbing (20 hrs/mo)'],
  },
  {
    name: 'Enterprise',
    color: 'oklch(0.6 0.2 20)',
    ctaStyle: 'ghost',
    price: { monthly: 'Custom', yearly: 'Custom' },
    description: 'For teams and organizations at scale.',
    cta: 'Contact sales',
    features: ['Everything in Pro', 'Unlimited video dubbing', 'Custom AI voice training', 'SSO & team management', 'SLA uptime guarantee', 'Dedicated account manager', 'On-premise deployment'],
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative overflow-hidden px-6 py-32"
      style={{ background: '#050208' }}
    >
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(84.6% 73.49% at 50% 26.51%, oklch(0.55 0.22 25 / 0.06), transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <span
            className="mb-5 inline-flex rounded-full px-3 py-1"
            style={{
              border: '1px solid oklch(0.55 0.22 25 / 0.15)',
              background: 'oklch(0.55 0.22 25 / 0.06)',
              fontSize: '11px',
              fontWeight: 500,
              color: 'oklch(0.55 0.22 25)',
              letterSpacing: '0.073em',
              textTransform: 'uppercase',
            }}
          >
            Pricing
          </span>
          <h2
            className="mb-6"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            Simple pricing,
            <br />
            powerful translation
          </h2>

          {/* Billing toggle */}
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '13px', color: yearly ? 'oklch(0.45 0 0)' : '#ffffff', transition: 'color 0.3s' }}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              aria-label="Toggle billing period"
              className="relative cursor-pointer"
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                background: yearly ? 'oklch(0.55 0.22 25)' : '#363739',
                border: 'none',
                transition: 'background 0.3s cubic-bezier(0.32,0.72,0,1)',
              }}
            >
              <span
                className="absolute top-0.5"
                style={{
                  left: yearly ? 'calc(100% - 22px)' : '2px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'left 0.3s cubic-bezier(0.32,0.72,0,1)',
                }}
              />
            </button>
            <span style={{ fontSize: '13px', color: yearly ? '#ffffff' : 'oklch(0.45 0 0)', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.3s' }}>
              Yearly
              <span
                className="rounded px-1.5 py-0.5"
                style={{
                  background: 'oklch(0.7 0.2 120 / 0.12)',
                  color: 'oklch(0.7 0.2 120)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}
              >
                −34%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="relative"
              style={{
                padding: '2px',
                borderRadius: '20px',
                background: plan.ctaStyle === 'primary'
                  ? 'linear-gradient(135deg, oklch(0.55 0.22 25 / 0.2), oklch(0.6 0.2 20 / 0.1))'
                  : 'oklch(1 0 0 / 0.04)',
                border: plan.ctaStyle === 'primary'
                  ? '1px solid oklch(0.55 0.22 25 / 0.15)'
                  : '1px solid oklch(1 0 0 / 0.06)',
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 whitespace-nowrap"
                  style={{
                    transform: 'translateX(-50%)',
                    padding: '3px 12px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.6 0.2 20))',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                  }}
                >
                  {plan.badge}
                </div>
              )}
              <div
                className="flex h-full flex-col rounded-[18px] p-6"
                style={{
                  background: '#07080a',
                  boxShadow: 'inset 0 1px 0 oklch(1 0 0 / 0.03)',
                }}
              >
                <div className="mb-5">
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 500, color: plan.color, letterSpacing: '0.04em' }}>
                    {plan.name.toUpperCase()}
                  </span>
                  <div className="mt-3 flex items-end gap-1">
                    {plan.price.monthly !== 'Custom' ? (
                      <>
                        <span style={{ fontSize: '40px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                          ${yearly ? plan.price.yearly : plan.price.monthly}
                        </span>
                        <span style={{ fontSize: '13px', color: '#454647', marginBottom: '4px' }}>/mo</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '32px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                        Custom
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'oklch(0.45 0 0)', marginTop: '8px' }}>{plan.description}</p>
                </div>

                <ul className="flex flex-1 flex-col gap-2.5" style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 flex shrink-0 items-center justify-center"
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: `${plan.color}12`,
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l1.5 1.5L6.5 2" stroke={plan.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span style={{ fontSize: '13px', color: 'oklch(0.6 0 0)' }}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <PlanCta plan={plan} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlanCta({ plan }: { plan: typeof plans[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#get-started"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center text-center"
      style={{
        padding: '10px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
        ...(plan.ctaStyle === 'primary'
          ? {
              background: hovered ? 'oklch(0.55 0.22 25)' : 'oklch(0.55 0.22 25 / 0.9)',
              color: '#000000',
              boxShadow: '0 0 20px oklch(0.55 0.22 25 / 0.2)',
            }
          : {
              background: 'transparent',
              color: hovered ? '#ffffff' : 'oklch(0.556 0 0)',
              border: `1px solid ${hovered ? 'oklch(1 0 0 / 0.15)' : 'oklch(1 0 0 / 0.08)'}`,
            }
        ),
      }}
    >
      {plan.cta}
    </a>
  )
}
