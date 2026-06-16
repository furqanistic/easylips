import {
  Navbar,
  Hero,
  Features,
  HowItWorks,
  Languages,
  Testimonials,
  Pricing,
  CtaSection,
  Footer,
} from '@/components/landing'

export function LandingPage() {
  return (
    <main className="dark">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Languages />
      <Testimonials />
      <Pricing />
      <CtaSection />
      <Footer />
    </main>
  )
}
