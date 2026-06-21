import { Navbar, Hero, TalkSection, CtaSection } from '@/components/landing'

export function LandingPage() {
  return (
    <main className="dark">
      <Navbar />
      <Hero />
      <TalkSection />
      <CtaSection />
    </main>
  )
}
