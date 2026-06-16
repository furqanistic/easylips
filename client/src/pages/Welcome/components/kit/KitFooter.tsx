import { KIT_ASSETS } from './assets'
import { WaitlistButton } from './KitUi'

const FOOTER_LINKS = {
  Product: ['Features', 'Integration', 'Updates', 'FAQ', 'Pricing'],
  Company: ['About', 'Blog', 'Careers', 'Manifesto', 'Press', 'Contract'],
  Resources: ['Examples', 'Community', 'Guides', 'Docs', 'Press'],
  Legal: ['Privacy', 'Terms', 'Security'],
} as const

const NAV_LINKS = [
  { label: 'Features', hasCaret: true },
  { label: 'Developers', hasCaret: false },
  { label: 'Company', hasCaret: true },
  { label: 'Blog', hasCaret: false },
  { label: 'Changelog', hasCaret: false },
] as const

function FooterColumn({ title, links }: { title: string; links: readonly string[] }) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <p className="text-xs font-medium text-white sm:text-[13px]" style={{ lineHeight: '20px' }}>
        {title}
      </p>
      {links.map((link) => (
        <a
          key={link}
          href="#"
          className="text-xs text-white/50 transition-colors hover:text-white sm:text-[13px]"
          style={{ lineHeight: '22px' }}
        >
          {link}
        </a>
      ))}
    </div>
  )
}

export function KitFooter() {
  return (
    <footer className="bg-black">
      <div className="mx-auto max-w-[1195px] border-x border-t border-white/15 px-4 py-6 sm:px-8 sm:py-8 md:px-[45px] md:py-[41px]">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
          <div className="flex items-center justify-between gap-4 sm:block">
            <div className="h-[28px] w-[120px] sm:h-[38px] sm:w-[138px]">
              <img
                src={KIT_ASSETS.logokit}
                alt="EasyLips"
                className="h-full w-full object-contain object-left"
              />
            </div>

            <div className="flex items-center gap-4 sm:hidden">
              <a href="#" aria-label="X" className="h-5 w-5">
                <img src={KIT_ASSETS.socialX} alt="" className="h-full w-full" />
              </a>
              <a href="#" aria-label="Instagram" className="h-5 w-5">
                <img src={KIT_ASSETS.socialInstagram} alt="" className="h-full w-full" />
              </a>
              <a href="#" aria-label="YouTube" className="h-5 w-5">
                <img src={KIT_ASSETS.socialYoutube} alt="" className="h-full w-full" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-[40px] sm:gap-y-8 md:gap-x-[60px]">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <FooterColumn key={title} title={title} links={links} />
            ))}
          </div>

          <div className="hidden items-center gap-[30px] sm:flex">
            <a href="#" aria-label="X" className="h-6 w-6">
              <img src={KIT_ASSETS.socialX} alt="" className="h-full w-full" />
            </a>
            <a href="#" aria-label="Instagram" className="h-6 w-6">
              <img src={KIT_ASSETS.socialInstagram} alt="" className="h-full w-full" />
            </a>
            <a href="#" aria-label="YouTube" className="h-6 w-6">
              <img src={KIT_ASSETS.socialYoutube} alt="" className="h-full w-full" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto hidden max-w-[1200px] items-center justify-center gap-6 border-b border-white/15 px-6 py-[13px] sm:flex sm:gap-[74px]">
        <img src={KIT_ASSETS.logo} alt="EasyLips" className="h-[38px] w-[38px] shrink-0 object-cover" />

        <nav className="flex flex-wrap items-center justify-center gap-[30px] rounded-[60px] border border-white/15 px-10 py-2">
          {NAV_LINKS.map((item) => (
            <span key={item.label} className="flex items-center gap-[3px]">
              <span className="text-[13px] text-white/60" style={{ lineHeight: '26px' }}>
                {item.label}
              </span>
              {item.hasCaret && (
                <img src={KIT_ASSETS.caretDown} alt="" className="h-[14px] w-[14px]" />
              )}
            </span>
          ))}
        </nav>

        <div className="rounded-xl border border-white/15 p-1.5">
          <WaitlistButton variant="purple" size="sm" />
        </div>
      </div>

      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 border-b border-white/15 px-4 py-3 sm:hidden">
        <img src={KIT_ASSETS.logo} alt="EasyLips" className="h-7 w-7 shrink-0" />
        <p className="text-[11px] text-white/40">© 2026 EasyLips</p>
        <WaitlistButton variant="purple" size="sm" />
      </div>
    </footer>
  )
}
