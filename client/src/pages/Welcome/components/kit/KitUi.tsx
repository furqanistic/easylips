import type { CSSProperties, ReactNode } from 'react'
import { KIT_ASSETS } from './assets'

export function CheckIcon() {
  return <img src={KIT_ASSETS.check} alt="" className="h-[15px] w-[15px] shrink-0" />
}

export function WaitlistButton({
  variant = 'dark',
  size = 'md',
  className = '',
}: {
  variant?: 'dark' | 'purple'
  size?: 'md' | 'sm'
  className?: string
}) {
  const isPurple = variant === 'purple'
  const isSm = size === 'sm'

  return (
    <button
      type="button"
      className={`relative overflow-hidden border border-white/15 text-white transition-opacity hover:opacity-90 ${className}`}
      style={{
        borderRadius: isSm ? 8 : 10,
        padding: isSm ? '2px 15px' : '6px 15px',
        fontSize: 14,
        lineHeight: '26px',
        background: isPurple ? 'rgba(140, 69, 255, 0.4)' : 'rgba(61, 61, 61, 0.4)',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        boxShadow: 'inset 0px 0px 6px 3px rgba(255,255,255,0.25)',
        width: isSm ? 109 : '100%',
        height: isSm ? 30 : undefined,
      }}
    >
      Join waitlist
    </button>
  )
}

export function PricingRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-[5px] py-2 sm:py-[10px]">
      <CheckIcon />
      <span className="text-sm text-white" style={{ lineHeight: '22px', letterSpacing: '-0.0014em' }}>
        {children}
      </span>
    </div>
  )
}

export function CardDivider() {
  return <div className="h-px w-full bg-[#282729]" />
}

export function SectionHeading({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <h2
      className={`text-center font-medium text-white ${className}`}
      style={{
        fontSize: 'clamp(28px, 5vw, 56px)',
        lineHeight: '1.15',
        letterSpacing: '-0.84px',
        ...style,
      }}
    >
      {children}
    </h2>
  )
}

export function SectionSubheading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`text-center text-white ${className}`}
      style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', lineHeight: '1.55', letterSpacing: '-0.002em' }}
    >
      {children}
    </p>
  )
}
