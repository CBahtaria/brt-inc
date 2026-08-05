const MODELS = [
  {
    abbr: 'BRT',
    name: 'brt-base',
    sub: 'Fine-tuned Llama 3.2 3B',
    avatarBg: '#6366f1',
    avatarColor: '#fff',
    cardBorder: 'rgba(99,102,241,0.35)',
  },
  {
    abbr: 'L3',
    name: 'Llama 3.2',
    sub: 'Meta · 3B · Apache 2.0',
    avatarBg: '#1e1b4b',
    avatarColor: '#a78bfa',
    cardBorder: 'rgba(167,139,250,0.22)',
  },
  {
    abbr: 'M7',
    name: 'Mistral 7B',
    sub: 'Mistral AI · 7B · Apache 2.0',
    avatarBg: '#0f2027',
    avatarColor: '#2dd4bf',
    cardBorder: 'rgba(45,212,191,0.22)',
  },
  {
    abbr: 'BGE',
    name: 'BGE Embeddings',
    sub: 'BAAI · 1024-dim · MIT',
    avatarBg: '#1c1400',
    avatarColor: '#f59e0b',
    cardBorder: 'rgba(245,158,11,0.22)',
  },
  {
    abbr: '◎',
    name: 'Whisper',
    sub: 'OpenAI · STT · MIT',
    avatarBg: '#111',
    avatarColor: '#94a3b8',
    cardBorder: 'rgba(148,163,184,0.20)',
  },
  {
    abbr: 'SD',
    name: 'SDXL',
    sub: 'Stability AI · ComfyUI · OpenRAIL',
    avatarBg: '#1a0820',
    avatarColor: '#f9a8d4',
    cardBorder: 'rgba(249,168,212,0.22)',
  },
]

export function ModelStack() {
  return (
    <section style={{ background: 'var(--surface-1)', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2
          style={{
            textAlign: 'center',
            color: 'var(--text)',
            fontWeight: 600,
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            margin: '0 0 0.5rem',
          }}
        >
          Powered By Open-Source AI
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1rem', margin: '0 0 2.5rem' }}>
          All models run locally on BRT infrastructure — zero API cost, zero data egress
        </p>

        <div
          style={{
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {MODELS.map(m => (
            <div
              key={m.name}
              style={{
                width: 160,
                background: 'linear-gradient(136deg, #1c2233 0%, #111825 100%)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                border: `1px solid ${m.cardBorder}`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: m.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: m.abbr.length <= 2 ? 20 : 14,
                  fontWeight: 700,
                  color: m.avatarColor,
                  letterSpacing: '-0.02em',
                  fontFamily: 'var(--font-barlow-condensed), monospace',
                }}
              >
                {m.abbr}
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.9rem', margin: '0 0 4px' }}>{m.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', margin: 0, lineHeight: 1.4 }}>{m.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.8rem', marginTop: '2rem' }}>
          Apache 2.0 / MIT / OpenRAIL licensed · commercial use confirmed · SADC scale within all limits
        </p>
      </div>
    </section>
  )
}
