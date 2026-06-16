import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { KIT_ASSETS } from './assets'
import { CardDivider, PricingRow, SectionHeading, SectionSubheading, WaitlistButton } from './KitUi'

const ease = [0.32, 0.72, 0, 1] as const

const PLANS = [
  {
    name: 'Basic',
    price: '$29/mo',
    variant: 'light' as const,
    features: [
      'Live voice translation',
      '70+ languages',
      'Auto language detection',
      'AI transcription',
    ],
  },
  {
    name: 'Pro',
    price: '$79/mo',
    variant: 'pro' as const,
    features: [
      'Everything in Basic',
      'Multilingual dubbing',
      'Tone & personality preservation',
      'Low-latency streaming',
      'Meeting & stream integrations',
      'Priority voice models',
    ],
  },
  {
    name: 'Business',
    price: '$149/mo',
    variant: 'light' as const,
    features: [
      'Everything in Pro',
      '2,000+ language combinations',
      'Multi-user workspace access',
      'API & webhook integration',
      'Dedicated streaming capacity',
      'Custom voice profiles',
    ],
  },
]

function PricingCard({
  name,
  price,
  variant,
  features,
  index,
  inView,
}: (typeof PLANS)[number] & { index: number; inView: boolean }) {
  const isPro = variant === 'pro'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay: index * 0.08 }}
      className="relative flex w-full max-w-[360px] flex-col md:max-w-[307px]"
    >
      <div
        className={`absolute inset-0 overflow-hidden rounded-[10px] ${
          isPro
            ? 'bg-gradient-to-b from-[#010002] to-[#361764] shadow-[0px_10px_74px_10px_rgba(78,0,191,0.41)]'
            : 'border border-white/15 bg-black/[0.06]'
        }`}
      >
        {isPro && (
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              WebkitMaskImage: `url(${KIT_ASSETS.pricingPatternMask})`,
              maskImage: `url(${KIT_ASSETS.pricingPatternMask})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
          >
            <img
              src={KIT_ASSETS.patternGrid}
              alt=""
              className="absolute h-[142%] w-[267%] max-w-none -left-[79%] -top-[0.1%]"
            />
            <div
              className="absolute inset-0 rounded-[10px]"
              style={{ background: 'linear-gradient(to bottom, black 29%, transparent)' }}
            />
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-col p-5 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl font-medium text-white sm:text-2xl" style={{ lineHeight: '31px' }}>
            {name}
          </h3>
          <p className="mt-1 text-sm text-white/70 sm:text-base" style={{ lineHeight: '26px' }}>
            {price}
          </p>
        </div>

        <CardDivider />

        <div className="mt-6 flex flex-col sm:mt-8">
          {features.map((feature) => (
            <PricingRow key={feature}>{feature}</PricingRow>
          ))}
        </div>

        <WaitlistButton variant={isPro ? 'purple' : 'dark'} className="mt-6 sm:mt-8" />
      </div>
    </motion.article>
  )
}

export function KitPricingSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const [yearly, setYearly] = useState(true)

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-14 md:px-[129px]"
      style={{
        background:
          'radial-gradient(ellipse at 50% 60%, rgba(44,21,80,0.5) 0%, rgba(2,1,3,1) 70%)',
      }}
    >
      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center gap-10 sm:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center gap-6 sm:gap-10"
        >
          <SectionHeading>Pricing</SectionHeading>
          <SectionSubheading className="max-w-[433px] px-2">
            Choose the plan that fits how you connect across languages — from everyday conversations to global teams.
          </SectionSubheading>

          <button
            type="button"
            onClick={() => setYearly((v) => !v)}
            className="flex items-center gap-1.5"
            aria-pressed={yearly}
          >
            <span
              className="relative h-5 w-[33px] rounded-full"
              style={{ background: yearly ? '#8c45ff' : '#3d3d3d' }}
            >
              <span
                className="absolute top-[10%] h-[80%] w-[45%] rounded-full bg-[#f9f5ff] transition-all"
                style={{ left: yearly ? '45%' : '6%' }}
              />
            </span>
            <span className="text-sm font-medium text-white/50 sm:text-base" style={{ lineHeight: '31px' }}>
              Billed yearly
            </span>
          </button>
        </motion.div>

        <div className="flex w-full flex-col items-center gap-4 sm:gap-[10px] md:grid md:grid-cols-3 md:items-stretch md:justify-center">
          {PLANS.map((plan, index) => (
            <PricingCard key={plan.name} {...plan} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
