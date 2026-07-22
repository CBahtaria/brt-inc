import { ScrollScene } from './ScrollScene'

const STACK = [
  'PHP 8', 'TypeScript', 'Python', 'Zig', 'React 19', 'Next.js', 'NestJS 11',
  'Expo 54', 'UE5 C++', 'FastAPI', 'Docker', 'Vercel', 'GSAP', 'Three.js',
  'PostgreSQL', 'PostGIS', 'Redis', 'NATS JetStream', 'AES-GCM', 'TFLite',
  'ONNX', 'Qdrant', 'Supabase', 'zstd', 'Steam', 'OpenXR',
]

export function StackStrip() {
  return (
    <ScrollScene>
      <section className="py-16 border-y overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <p className="text-center font-mono text-xs uppercase tracking-widest mb-8" style={{ color: 'var(--text-subtle)' }}>
          Stack
        </p>
        <div className="flex gap-4 flex-wrap justify-center px-6">
          {STACK.map(s => (
            <span
              key={s}
              className="font-mono text-xs px-3 py-1.5 rounded-full border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--surface-1)' }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>
    </ScrollScene>
  )
}
