import { motion } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const operatingSystems = ['Windows', 'Mac', 'Chrome']

const heroHighlights = [
  {
    title: 'Low latency',
    detail: 'Sub-2s translation',
    icon: <BoltIcon />,
  },
  {
    title: '70+ languages',
    detail: 'Auto-detect and translate',
    icon: <GlobeIcon />,
  },
  {
    title: 'Private and secure',
    detail: 'Enterprise-grade security',
    icon: <ShieldIcon />,
  },
]

const platformLogos = [
  { name: 'Zoom', accent: '#4A8CFF' },
  { name: 'Google Meet', accent: '#34A853' },
  { name: 'Teams', accent: '#7C6BFF' },
  { name: 'Webex', accent: '#2BB8A6' },
]

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        minHeight: 'min(900px, 100dvh + 120px)',
        background:
          'radial-gradient(circle at top center, rgba(255,132,22,0.12), transparent 30%), linear-gradient(180deg, #020202 0%, #060606 58%, #050208 100%)',
      }}
    >
      <HeroBackground />

      <div
        className="relative z-10 mx-auto px-5 sm:px-6 lg:px-8"
        style={{ maxWidth: 1480, paddingTop: 'clamp(104px, 9vw, 142px)', paddingBottom: 'clamp(44px, 5vw, 80px)' }}
      >
        <div className="grid items-center gap-10 xl:grid-cols-[minmax(0,1.16fr)_minmax(520px,0.92fr)] xl:gap-10">
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease }}
              className="inline-flex items-center gap-3 rounded-full px-4 py-3"
              style={{
                border: '1px solid rgba(255, 132, 22, 0.28)',
                background: 'linear-gradient(180deg, rgba(255, 132, 22, 0.12), rgba(255, 132, 22, 0.05))',
                boxShadow: '0 0 36px rgba(255, 132, 22, 0.08)',
              }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: '#ff8416', boxShadow: '0 0 18px rgba(255, 132, 22, 0.8)' }}
              />
              <span style={{ fontSize: '15px', color: '#ff9d43', letterSpacing: '-0.02em' }}>
                Live voice translation for every conversation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.82, ease, delay: 0.06 }}
              className="mt-8 max-w-[13ch] xl:max-w-[14ch]"
              style={{
                fontSize: 'clamp(48px, 6vw, 88px)',
                lineHeight: 0.96,
                letterSpacing: '-0.068em',
                fontWeight: 600,
              }}
            >
              <span style={{ color: '#f5f3f1' }}>Speak Naturally.</span>
              <br />
              <span style={{ color: '#f5f3f1' }}>Be Understood</span>
              <br />
              <span style={{ color: '#ff8416' }}>Everywhere.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease, delay: 0.14 }}
              className="mt-7 max-w-[42rem]"
              style={{
                fontSize: 'clamp(17px, 1.6vw, 20px)',
                lineHeight: 1.55,
                letterSpacing: '-0.02em',
                color: 'rgba(236, 231, 226, 0.76)',
              }}
            >
              Real-time AI voice translation for calls, meetings, classrooms, sales, and
              support across <span style={{ color: '#ff9d43' }}>70+ languages</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease, delay: 0.22 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <PrimaryAction href="#get-started" label="Start Free" />
              <SecondaryAction href="#how-it-works" label="Watch Demo" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease, delay: 0.32 }}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              <div className="flex items-center gap-3" style={{ color: 'rgba(236, 231, 226, 0.88)' }}>
                <OperatingSystemIcon kind="Windows" />
                <OperatingSystemIcon kind="Mac" />
                <OperatingSystemIcon kind="Chrome" />
              </div>
              <div
                className="hidden h-5 w-px sm:block"
                style={{ background: 'rgba(255, 255, 255, 0.12)' }}
              />
              <div style={{ fontSize: '15px', color: 'rgba(236, 231, 226, 0.68)', letterSpacing: '-0.02em' }}>
                Windows, Mac, and browser extension support
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease, delay: 0.38 }}
              className="mt-10 grid gap-3 sm:grid-cols-3"
            >
              {heroHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] px-4 py-4"
                  style={{
                    background: 'linear-gradient(180deg, rgba(17, 17, 17, 0.85), rgba(10, 10, 10, 0.72))',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px]"
                      style={{
                        background: 'rgba(255, 132, 22, 0.1)',
                        border: '1px solid rgba(255, 132, 22, 0.22)',
                        color: '#ff8416',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', color: '#f5f3f1', letterSpacing: '-0.03em' }}>
                        {item.title}
                      </div>
                      <div className="mt-1" style={{ fontSize: '14px', color: 'rgba(236, 231, 226, 0.52)' }}>
                        {item.detail}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease, delay: 0.18 }}
            className="relative"
          >
            <div
              className="absolute inset-x-[10%] top-[8%] h-[42%] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(255,132,22,0.26), transparent 72%)' }}
            />
            <div
              className="relative overflow-hidden rounded-[30px] p-[1px]"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05))',
                boxShadow:
                  '0 38px 120px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.03), 0 0 60px rgba(255,132,22,0.09)',
              }}
            >
              <div
                className="overflow-hidden rounded-[29px]"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(18, 18, 18, 0.98), rgba(8, 8, 8, 0.98))',
                }}
              >
                <ProductHeader />

                <div className="relative px-3 pb-3 pt-0 sm:px-4 sm:pb-4">
                  <div className="relative overflow-hidden rounded-[26px] border border-white/8 bg-[#090909]">
                    <div
                      className="relative min-h-[360px] sm:min-h-[430px]"
                      style={{
                        background:
                          'radial-gradient(circle at 50% 18%, rgba(255,132,22,0.14), transparent 24%), linear-gradient(180deg, rgba(23,23,23,0.92), rgba(8,8,8,1))',
                      }}
                    >
                      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                      <div className="absolute left-4 right-4 top-4 z-10 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <PlatformPill label="Google Meet / Zoom" accent="#34A853" />
                          <PlatformPill label="Any audio software" accent="#4A8CFF" />
                          <PlatformPill label="Live voice translation" accent="#ff8416" />
                        </div>
                        <div
                          className="rounded-full px-3 py-1.5"
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: 'rgba(245,243,241,0.8)',
                            fontSize: '12px',
                          }}
                        >
                          Speak Urdu. Client hears English.
                        </div>
                      </div>

                      <div className="absolute inset-x-4 top-[64px] bottom-[24px] z-10 overflow-hidden rounded-[24px] border border-white/8 bg-[#111111] sm:inset-x-5">
                        <img
                          src="/home/hero.avif"
                          alt="Live multilingual meeting preview"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.34)), radial-gradient(circle at 50% 18%, rgba(255,132,22,0.12), transparent 34%)',
                          }}
                        />
                        <div
                          className="absolute left-3 right-3 top-3 flex items-center justify-between rounded-[16px] px-3 py-2.5 sm:left-4 sm:right-4 sm:top-4 sm:px-4 sm:py-3"
                          style={{
                            background: 'rgba(10,10,10,0.52)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(14px)',
                            WebkitBackdropFilter: 'blur(14px)',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '12px', color: 'rgba(236,231,226,0.58)' }}>
                              Working on Google Meet / Zoom
                            </div>
                            <div className="mt-1" style={{ fontSize: '15px', color: '#f5f3f1', letterSpacing: '-0.03em' }}>
                              Also works anywhere live audio is used
                            </div>
                          </div>
                          <div
                            className="hidden rounded-full px-3 py-1.5 sm:block"
                            style={{
                              background: 'rgba(255,132,22,0.12)',
                              border: '1px solid rgba(255,132,22,0.28)',
                              color: '#ff9d43',
                              fontSize: '12px',
                            }}
                          >
                            1.3s latency
                          </div>
                        </div>

                      <div
                        className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 rounded-[20px] px-4 py-3 sm:bottom-4 sm:left-4 sm:right-4 sm:px-5"
                        style={{
                          background: 'linear-gradient(180deg, rgba(14,14,14,0.9), rgba(10,10,10,0.82))',
                          border: '1px solid rgba(255,255,255,0.1)',
                          boxShadow: '0 18px 32px rgba(0,0,0,0.22)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                        }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div style={{ fontSize: '11px', color: 'rgba(236,231,226,0.5)' }}>
                              What this app does
                            </div>
                            <div className="mt-1" style={{ fontSize: '14px', color: '#f5f3f1', letterSpacing: '-0.02em' }}>
                              It adds live voice translation to Google Meet, Zoom, and any software where audio is used.
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MeetingControlPill label="Urdu in" tone="dark" />
                            <MeetingControlPill label="English out" tone="orange" />
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_90px_minmax(0,1fr)_120px]">
                    <ControlCard label="Speaker talks in" value="Urdu" />
                    <CenterMicButton />
                    <ControlCard label="Client hears in" value="English" />
                    <LatencyCard />
                  </div>

                  <div
                    className="mt-4 rounded-[24px] px-5 py-4"
                    style={{
                      background: 'linear-gradient(180deg, rgba(12,12,12,0.96), rgba(9,9,9,0.9))',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                      <div style={{ fontSize: '15px', color: 'rgba(236,231,226,0.58)', letterSpacing: '-0.02em' }}>
                        Works with
                      </div>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                        {platformLogos.map((platform) => (
                          <div key={platform.name} className="flex items-center gap-2">
                            <span
                              className="h-3.5 w-3.5 rounded-full"
                              style={{ background: platform.accent, boxShadow: `0 0 14px ${platform.accent}66` }}
                            />
                            <span style={{ fontSize: '15px', color: 'rgba(245,243,241,0.82)', letterSpacing: '-0.02em' }}>
                              {platform.name}
                            </span>
                          </div>
                        ))}
                        <span style={{ fontSize: '14px', color: 'rgba(236,231,226,0.45)' }}>and more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40"
        style={{ background: 'linear-gradient(180deg, rgba(5,2,8,0), #050208 85%)' }}
      />
    </section>
  )
}

function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '86px 86px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.02))',
        }}
      />
      <div
        className="absolute left-[-8%] top-[18%] h-[440px] w-[440px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(255,132,22,0.15), transparent 72%)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-6%] h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(255,132,22,0.1), transparent 72%)' }}
      />
      <div
        className="absolute -bottom-14 left-0 h-[360px] w-[52%] opacity-60"
        style={{
          background:
            'radial-gradient(120% 120% at 0% 100%, rgba(255,132,22,0.35) 0%, rgba(255,132,22,0.1) 12%, transparent 44%)',
          filter: 'blur(8px)',
        }}
      />
      <div
        className="absolute -bottom-24 right-0 h-[400px] w-[44%] opacity-50"
        style={{
          background:
            'radial-gradient(120% 120% at 100% 100%, rgba(255,132,22,0.28) 0%, rgba(255,132,22,0.08) 15%, transparent 42%)',
          filter: 'blur(12px)',
        }}
      />
    </div>
  )
}

function ProductHeader() {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <LogoBars />
          <span style={{ fontSize: '15px', color: '#f5f3f1', letterSpacing: '-0.03em' }}>BetterLips Extension</span>
        </div>
        <div
          className="rounded-full px-3 py-1"
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            fontSize: '13px',
            color: '#ff9d43',
          }}
        >
          Live
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-white/70">
          <span className="h-2.5 w-2.5 rounded-full bg-[#34A853]" />
          <span>Working on:</span>
          <span className="text-white/88">Google Meet</span>
        </div>
        <div className="hidden h-5 w-px md:block" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="flex items-center gap-3 text-white/72">
          <HeaderIcon>
            <MicrophoneIcon />
          </HeaderIcon>
          <HeaderIcon>
            <SpeakerIcon />
          </HeaderIcon>
          <HeaderIcon>
            <FocusIcon />
          </HeaderIcon>
          <HeaderIcon>
            <SettingsIcon />
          </HeaderIcon>
        </div>
      </div>
    </div>
  )
}

function ControlCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-[22px] px-4 py-4"
      style={{
        background: 'linear-gradient(180deg, rgba(20,20,20,0.96), rgba(10,10,10,0.9))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ fontSize: '12px', color: 'rgba(236,231,226,0.48)' }}>{label}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#34A853]" />
          <span style={{ fontSize: '16px', color: '#f5f3f1', letterSpacing: '-0.03em' }}>{value}</span>
        </div>
        <ChevronDownIcon />
      </div>
    </div>
  )
}

function CenterMicButton() {
  return (
    <div
      className="flex items-center justify-center rounded-[22px]"
      style={{
        background: 'linear-gradient(180deg, rgba(12,12,12,0.94), rgba(8,8,8,0.92))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="flex h-[58px] w-[58px] items-center justify-center rounded-full"
        style={{
          background: 'rgba(255,132,22,0.12)',
          border: '1px solid rgba(255,132,22,0.35)',
          boxShadow: '0 0 24px rgba(255,132,22,0.22)',
          color: '#ff8416',
        }}
      >
        <LogoBars />
      </div>
    </div>
  )
}

function LatencyCard() {
  return (
    <div
      className="rounded-[22px] px-4 py-4"
      style={{
        background: 'linear-gradient(180deg, rgba(20,20,20,0.96), rgba(10,10,10,0.9))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ fontSize: '12px', color: 'rgba(236,231,226,0.48)' }}>Latency</div>
      <div className="mt-2" style={{ fontSize: '28px', color: '#7ce8c0', letterSpacing: '-0.05em' }}>
        1.3s
      </div>
      <div style={{ fontSize: '12px', color: 'rgba(236,231,226,0.58)' }}>Excellent</div>
    </div>
  )
}

function PrimaryAction({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2, boxShadow: '0 18px 38px rgba(255,132,22,0.22)' }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.25, ease }}
      className="inline-flex items-center gap-3 rounded-[18px] px-6 py-4"
      style={{
        textDecoration: 'none',
        background: 'linear-gradient(180deg, #ff951a 0%, #ff7f08 100%)',
        color: '#150b02',
        fontSize: '18px',
        fontWeight: 600,
        letterSpacing: '-0.04em',
        boxShadow: '0 10px 30px rgba(255,132,22,0.16)',
      }}
    >
      {label}
      <ArrowUpRightIcon />
    </motion.a>
  )
}

function SecondaryAction({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.18)', color: '#ffffff' }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.25, ease }}
      className="inline-flex items-center gap-3 rounded-[18px] px-6 py-4"
      style={{
        textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(180deg, rgba(20,20,20,0.94), rgba(12,12,12,0.88))',
        color: 'rgba(236,231,226,0.82)',
        fontSize: '18px',
        fontWeight: 500,
        letterSpacing: '-0.04em',
      }}
    >
      <PlayIcon />
      {label}
    </motion.a>
  )
}

function PlatformPill({ label, accent }: { label: string; accent: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{
        background: 'rgba(12,12,12,0.56)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(245,243,241,0.84)',
        fontSize: '12px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
      {label}
    </div>
  )
}

function MeetingControlPill({ label, tone }: { label: string; tone: 'dark' | 'orange' }) {
  return (
    <div
      className="rounded-full px-3 py-1.5"
      style={{
        background: tone === 'orange' ? 'rgba(255,132,22,0.12)' : 'rgba(255,255,255,0.05)',
        border:
          tone === 'orange'
            ? '1px solid rgba(255,132,22,0.28)'
            : '1px solid rgba(255,255,255,0.1)',
        color: tone === 'orange' ? '#ff9d43' : 'rgba(245,243,241,0.76)',
        fontSize: '12px',
      }}
    >
      {label}
    </div>
  )
}

function OperatingSystemIcon({ kind }: { kind: (typeof operatingSystems)[number] }) {
  if (kind === 'Windows') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 5.4L10.3 4.4V11H3V5.4Z" fill="currentColor" />
        <path d="M12 4.1L21 2.8V11H12V4.1Z" fill="currentColor" />
        <path d="M3 13H10.3V19.6L3 18.6V13Z" fill="currentColor" />
        <path d="M12 13H21V21.2L12 19.9V13Z" fill="currentColor" />
      </svg>
    )
  }

  if (kind === 'Mac') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15.7 12.8C15.7 10.9 17.3 10 17.4 9.9C16.5 8.7 15 8.5 14.5 8.5C13.3 8.4 12.2 9.2 11.6 9.2C11 9.2 10.1 8.5 9 8.5C7.5 8.5 6.2 9.4 5.4 10.7C3.8 13.5 5 17.6 6.5 19.7C7.2 20.7 8.1 21.8 9.3 21.7C10.4 21.7 10.8 21 12.1 21C13.4 21 13.8 21.7 14.9 21.7C16.1 21.7 16.9 20.7 17.6 19.7C18.4 18.5 18.8 17.2 18.8 17.1C18.8 17.1 15.7 15.9 15.7 12.8Z"
          fill="currentColor"
        />
        <path d="M13.8 5.8C14.4 5.1 14.9 4.1 14.8 3C13.9 3 12.9 3.6 12.3 4.3C11.8 4.9 11.2 6 11.4 7C12.4 7.1 13.2 6.5 13.8 5.8Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3A14 14 0 0 1 21 12H12V3Z" fill="currentColor" />
      <path d="M12 12L5.7 21A14 14 0 0 1 3 12H12Z" fill="currentColor" opacity="0.7" />
      <path d="M12 12H21A14 14 0 0 1 5.7 21L12 12Z" fill="currentColor" opacity="0.35" />
    </svg>
  )
}

function HeaderIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-full"
      style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
    >
      {children}
    </span>
  )
}

function LogoBars() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="1" y="5.5" width="2.2" height="7" rx="1.1" fill="currentColor" />
      <rect x="5.1" y="2" width="2.2" height="14" rx="1.1" fill="currentColor" />
      <rect x="9.2" y="4.2" width="2.2" height="9.6" rx="1.1" fill="currentColor" />
      <rect x="13.3" y="6.2" width="2.2" height="5.6" rx="1.1" fill="currentColor" />
    </svg>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4.5 13.5L13.5 4.5M13.5 4.5H7.1M13.5 4.5V10.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <path d="M7 5.8L12.3 9L7 12.2V5.8Z" fill="currentColor" />
    </svg>
  )
}


function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6L8 10L12 6" stroke="rgba(236,231,226,0.68)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10.8 1.7L4.7 10H9L8.2 18.3L15.3 8.3H11L10.8 1.7Z" fill="currentColor" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 10H17.5M10 2.2C11.9 4.3 13 7 13 10C13 13 11.9 15.7 10 17.8M10 2.2C8.1 4.3 7 7 7 10C7 13 8.1 15.7 10 17.8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 2.4L15.8 4.6V8.8C15.8 12.7 13.4 16.3 10 17.6C6.6 16.3 4.2 12.7 4.2 8.8V4.6L10 2.4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.6 10.1L9.2 11.8L12.6 8.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MicrophoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="5.2" y="2" width="5.6" height="8" rx="2.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 8.4V9C3 11.8 5.2 14 8 14C10.8 14 13 11.8 13 9V8.4M8 14V15.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2.5 9.8H5.2L8.8 12.6V3.4L5.2 6.2H2.5V9.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M11.3 5.2C12.1 6 12.5 6.9 12.5 8C12.5 9.1 12.1 10 11.3 10.8M12.7 3.7C13.9 4.9 14.5 6.3 14.5 8C14.5 9.7 13.9 11.1 12.7 12.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function FocusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 2.5H3.8C3.1 2.5 2.5 3.1 2.5 3.8V6M10 2.5H12.2C12.9 2.5 13.5 3.1 13.5 3.8V6M10 13.5H12.2C12.9 13.5 13.5 12.9 13.5 12.2V10M6 13.5H3.8C3.1 13.5 2.5 12.9 2.5 12.2V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2.5L8.7 3.9C8.9 4.2 9.2 4.4 9.6 4.4H11.1L11.6 5.8L12.9 6.5L12.6 8L12.9 9.5L11.6 10.2L11.1 11.6H9.6C9.2 11.6 8.9 11.8 8.7 12.1L8 13.5L7.3 12.1C7.1 11.8 6.8 11.6 6.4 11.6H4.9L4.4 10.2L3.1 9.5L3.4 8L3.1 6.5L4.4 5.8L4.9 4.4H6.4C6.8 4.4 7.1 4.2 7.3 3.9L8 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}
