import { Navbar, Hero, Features, HowItWorks, Languages, Testimonials, Pricing, Faq, CtaSection, Footer } from '@/components/landing'

export function LandingPage() {
  return (
    <main className="dark relative">
      <div className="grain-overlay" aria-hidden />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Pricing />
      <Languages />
      <Features />
      <Testimonials />
      <Faq />
      <CtaSection />
      <Footer />
    </main>
  )
}
