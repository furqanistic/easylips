import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const ICONS = {
  gauge: '/features/icon-gauge.svg',
  listChecks: '/features/icon-list-checks.svg',
  magicWand: '/features/icon-magic-wand.svg',
  chartLine: '/features/icon-chart-line.svg',
  target: '/features/icon-target.svg',
  cursorClick: '/features/icon-cursor-click.svg',
  sparkle: '/features/icon-sparkle.svg',
  bell: '/features/icon-bell.svg',
  files: '/features/icon-files.svg',
} as const

const columns = [
  [
    {
      icon: ICONS.gauge,
      title: 'Low-latency streaming',
      description: 'Continuous voice translation with minimal delay so conversations never stall.',
      width: 259,
    },
    {
      icon: ICONS.listChecks,
      title: 'AI transcription',
      description: 'Speaker-separated transcripts with timestamps and export in multiple formats.',
      width: 259,
    },
    {
      icon: ICONS.magicWand,
      title: 'Multilingual dubbing',
      description: 'Dub videos and audio in 70+ languages with natural, lip-sync aware AI voices.',
      width: 259,
    },
  ],
  [
    {
      icon: ICONS.chartLine,
      title: 'Tone preservation',
      description: 'Keep your pitch, pacing, and personality — not just the words you say.',
      width: 265,
    },
    {
      icon: ICONS.target,
      title: 'Auto language detection',
      description: 'Switch languages mid-conversation without configuring source or target pairs.',
      width: 322,
    },
    {
      icon: ICONS.cursorClick,
      title: 'One-click sessions',
      description: 'Start translating in meetings, streams, or on the go with a single tap.',
      width: 259,
    },
  ],
  [
    {
      icon: ICONS.sparkle,
      title: 'Natural AI voices',
      description: 'Human-sounding speech synthesis tuned for clarity, warmth, and authenticity.',
      width: 322,
    },
    {
      icon: ICONS.bell,
      title: 'Live session alerts',
      description: 'Real-time indicators for active speakers, detected languages, and stream health.',
      width: 322,
    },
    {
      icon: ICONS.files,
      title: '2,000+ language pairs',
      description: 'From Spanish to Japanese, Arabic to Swahili — every combination you need.',
      width: 321,
    },
  ],
] as const

function FeatureItem({
  icon,
  title,
  description,
  width,
  index,
  inView,
}: {
  icon: string
  title: string
  description: string
  width: number
  index: number
  inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease, delay: index * 0.05 }}
      className="flex flex-col gap-[10px]"
    >
      <div className="flex items-center gap-[5px]">
        <img src={icon} alt="" className="h-4 w-4 shrink-0" />
        <h3 className="text-base font-medium text-white" style={{ lineHeight: '31px' }}>
          {title}
        </h3>
      </div>
      <p
        className="text-base text-white/70"
        style={{ lineHeight: '26px', maxWidth: width }}
      >
        {description}
      </p>
    </motion.div>
  )
}

export function FeaturesGrid() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  let itemIndex = 0

  return (
    <section
      ref={ref}
      className="mx-4 mb-4 rounded-[10px] border border-white/15 px-4 py-10 sm:mx-6 sm:mb-6 sm:px-6 sm:py-16 md:mx-[50px] md:px-[50px] md:py-[76px]"
      style={{
        backgroundImage:
          'linear-gradient(118.44deg, rgb(25, 13, 46) 0.54%, rgb(2, 1, 3) 99.46%)',
      }}
    >
      <div className="mx-auto flex max-w-[1100px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-[60px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="shrink-0 text-white lg:max-w-[354px]"
          style={{
            fontSize: 'clamp(28px, 5vw, 56px)',
            lineHeight: '1.15',
            letterSpacing: '-0.84px',
            fontWeight: 500,
          }}
        >
          Connect with the world—without language barriers.
        </motion.h2>

        <div className="grid flex-1 grid-cols-1 gap-10 md:grid-cols-3 md:gap-[60px]">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-10">
              {column.map((item) => {
                const current = itemIndex++
                return (
                  <FeatureItem key={item.title} {...item} index={current} inView={inView} />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
