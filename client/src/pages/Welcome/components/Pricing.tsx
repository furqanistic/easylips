import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const plans = [
  {
    name: 'Starter', color: '#6a6b6c', ctaStyle: 'ghost',
    price: { monthly: '0', yearly: '0' },
    description: 'For individuals exploring voice translation.',
    cta: 'Get started free',
    features: ['10 hours translation / month', '5 language pairs', 'Standard AI voices', 'Web app only', 'Community support'],
  },
  {
    name: 'Pro', color: '#56c2ff', ctaStyle: 'primary', badge: 'Most popular',
    price: { monthly: '29', yearly: '19' },
    description: 'For creators and professionals who need more.',
    cta: 'Start Pro free',
    features: ['Unlimited translation hours', 'All 70+ languages', 'Premium AI voice cloning', 'Desktop + mobile apps', 'API access', 'Priority support', 'Video dubbing (20 hrs/mo)'],
  },
  {
    name: 'Enterprise', color: '#a78bfa', ctaStyle: 'ghost',
    price: { monthly: 'Custom', yearly: 'Custom' },
    description: 'For teams and businesses at scale.',
    cta: 'Contact sales',
    features: ['Everything in Pro', 'Unlimited video dubbing', 'Custom AI voice training', 'SSO & team management', 'SLA uptime guarantee', 'Dedicated account manager', 'On-premise deployment'],
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section id="pricing" ref={ref} style={{ position: 'relative', padding: '128px 0', overflow: 'hidden', background: '#040506' }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(84.6% 73.49% at 50% 26.51%, rgba(4,63,150,0.5), rgba(6,18,37,0.15))',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '48px' }}
        >
          <span style={{
            display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', marginBottom: '20px',
            background: 'rgba(86,194,255,0.1)', border: '1px solid rgba(86,194,255,0.2)',
            color: '#56c2ff', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.073em', textTransform: 'uppercase',
          }}>
            Pricing
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1,
            letterSpacing: '-0.04em', fontWeight: 600, color: '#ffffff', marginBottom: '24px',
          }}>
            Simple pricing,
            <br />powerful translation
          </h2>

          {/* Billing toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: yearly ? '#6a6b6c' : '#ffffff', transition: 'color 0.3s' }}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              aria-label="Toggle billing period"
              style={{
                position: 'relative', width: '44px', height: '24px', borderRadius: '12px',
                background: yearly ? '#56c2ff' : '#363739',
                border: 'none', cursor: 'pointer',
                transition: 'background 0.3s cubic-bezier(0.32,0.72,0,1)',
              }}
            >
              <span style={{
                position: 'absolute', top: '2px',
                left: yearly ? 'calc(100% - 22px)' : '2px',
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transition: 'left 0.3s cubic-bezier(0.32,0.72,0,1)',
              }} />
            </button>
            <span style={{ fontSize: '13px', color: yearly ? '#ffffff' : '#6a6b6c', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.3s' }}>
              Yearly
              <span style={{
                padding: '2px 6px', borderRadius: '4px',
                background: 'rgba(89,212,153,0.15)', color: '#59d499',
                fontSize: '10px', fontWeight: 500, letterSpacing: '0.02em',
              }}>
                −34%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              style={{
                position: 'relative', padding: '6px', borderRadius: '20px',
                background: plan.ctaStyle === 'primary' ? 'rgba(86,194,255,0.06)' : 'rgba(255,255,255,0.03)',
                border: plan.ctaStyle === 'primary' ? '1px solid rgba(86,194,255,0.15)' : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  padding: '2px 12px', borderRadius: '999px', whiteSpace: 'nowrap',
                  background: 'linear-gradient(135deg, rgb(86,194,255) 0%, rgb(19,138,242) 100%)',
                  color: '#ffffff', fontSize: '11px', fontWeight: 500, letterSpacing: '0.02em',
                }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ borderRadius: '15px', padding: '24px',
                background: '#07080a', boxShadow: 'rgba(255,255,255,0.03) 0px 1px 0px 0px inset',
                display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 500, color: plan.color, letterSpacing: '0.04em' }}>
                    {plan.name.toUpperCase()}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginTop: '12px' }}>
                    {plan.price.monthly !== 'Custom' ? (
                      <>
                        <span style={{ fontSize: '36px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                          ${yearly ? plan.price.yearly : plan.price.monthly}
                        </span>
                        <span style={{ fontSize: '13px', color: '#454647', marginBottom: '4px' }}>/mo</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '28px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                        Custom
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: '#6a6b6c', marginTop: '8px' }}>{plan.description}</p>
                </div>

                <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {plan.features.map((feat) => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{
                        marginTop: '2px', width: '16px', height: '16px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        background: `${plan.color}18`,
                      }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l1.5 1.5L6.5 2" stroke={plan.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span style={{ fontSize: '13px', color: '#9c9c9d' }}>{feat}</span>
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
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
        textDecoration: 'none', textAlign: 'center',
        transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
        ...(plan.ctaStyle === 'primary'
          ? {
              background: hovered ? '#ffffff' : '#e6e6e6',
              color: '#2f3031',
              boxShadow: 'rgba(0,0,0,0.03) 0px 7px 3px 0px, rgba(0,0,0,0.25) 0px 4px 4px 0px',
            }
          : {
              background: 'transparent',
              color: hovered ? '#ffffff' : '#9c9c9d',
              border: `1px solid ${hovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
            }
        ),
      }}
    >
      {plan.cta}
    </a>
  )
}
