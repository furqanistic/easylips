import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { KIT_ASSETS } from './assets'

const ease = [0.32, 0.72, 0, 1] as const

export function KitCtaSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section ref={ref} id="get-started" className="relative bg-black px-4 py-8 sm:px-6 sm:py-10 md:px-[50px]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="relative mx-auto min-h-[320px] w-full max-w-[1100px] overflow-hidden rounded-[10px] border border-white/15 sm:min-h-[400px] md:min-h-[473px]"
      >
        {/* Pattern background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            WebkitMaskImage: `url(${KIT_ASSETS.ctaPatternMask})`,
            maskImage: `url(${KIT_ASSETS.ctaPatternMask})`,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
          }}
        >
          <img
            src={KIT_ASSETS.patternGrid}
            alt=""
            className="absolute h-[210%] w-[122%] -left-[9%] -top-[3.5%] max-w-none opacity-10"
          />
          <div
            className="absolute -top-32 left-1/2 h-[622px] w-[686px] -translate-x-1/2 rounded-full opacity-80"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(140,69,255,0.5) 0%, transparent 68%)',
              filter: 'blur(48px)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(2,1,3,0) 15.6%, rgb(2,1,3) 99.9%)',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center px-4 pb-10 pt-12 text-center sm:px-6 sm:pb-12 sm:pt-16 md:pt-20">
          <h2
            className="mb-6 max-w-[422px] font-medium text-white sm:mb-8"
            style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: '1.15', letterSpacing: '-0.84px' }}
          >
            Connect with the world—without language barriers.
          </h2>

          <div className="mb-5 flex w-full max-w-[401px] flex-col gap-2 sm:mb-6 sm:block sm:gap-0">
            <div className="relative w-full rounded-lg border border-white/15 px-4 py-3 text-left sm:py-[19px]">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent pr-0 text-base text-white/50 outline-none sm:pr-28"
                style={{ lineHeight: '26px' }}
              />
              <button
                type="button"
                className="mt-2 w-full rounded-lg bg-white px-[15px] py-2 text-[15px] font-medium text-black sm:absolute sm:right-1 sm:top-1 sm:mt-0 sm:w-auto sm:py-[5px]"
                style={{ lineHeight: '31px' }}
              >
                Join waitlist
              </button>
            </div>
          </div>

          <p className="flex flex-wrap items-center justify-center gap-2 text-sm text-white/50 sm:text-base" style={{ lineHeight: '26px' }}>
            <span>No credit card required</span>
            <span>·</span>
            <span>70+ languages included</span>
          </p>
        </div>
      </motion.div>
    </section>
  )
}
