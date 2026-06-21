import { Navbar, Hero, Features, HowItWorks, Languages, Testimonials, Pricing, CtaSection, Footer } from '@/components/landing'

export function LandingPage() {
  return (
    <main className="dark relative">
      <div className="grain-overlay" aria-hidden />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Languages />
      <Features />
      <Testimonials />
      <Pricing />
      <CtaSection />
      <Footer />
    </main>
  )
}
