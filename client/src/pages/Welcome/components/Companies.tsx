const LOGOS = [
  '/companies/acme-1.svg',
  '/companies/acme-2.svg',
  '/companies/acme-3.svg',
  '/companies/acme-4.svg',
  '/companies/acme-5.svg',
  '/companies/acme-6.svg',
  '/companies/acme-7.svg',
  '/companies/acme-8.svg',
] as const

function LogoBox({ src }: { src: string }) {
  return (
    <div
      className="flex shrink-0 flex-col items-center justify-center rounded-[10px] border border-white/15 px-6 py-5 sm:px-10 sm:py-8"
      style={{ minWidth: 'min(140px, 42vw)' }}
    >
      <div className="relative h-[34px] w-[155px]">
        <img src={src} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
      </div>
    </div>
  )
}

export function Companies() {
  const row1 = LOGOS.slice(0, 4)
  const row2 = LOGOS.slice(4, 8)

  return (
    <section className="flex w-full flex-col items-center justify-center gap-10 px-6 py-16">
      <p
        className="text-center text-white/70"
        style={{ fontSize: 16, lineHeight: '26px', letterSpacing: '-0.0016px' }}
      >
        Trusted by creators, businesses, and teams connecting across languages
      </p>

      <div className="flex w-full max-w-[1000px] flex-col gap-[10px]">
        <div className="flex flex-wrap items-stretch justify-center gap-[10px]">
          {row1.map((src) => (
            <LogoBox key={src} src={src} />
          ))}
        </div>
        <div className="flex flex-wrap items-stretch justify-center gap-[10px]">
          {row2.map((src) => (
            <LogoBox key={src} src={src} />
          ))}
        </div>
      </div>
    </section>
  )
}
