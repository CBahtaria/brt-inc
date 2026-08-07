import { ScrollChapterNav } from '@/components/marketing/ScrollChapterNav'
import { ScrollProgressBar } from '@/components/marketing/ScrollProgressBar'
import { CursorGlow } from '@/components/marketing/CursorGlow'
import { Nav } from '@/components/marketing/Nav'
import { Hero } from '@/components/marketing/Hero'
import { TerminalBoot } from '@/components/marketing/TerminalBoot'
import { WhoChips } from '@/components/marketing/WhoChips'
import { Services } from '@/components/marketing/Services'
import { AIEngineeringCapabilities } from '@/components/marketing/AIEngineeringCapabilities'
import { ProductSection } from '@/components/marketing/ProductSection'
import { SentinelFlowDiagram } from '@/components/marketing/SentinelFlowDiagram'
import { UAVFlowDiagram } from '@/components/marketing/UAVFlowDiagram'
import { Marketplace } from '@/components/marketing/Marketplace'
import { MaizeNeuralViz } from '@/components/marketing/MaizeNeuralViz'
import { Portfolio } from '@/components/marketing/Portfolio'
import { CaseStudies } from '@/components/marketing/CaseStudies'
import { ModelStack } from '@/components/marketing/ModelStack'
import { EcosystemSection } from '@/components/marketing/EcosystemSection'
import { StackStrip } from '@/components/marketing/StackStrip'
import { Impact } from '@/components/marketing/Impact'
import { BenefitCards } from '@/components/marketing/BenefitCards'
import { Process } from '@/components/marketing/Process'
import { Testimonials } from '@/components/marketing/Testimonials'
import { Pricing } from '@/components/marketing/Pricing'
import { FAQ } from '@/components/marketing/FAQ'
import { Newsletter } from '@/components/marketing/Newsletter'
import { Contact } from '@/components/marketing/Contact'
import { Footer } from '@/components/marketing/Footer'

export default function HomePage() {
  return (
    <>
      <ScrollChapterNav />
      <ScrollProgressBar />
      <CursorGlow />
      <Nav />
      <main>
        {/* Entry — identity and audience */}
        <Hero />
        <TerminalBoot />
        <WhoChips />

        {/* Capabilities — what we do */}
        <Services />
        <AIEngineeringCapabilities />

        {/* Products — each product with its explainer */}
        <ProductSection
          eyebrow="COMMAND & CONTROL"
          title="SENTINEL V5.0"
          imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
          imageAlt="Command and control center"
          specs={[
            { value: '200+', label: 'OPERATORS' },
            { value: '4-ROLE', label: 'RBAC' },
            { value: 'TOTP 2FA', label: 'AUTH' },
          ]}
          primaryCta={{ label: 'LEARN MORE', href: '#sentinel' }}
          secondaryCta={{ label: 'CAPABILITIES', href: '#services' }}
          id="sentinel"
        />
        <SentinelFlowDiagram />

        <ProductSection
          eyebrow="AUTONOMOUS SYSTEMS"
          title="AGENTIC UAV STACK"
          imageSrc="https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1920&q=80"
          imageAlt="Autonomous drone in flight"
          specs={[
            { value: 'DAL-A', label: 'CERTIFIED' },
            { value: 'SRL-3', label: 'CLEARED' },
            { value: '942', label: 'TESTS' },
          ]}
          primaryCta={{ label: 'LEARN MORE', href: '#uav' }}
          id="uav"
        />
        <UAVFlowDiagram />

        <ProductSection
          eyebrow="B2B PROCUREMENT"
          title="SADC SOVEREIGN MARKETPLACE"
          imageSrc="https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?auto=format&fit=crop&w=1920&q=80"
          imageAlt="African trade and commerce"
          specs={[
            { value: '200+', label: 'SUPPLIERS' },
            { value: '6', label: 'CATEGORIES' },
            { value: 'SADC', label: 'VERIFIED' },
          ]}
          primaryCta={{ label: 'ENTER MARKETPLACE', href: '/marketplace' }}
          id="marketplace"
        />
        <Marketplace />

        <ProductSection
          eyebrow="UE5 HISTORICAL RPG"
          title="MAHLANYA"
          imageSrc="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1920&q=80"
          imageAlt="African landscape — Eswatini"
          specs={[
            { value: '19th C.', label: 'SWAZI ERA' },
            { value: '10m DEM', label: 'TERRAIN' },
            { value: 'CVT', label: 'SETTLEMENTS' },
          ]}
          primaryCta={{ label: 'LEARN MORE', href: '#mahlanya' }}
          id="mahlanya"
        />

        <ProductSection
          eyebrow="AGRICULTURAL AI"
          title="MAIZE LEAF CLASSIFIER"
          imageSrc="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1920&q=80"
          imageAlt="Precision agriculture — maize field"
          specs={[
            { value: 'MobileNetV2', label: 'BACKBONE' },
            { value: 'SSA', label: 'FOCUSED' },
            { value: 'Binary', label: 'CLASSIFIER' },
          ]}
          primaryCta={{ label: 'LEARN MORE', href: '#maize' }}
          id="maize"
        />
        <MaizeNeuralViz />

        {/* Proof — what's been shipped */}
        <Portfolio />
        <CaseStudies />

        {/* Architecture & scale */}
        <ModelStack />
        <EcosystemSection />
        <StackStrip />

        {/* Impact metrics */}
        <section id="impact"><Impact /></section>

        {/* Why BRT */}
        <BenefitCards />
        <Process />
        <Testimonials />

        {/* Conversion */}
        <Pricing />
        <FAQ />
        <Newsletter />
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
    </>
  )
}
