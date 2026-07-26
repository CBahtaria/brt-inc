'use client'
import { motion } from 'framer-motion'

const CATEGORIES = [
  { icon: '🛡', label: 'Defence & Security',       count: 48, accent: '#f87171' },
  { icon: '🌾', label: 'Agricultural Intelligence', count: 31, accent: '#4ade80' },
  { icon: '⚡', label: 'Infrastructure & Energy',   count: 55, accent: '#fbbf24' },
  { icon: '🏛', label: 'Civic & Government Tech',   count: 27, accent: '#818cf8' },
  { icon: '🚁', label: 'Autonomous & Aerial',        count: 19, accent: '#2dd4bf' },
  { icon: '🧬', label: 'Healthcare & Biomedical',    count: 22, accent: '#c084fc' },
]

const SUPPLIERS = [
  { name: 'AeroSystems SA',  country: '🇿🇦', verified: true, products: 12, rating: 4.9, focus: 'UAV + Avionics' },
  { name: 'SecureNet SWZ',   country: '🇸🇿', verified: true, products: 7,  rating: 4.8, focus: 'Cybersecurity' },
  { name: 'AgriSense ZW',    country: '🇿🇼', verified: true, products: 15, rating: 4.7, focus: 'Precision Agri' },
  { name: 'CivicTech BW',    country: '🇧🇼', verified: true, products: 9,  rating: 4.8, focus: 'e-Government' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function Marketplace() {
  return (
    <section
      id="marketplace"
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#000' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% -5%, rgba(45,212,191,0.06) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--accent-2)' }}>
            Coming 2026
          </p>
          <h2
            className="font-display mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', color: 'var(--white-100)' }}
          >
            SADC Sovereign Marketplace
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--white-50)', lineHeight: 1.75 }}>
            Connect with verified technology suppliers across Southern Africa.
            Procurement designed for national institutions, defence forces, and infrastructure operators.
          </p>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-14">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              className="relative p-5 rounded-xl cursor-pointer transition-colors"
              style={{
                background: 'var(--surface-1)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="text-2xl mb-3">{cat.icon}</div>
              <div className="font-semibold text-sm mb-1" style={{ color: 'var(--white-90)' }}>{cat.label}</div>
              <div className="font-mono text-xs" style={{ color: cat.accent }}>{cat.count} suppliers</div>
            </motion.div>
          ))}
        </div>

        {/* Supplier strip */}
        <div className="mb-14">
          <p className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--white-40)' }}>
            Featured Suppliers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SUPPLIERS.map((s, i) => (
              <motion.div
                key={s.name}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-4 rounded-xl"
                style={{ background: 'var(--surface-2)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg">{s.country}</span>
                  {s.verified && (
                    <span
                      className="font-mono text-[9px] px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(45,212,191,0.1)',
                        color: 'var(--accent-2)',
                        border: '1px solid rgba(45,212,191,0.2)',
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--white-90)' }}>{s.name}</div>
                <div className="text-xs mb-3" style={{ color: 'var(--white-50)' }}>{s.focus}</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs" style={{ color: 'var(--white-40)' }}>{s.products} products</span>
                  <span className="font-mono text-xs" style={{ color: '#fbbf24' }}>★ {s.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RFQ CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center p-10 rounded-2xl"
          style={{ background: 'rgba(45,212,191,0.04)', border: '1px solid rgba(45,212,191,0.12)' }}
        >
          <h3
            className="font-display mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--white-100)' }}
          >
            Source What You Need
          </h3>
          <p className="text-sm mb-7 max-w-md mx-auto" style={{ color: 'var(--white-50)', lineHeight: 1.75 }}>
            Submit a Request for Quotation — reach 200+ SADC-verified technology suppliers.
            Procurement built for government timelines and sovereign standards.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="mailto:marketplace@brtinc.co.sz?subject=Marketplace%20RFQ"
              className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--accent-2)', color: '#000' }}
            >
              Post RFQ
            </a>
            <a
              href="#contact"
              className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--white-70)' }}
            >
              Browse Catalogue
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
