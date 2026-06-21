import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5">
        <nav
          className="flex items-center justify-between gap-6 md:gap-8 px-4 py-2.5 md:px-5 md:py-3 w-full max-w-[calc(100%-2rem)] lg:max-w-[1140px]"
          style={{
            borderRadius: '999px',
            transition: 'all 0.5s cubic-bezier(0.32,0.72,0,1)',
            background: scrolled ? 'rgba(1, 1, 4, 0.96)' : 'rgba(1, 1, 4, 0.78)',
            border: '1px solid rgba(234, 10, 26, 0.14)',
            boxShadow: scrolled
              ? '0 8px 40px rgba(234, 10, 26, 0.10), inset 0 1px 0 rgba(255,255,255,0.04)'
              : 'inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          <a href="/" className="flex items-center gap-2.5 shrink-0 no-underline">
            <span
              className="flex items-center justify-center"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '11px',
                background: 'linear-gradient(135deg, #ea0a1a 0%, #ff1f2e 100%)',
                boxShadow: '0 0 22px rgba(234, 10, 26, 0.45)',
              }}
            >
              <WaveformLogo />
            </span>
            <span
              className="text-white font-semibold tracking-tight"
              style={{ fontSize: '16px', letterSpacing: '-0.02em' }}
            >
              Easy Lips
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-8 m-0 p-0 list-none">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-2.5">
            <StartTranslatingBtn />
          </div>

          <button
            className="max-lg:flex lg:hidden flex-col items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', gap: '5px', width: '34px', height: '34px' }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '20px',
                  height: '2px',
                  background: '#ffffff',
                  borderRadius: '2px',
                  transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translateY(7px)'
                    : i === 2 ? 'rotate(-45deg) translateY(-7px)'
                    : 'scaleX(0)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </nav>
      </header>

      <div
        className="max-lg:flex lg:hidden flex-col items-center justify-center fixed inset-0 z-40"
        style={{
          backdropFilter: menuOpen ? 'blur(24px)' : 'blur(0px)',
          WebkitBackdropFilter: menuOpen ? 'blur(24px)' : 'blur(0px)',
          background: menuOpen ? 'rgba(1, 1, 4, 0.98)' : 'transparent',
          pointerEvents: menuOpen ? 'auto' : 'none',
          opacity: menuOpen ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.32,0.72,0,1)',
          gap: '32px',
        }}
      >
        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 500,
              textDecoration: 'none',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 0.5s cubic-bezier(0.32,0.72,0,1) ${0.1 + i * 0.05}s`,
            }}
          >
            {link.label}
          </a>
        ))}
        <Link
          to="/signup"
          onClick={() => setMenuOpen(false)}
          style={{
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 26px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #ea0a1a 0%, #ff1f2e 100%)',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 0 24px rgba(234, 10, 26, 0.45)',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.5s cubic-bezier(0.32,0.72,0,1) 0.35s',
          }}
        >
          <WaveformLogo size={15} />
          Start Translating
        </Link>
      </div>
    </>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? '#ffffff' : 'rgba(255, 255, 255, 0.62)',
        fontSize: '14px',
        fontWeight: 500,
        textDecoration: 'none',
        letterSpacing: '-0.01em',
        transition: 'color 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {label}
    </a>
  )
}

function StartTranslatingBtn() {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to="/signup"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'linear-gradient(135deg, #ea0a1a 0%, #ff1f2e 100%)',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 600,
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '999px',
        letterSpacing: '-0.01em',
        boxShadow: hovered
          ? '0 0 26px rgba(234, 10, 26, 0.55), 0 6px 20px rgba(234, 10, 26, 0.25)'
          : '0 0 16px rgba(234, 10, 26, 0.35)',
        transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      <WaveformLogo size={14} />
      Start Translating
    </Link>
  )
}

function WaveformLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="1" y="7" width="2" height="4" rx="1" fill="#ffffff" />
      <rect x="4.6" y="4" width="2" height="10" rx="1" fill="#ffffff" />
      <rect x="8.2" y="2" width="2" height="14" rx="1" fill="#ffffff" />
      <rect x="11.8" y="5" width="2" height="8" rx="1" fill="#ffffff" />
      <rect x="15.4" y="7.5" width="2" height="3" rx="1" fill="#ffffff" />
    </svg>
  )
}
