import { useState } from 'react'
import { motion } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const ASSETS = {
  appWide: '/hero/app-wide.svg',
  mask: '/hero/mask.png',
  blurPurple1: '/hero/blur-purple-1.png',
  blurPurple2: '/hero/blur-purple-2.png',
  circleOuter: '/hero/circle-outer.png',
  circleMid: '/hero/circle-mid.svg',
  circleInner: '/hero/circle-inner.png',
  circleSmall: '/hero/circle-small.png',
} as const

export function WelcomeHero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-black"
      style={{ minHeight: 'min(900px, 100dvh + 280px)' }}
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute left-1/2 top-[280px] -translate-x-1/2"
          style={{
            width: 'min(825px, 90vw)',
            height: 'min(825px, 90vw)',
            WebkitMaskImage: `url(${ASSETS.mask})`,
            maskImage: `url(${ASSETS.mask})`,
            WebkitMaskSize: '1200px 1165px',
            maskSize: '1200px 1165px',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        >
          <img
            src={ASSETS.blurPurple1}
            alt=""
            className="absolute inset-0 h-full w-full scale-[1.65] object-cover"
          />
        </div>

        <div
          className="absolute left-1/2 top-[408px] -translate-x-1/2"
          style={{
            width: 'min(569px, 70vw)',
            height: 'min(569px, 70vw)',
            WebkitMaskImage: `url(${ASSETS.mask})`,
            maskImage: `url(${ASSETS.mask})`,
            WebkitMaskSize: '1200px 1165px',
            maskSize: '1200px 1165px',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        >
          <img
            src={ASSETS.blurPurple2}
            alt=""
            className="absolute inset-0 h-full w-full scale-[1.4] object-cover"
          />
        </div>

        {/* Concentric circles */}
        <div
          className="absolute left-1/2 top-[195px] -translate-x-1/2 opacity-30"
          style={{ width: 'min(1032px, 95vw)', height: 'min(1032px, 95vw)' }}
        >
          <img src={ASSETS.circleOuter} alt="" className="absolute inset-0 h-full w-full" />
          <img
            src={ASSETS.circleMid}
            alt=""
            className="absolute opacity-15"
            style={{
              inset: '11.25%',
              width: '77.5%',
              height: '77.5%',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <img
            src={ASSETS.circleInner}
            alt=""
            className="absolute"
            style={{
              width: '54.8%',
              height: '54.8%',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <img
            src={ASSETS.circleSmall}
            alt=""
            className="absolute"
            style={{ width: 22, height: 22, left: '62%', top: '28%' }}
          />
        </div>
      </div>

      {/* Copy stack */}
      <div
        className="relative z-10 mx-auto flex flex-col items-center px-6 text-center"
        style={{ paddingTop: 'clamp(120px, 12vw, 145px)', maxWidth: 1200 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-4 flex items-center gap-[7px] rounded-full border border-white/15 bg-black px-[14px] py-2"
        >
          <span className="flex h-[18px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#9855ff] text-[10px] font-bold tracking-tight text-black">
            NEW
          </span>
          <span className="text-base tracking-tight text-[#9855ff]">
            Real-time voice translation across 70+ languages
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, ease, delay: 0.08 }}
          className="mb-4 bg-gradient-to-b from-white from-[54%] to-[#b372cf] bg-clip-text text-transparent"
          style={{
            fontSize: 'clamp(42px, 6.8vw, 82px)',
            lineHeight: 1.02,
            letterSpacing: '-0.05em',
            fontWeight: 500,
          }}
        >
          Break language
          <br />
          barriers with AI.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.16 }}
          className="mb-8 max-w-[544px] text-white"
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.55,
            letterSpacing: '-0.0001em',
          }}
        >
          Instantly translate conversations with automatic language detection, natural-sounding AI
          voices, and continuous low-latency streaming that keeps every conversation flowing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.24 }}
        >
          <HeroCta />
        </motion.div>
      </div>

      {/* App mockup */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.35 }}
        className="relative z-10 mx-auto mt-10 w-full px-4 sm:px-6"
        style={{ maxWidth: 1120 }}
      >
        <div
          className="relative mx-auto overflow-hidden rounded-[10px] border border-white/10"
          style={{
            width: '100%',
            aspectRatio: '1120 / 815',
            background:
              'linear-gradient(-90deg, rgb(13, 7, 24) 0%, rgba(15, 8, 27, 0) 47.85%, rgb(11, 6, 20) 100%)',
            boxShadow:
              '0px -20px 70px 0px rgba(140, 69, 255, 0.25), 0px -19px 70px 0px rgba(140, 69, 255, 0.4)',
          }}
        >
          <div className="absolute inset-[11px] overflow-hidden rounded-lg border border-white/10">
            <img
              src={ASSETS.appWide}
              alt="EasyLips voice translation app preview"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[308px]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 3.8%, #050208 86%)',
        }}
      />

      <div className="relative z-10 h-8" aria-hidden />
    </section>
  )
}

function HeroCta() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="#get-started"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center justify-center rounded-lg bg-white px-[15px] py-[5px] text-[15px] font-medium tracking-tight text-black transition-all duration-300"
      style={{
        lineHeight: '31px',
        boxShadow: hovered
          ? '0 0 32px rgba(255,255,255,0.25), 0 8px 24px rgba(0,0,0,0.35)'
          : '0 0 20px rgba(255,255,255,0.12)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      Start translating
    </a>
  )
}
