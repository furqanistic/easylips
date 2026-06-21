import { Navbar, Hero, Features, HowItWorks, Languages, Testimonials, CtaSection, Footer } from '@/components/landing'

export function LandingPage() {
  return (
    <main className="dark relative">
      <div className="grain-overlay" aria-hidden />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Languages />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  )
}
