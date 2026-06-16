import { useState } from 'react'

const links = {
  Product: ['Features', 'How it works', 'Languages', 'Pricing', 'API docs', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press kit', 'Contact'],
  Legal: ['Privacy policy', 'Terms of service', 'Cookie policy', 'GDPR'],
  'Use Cases': ['Video calls', 'Webinars', 'Customer support', 'Education', 'Sales calls'],
}

export function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        padding: '64px 0 32px',
        background: '#07080a',
        borderTop: '1px solid oklch(1 0 0 / 0.04)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6" style={{ marginBottom: '64px' }}>
          {/* Brand col */}
          <div className="col-span-2">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.6 0.2 20))',
                  boxShadow: '0 0 16px oklch(0.55 0.22 25 / 0.25)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 3L15 6M12 3L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" fill="white" />
                </svg>
              </span>
              <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '15px', letterSpacing: '-0.03em' }}>
                BetterLips
              </span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#454647', maxWidth: '200px', marginBottom: '20px' }}>
              Real-time AI voice translation for every conversation.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['X', 'in', 'GH'].map((social) => (
                <SocialBtn key={social} label={social} />
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <span
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#454647',
                  letterSpacing: '0.073em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                {category}
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item) => (
                  <li key={item}>
                    <FooterLink label={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-4"
          style={{
            paddingTop: '24px',
            borderTop: '1px solid oklch(1 0 0 / 0.03)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#363739' }}>
            © 2026 BetterLips, Inc. All rights reserved.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#363739', letterSpacing: '0.04em' }}>
              v2.0.0
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#363739' }}>
              <span
                className="animate-pulse-glow"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'oklch(0.7 0.2 120)',
                  boxShadow: '0 0 6px oklch(0.7 0.2 120)',
                }}
              />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialBtn({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 500,
        textDecoration: 'none',
        fontFamily: 'monospace',
        letterSpacing: '0.02em',
        background: 'transparent',
        color: hovered ? '#ffffff' : '#6a6b6c',
        border: `1px solid ${hovered ? 'oklch(1 0 0 / 0.15)' : 'oklch(1 0 0 / 0.06)'}`,
        transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {label}
    </a>
  )
}

function FooterLink({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: '13px',
        textDecoration: 'none',
        color: hovered ? '#9c9c9d' : '#6a6b6c',
        transition: 'color 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {label}
    </a>
  )
}
