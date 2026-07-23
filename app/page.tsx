import { LazyMotion, domAnimation } from 'framer-motion'
import { Nav } from '@/components/marketing/Nav'
import { Hero } from '@/components/marketing/Hero'
import { About } from '@/components/marketing/About'
import { WhoChips } from '@/components/marketing/WhoChips'
import { PracticeAreas } from '@/components/marketing/PracticeAreas'
import { StackStrip } from '@/components/marketing/StackStrip'
import { Services } from '@/components/marketing/Services'
import { Process } from '@/components/marketing/Process'
import { Portfolio } from '@/components/marketing/Portfolio'
import { CaseStudies } from '@/components/marketing/CaseStudies'
import { Impact } from '@/components/marketing/Impact'
import { Testimonials } from '@/components/marketing/Testimonials'
import { Pricing } from '@/components/marketing/Pricing'
import { FAQ } from '@/components/marketing/FAQ'
import { TerminalBoot } from '@/components/marketing/TerminalBoot'
import { EcosystemSection } from '@/components/marketing/EcosystemSection'
import { Contact } from '@/components/marketing/Contact'
import { Footer } from '@/components/marketing/Footer'

export default function HomePage() {
  return (
    <LazyMotion features={domAnimation}>
      <Nav />
      <main>
        <Hero />
        <About />
        <WhoChips />
        <PracticeAreas />
        <StackStrip />
        <Services />
        <Process />
        <Portfolio />
        <CaseStudies />
        <TerminalBoot />
        <EcosystemSection />
        <Impact />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </LazyMotion>
  )
}
