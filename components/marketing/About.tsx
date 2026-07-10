import { ScrollScene } from './ScrollScene'

export function About() {
  return (
    <ScrollScene>
      <section id="about" className="py-32 max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-subtle)' }}>About</p>
        <h2 className="text-4xl lg:text-5xl font-semibold mb-6 max-w-3xl">
          One engineer. Institution-grade output.
        </h2>
        <p className="text-lg max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          BRT Inc. is a Manzini-based software firm serving SADC national institutions — defence forces, government agencies, national libraries, and royals. I build the infrastructure that must not fail.
        </p>
      </section>
    </ScrollScene>
  )
}
