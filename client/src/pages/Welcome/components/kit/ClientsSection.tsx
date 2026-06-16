import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { KIT_ASSETS } from './assets'
import { SectionHeading, SectionSubheading } from './KitUi'

const ease = [0.32, 0.72, 0, 1] as const

export function ClientsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section
      ref={ref}
      id="clients"
      className="relative overflow-hidden bg-black px-4 py-14 sm:px-6 sm:py-20 md:px-[90px] md:py-[78px]"
    >
      <div className="relative z-10 mx-auto flex max-w-[990px] flex-col items-center gap-7">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center gap-5 sm:gap-7"
        >
          <SectionHeading>Our clients</SectionHeading>
          <SectionSubheading className="max-w-[433px] px-2">
            Hear how teams use EasyLips to communicate effortlessly across languages.
          </SectionSubheading>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="relative mt-2 w-full sm:mt-4"
        >
          {/* Mobile: stacked card */}
          <div className="flex flex-col gap-6 overflow-hidden rounded-[20px] border border-[#282729]/80 p-5 sm:hidden">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-[16px]">
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(140,69,255,0.55) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />
              <img
                src={KIT_ASSETS.avatar}
                alt="Talia Taylor"
                className="relative h-full w-full object-cover"
              />
            </div>
            <div>
              <p
                className="mb-4 text-lg font-medium text-white"
                style={{ lineHeight: '28px', letterSpacing: '-0.0023em' }}
              >
                &ldquo;EasyLips made our global customer calls feel natural — everyone speaks in their own language and nothing gets lost in translation.&rdquo;
              </p>
              <p className="text-sm text-white" style={{ lineHeight: '24px' }}>
                Talia Taylor
              </p>
              <p className="mt-0.5 text-xs text-white/70" style={{ lineHeight: '22px' }}>
                Head of Customer Success @ NovaGlobal
              </p>
            </div>
          </div>

          {/* Desktop: grid layout */}
          <div className="relative mx-auto hidden min-h-[401px] w-full max-w-[990px] sm:block">
            <div className="absolute inset-0 overflow-hidden rounded-[20px] border border-[#282729]/80">
              <div className="absolute inset-y-0 left-[20.4%] w-px bg-[#282729]" />
              <div className="absolute inset-y-0 left-[57.68%] w-px bg-[#282729]" />
              <div className="absolute inset-x-0 top-[21.45%] h-px bg-[#282729]" />
              <div className="absolute inset-x-0 top-[75.56%] h-px bg-[#282729]" />
            </div>

            <div
              className="pointer-events-none absolute left-[26%] top-[48%] h-[240px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(140,69,255,0.55) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            <div className="absolute left-[12%] top-[21.45%] h-[53%] w-[37%] max-w-[320px] overflow-hidden rounded-[20px]">
              <img
                src={KIT_ASSETS.avatar}
                alt="Talia Taylor"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute right-[8%] top-[32%] max-w-[360px]">
              <p
                className="mb-5 text-white"
                style={{ fontSize: 23, lineHeight: '34px', letterSpacing: '-0.0023em', fontWeight: 500 }}
              >
                &ldquo;EasyLips made our global customer calls feel natural — everyone speaks in their own language and nothing gets lost in translation.&rdquo;
              </p>
              <p className="text-base text-white" style={{ lineHeight: '26px' }}>
                Talia Taylor
              </p>
              <p className="mt-1 text-sm text-white/70" style={{ lineHeight: '26px' }}>
                Head of Customer Success @ NovaGlobal
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
