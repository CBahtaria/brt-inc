'use client'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, slideIn } from '@/lib/motion'

const SERVICES = [
  {
    title: 'Security Audit & Hardening',
    desc: 'Static analysis, penetration testing, auth hardening, CSP configuration, and hash-chained audit logging for high-trust systems.',
  },
  {
    title: 'Command & Control Systems',
    desc: 'Real-time C2 platforms for defence and security operations. WebSocket telemetry, RBAC, TOTP 2FA, and AES-GCM encrypted comms.',
  },
  {
    title: 'AI / ML Pipelines',
    desc: 'On-device inference, RAG knowledge retrieval, macroeconomic forecasting, and biometric systems — accuracy and latency first.',
  },
  {
    title: 'Autonomous Systems',
    desc: 'DAL-A compliant autopilots with formal safety governors. AI feeds a validator that checks geometric invariants before flight control.',
  },
  {
    title: 'Social & Marketplace Platforms',
    desc: 'Full-stack platforms with edge compression, RAG-backed search, escrow payments, anti-spam ML, and adaptive self-improving pipelines.',
  },
  {
    title: 'Institutional Platforms',
    desc: 'National-scale infrastructure for libraries, resilience agencies, and civic institutions across southern Africa.',
  },
  {
    title: 'Game Development',
    desc: 'Unreal Engine 5 C++ with hardware-adaptive scalers, historically accurate content pipelines, and Steam integration.',
  },
]

export function Services() {
  return (
    <section id="services" className="py-32 max-w-7xl mx-auto px-6">
      <motion.div
        variants={slideIn('left', 0, 0.5)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Services</p>
        <h2 className="text-4xl lg:text-5xl font-semibold mb-12">What I build.</h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer(0.07, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {SERVICES.map(s => (
          <motion.div
            key={s.title}
            variants={fadeUp}
            className="group p-6 rounded-xl border transition-colors duration-300"
            style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
            whileHover={{ borderColor: 'rgba(99,102,241,0.3)', transition: { duration: 0.2 } }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>{s.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
