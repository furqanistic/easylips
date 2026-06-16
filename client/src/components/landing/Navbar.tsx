import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Languages', href: '#languages' },
  { label: 'Pricing', href: '#pricing' },
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
          className="flex items-center justify-between gap-6 md:gap-8 px-3 py-2.5 md:px-5 md:py-3 w-full max-w-[calc(100%-2rem)] lg:max-w-[1100px]"
          style={{
            borderRadius: '999px',
            transition: 'all 0.5s cubic-bezier(0.32,0.72,0,1)',
            background: scrolled ? 'oklch(0.055 0 0 / 0.92)' : 'oklch(0.055 0 0 / 0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid oklch(1 0 0 / 0.06)',
            boxShadow: scrolled ? '0 4px 30px oklch(0.55 0.22 25 / 0.06)' : 'none',
          }}
        >
          <a href="/" className="flex items-center gap-2.5 shrink-0 no-underline">
            <span
              className="flex items-center justify-center"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, oklch(0.55 0.22 25) 0%, oklch(0.6 0.2 20) 100%)',
                boxShadow: '0 0 20px oklch(0.55 0.22 25 / 0.35)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 3L15 6M12 3L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
            </span>
            <span className="text-white font-semibold text-[15px] tracking-tight">
              BetterLips
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-7 m-0 p-0 list-none">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-2.5">
            <GhostBtn href="#demo" label="Sign in" />
            <PrimaryBtn href="#get-started" label="Join waitlist" />
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
          background: menuOpen ? 'oklch(0.055 0 0 / 0.95)' : 'transparent',
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
        <a
          href="#get-started"
          onClick={() => setMenuOpen(false)}
          style={{
            marginTop: '8px',
            padding: '12px 24px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, oklch(0.55 0.22 25) 0%, oklch(0.6 0.2 20) 100%)',
            color: '#000000',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.5s cubic-bezier(0.32,0.72,0,1) 0.35s',
          }}
        >
          Join waitlist
        </a>
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
        color: hovered ? '#ffffff' : 'oklch(0.556 0 0)',
        fontSize: '14px',
        fontWeight: 400,
        textDecoration: 'none',
        letterSpacing: '0.01em',
        transition: 'color 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {label}
    </a>
  )
}

function GhostBtn({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? '#ffffff' : 'oklch(0.556 0 0)',
        fontSize: '14px',
        fontWeight: 400,
        textDecoration: 'none',
        padding: '6px 12px',
        borderRadius: '999px',
        border: `1px solid ${hovered ? 'oklch(1 0 0 / 0.15)' : 'oklch(1 0 0 / 0.08)'}`,
        transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {label}
    </a>
  )
}

function PrimaryBtn({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(135deg, oklch(0.55 0.22 25) 0%, oklch(0.6 0.2 20) 100%)',
        color: '#000000',
        fontSize: '14px',
        fontWeight: 600,
        textDecoration: 'none',
        padding: '6px 14px',
        borderRadius: '999px',
        boxShadow: hovered ? '0 0 20px oklch(0.55 0.22 25 / 0.3)' : '0 0 12px oklch(0.55 0.22 25 / 0.15)',
        transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {label}
    </a>
  )
}
