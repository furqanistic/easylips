import { ClientsSection } from './ClientsSection'
import { KitCtaSection } from './KitCtaSection'
import { KitFooter } from './KitFooter'
import { KitPricingSection } from './KitPricingSection'

export function LandingGroup() {
  return (
    <>
      <ClientsSection />
      <KitPricingSection />
      <KitCtaSection />
      <KitFooter />
    </>
  )
}
