import { useRef, type CSSProperties } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const ASSETS = {
  seoTorus: '/features/seo-torus.svg',
  cardMask: '/features/card-mask.svg',
  dashboardUi: '/features/dashboard-ui.svg',
  trafficChart: '/features/traffic-chart.svg',
  keywordPyramid: '/features/keyword-pyramid.svg',
} as const

const cardFade =
  'linear-gradient(179.88deg, rgba(3, 1, 6, 0) 29.33%, rgb(54, 23, 100) 89.04%)'

function SmallCard({
  title,
  description,
  visual,
  visualStyle,
  index,
  inView,
}: {
  title: string
  description: string
  visual: string
  visualStyle?: CSSProperties
  index: number
  inView: boolean
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay: index * 0.08 }}
      className="relative flex min-h-[320px] w-full flex-col overflow-hidden rounded-[10px] border border-white/15 bg-black/[0.06] sm:min-h-[400px] md:max-w-[346px]"
    >
      <div
        className="relative mx-auto mt-6 flex flex-1 items-center justify-center px-6 sm:absolute sm:inset-x-0 sm:top-0 sm:mx-0 sm:mt-0 sm:px-0"
        style={visualStyle ?? { left: 41, top: 29, width: 265, height: 206 }}
      >
        <img src={visual} alt="" className="h-auto max-h-[180px] w-full max-w-[265px] object-contain sm:absolute sm:h-full sm:max-h-none sm:max-w-none" />
      </div>
      <div className="relative mt-auto px-6 pb-6 pt-4 sm:absolute sm:bottom-0 sm:left-0 sm:px-10 sm:pb-9 sm:pt-0">
        <h3 className="text-base font-medium text-white" style={{ lineHeight: '31px' }}>
          {title}
        </h3>
        <p className="mt-[27px] max-w-[259px] text-base text-white/70" style={{ lineHeight: '26px' }}>
          {description}
        </p>
      </div>
    </motion.article>
  )
}

function LargeCard({
  title,
  description,
  visual,
  imageStyle,
  index,
  inView,
}: {
  title: string
  description: string
  visual: string
  imageStyle: CSSProperties
  index: number
  inView: boolean
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay: index * 0.08 }}
      className="relative min-h-[320px] w-full overflow-hidden rounded-[10px] bg-gradient-to-b from-black to-[#371866] sm:min-h-[400px] md:col-span-2"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          WebkitMaskImage: `url(${ASSETS.cardMask})`,
          maskImage: `url(${ASSETS.cardMask})`,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <div className="absolute left-4 right-4 top-4 rounded-lg border border-white/10 sm:left-auto sm:right-auto" style={imageStyle}>
          <img src={visual} alt="" className="h-full w-full rounded-lg object-cover object-left-top" />
        </div>
        <div className="absolute inset-0" style={{ background: cardFade }} />
      </div>
      <div className="relative z-10 mt-auto px-6 pb-6 pt-32 sm:absolute sm:bottom-0 sm:left-0 sm:px-10 sm:pb-9 sm:pt-0">
        <h3 className="text-base font-medium text-white" style={{ lineHeight: '31px' }}>
          {title}
        </h3>
        <p className="mt-[34px] max-w-[259px] text-base text-white/70" style={{ lineHeight: '26px' }}>
          {description}
        </p>
      </div>
    </motion.article>
  )
}

export function FeaturesBento() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="features"
      ref={ref}
      className="relative overflow-hidden bg-black px-6 py-20 sm:px-[50px]"
    >
      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center gap-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="max-w-[553px] text-center text-white"
          style={{
            fontSize: 'clamp(24px, 3vw, 32px)',
            lineHeight: '38px',
            letterSpacing: '-0.0128px',
            fontWeight: 500,
          }}
        >
          AI-powered voice translation that feels as natural as speaking face-to-face — built for
          creators, businesses, and everyday users who want to connect with the world.
        </motion.h2>

        <div className="flex w-full flex-col gap-[10px]">
          <div className="grid grid-cols-1 gap-[10px] md:grid-cols-3">
            <SmallCard
              index={0}
              inView={inView}
              title="Live voice translation"
              description="Instantly translate conversations across 70+ languages with streaming that feels face-to-face."
              visual={ASSETS.seoTorus}
            />
            <LargeCard
              index={1}
              inView={inView}
              title="Intuitive translation hub"
              description="Live voice translation, AI transcription, multilingual dubbing, and streaming — all in one interface."
              visual={ASSETS.dashboardUi}
              imageStyle={{ left: 55, top: 46, width: 'min(1100px, 150%)', height: 'auto', aspectRatio: '1098 / 793' }}
            />
          </div>

          <div className="grid grid-cols-1 gap-[10px] md:grid-cols-3">
            <LargeCard
              index={2}
              inView={inView}
              title="AI transcription"
              description="Capture every word with speaker labels, timestamps, and exports for meetings, streams, and lectures."
              visual={ASSETS.trafficChart}
              imageStyle={{ left: 55, top: 46, width: 'min(633px, 90%)', height: 353 }}
            />
            <SmallCard
              index={3}
              inView={inView}
              title="Auto language detection"
              description="Switch languages mid-conversation — OneLingo detects the source language instantly, no setup required."
              visual={ASSETS.keywordPyramid}
              visualStyle={{ left: 50, top: 10, width: 234, height: 234 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
