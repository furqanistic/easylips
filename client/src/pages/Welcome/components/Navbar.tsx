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
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            padding: '10px 20px',
            borderRadius: '12px',
            width: 'min(1100px, 100%)',
            transition: 'all 0.5s cubic-bezier(0.32,0.72,0,1)',
            background: scrolled ? 'rgba(5,2,8,0.92)' : 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <a href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <img
              src="/assets/logoicon.png"
              alt="OneLingo"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
          </a>

          <ul style={{ display: 'flex', alignItems: 'center', gap: '28px', listStyle: 'none', margin: 0, padding: 0 }}
              className="hidden md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="hidden md:flex">
            <GhostBtn href="#demo" label="Sign in" />
            <PrimaryBtn href="#get-started" label="Join waitlist" />
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '16px',
                  height: '1px',
                  background: '#ffffff',
                  borderRadius: '1px',
                  transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translate(0, 6px)'
                    : i === 2 ? 'rotate(-45deg) translate(0, -6px)'
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
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          backdropFilter: menuOpen ? 'blur(24px)' : 'blur(0px)',
          WebkitBackdropFilter: menuOpen ? 'blur(24px)' : 'blur(0px)',
          background: menuOpen ? 'rgba(5,2,8,0.95)' : 'transparent',
          pointerEvents: menuOpen ? 'auto' : 'none',
          opacity: menuOpen ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.32,0.72,0,1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
        }}
        className="md:hidden"
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
            borderRadius: '8px',
            background: '#ffffff',
            color: '#000000',
            fontSize: '15px',
            fontWeight: 500,
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
        color: hovered ? '#ffffff' : '#9c9c9d',
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
        color: hovered ? '#ffffff' : '#9c9c9d',
        fontSize: '14px',
        fontWeight: 400,
        textDecoration: 'none',
        padding: '6px 12px',
        borderRadius: '8px',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
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
        background: hovered ? '#f5f5f5' : '#ffffff',
        color: '#000000',
        fontSize: '14px',
        fontWeight: 500,
        textDecoration: 'none',
        padding: '6px 14px',
        borderRadius: '8px',
        boxShadow: hovered ? '0 0 20px rgba(255,255,255,0.15)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {label}
    </a>
  )
}
