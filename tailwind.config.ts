import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background:    'var(--background)',
        'surface-1':   'var(--surface-1)',
        'surface-2':   'var(--surface-2)',
        border:        'var(--border)',
        accent:        'var(--accent)',
        'accent-2':    'var(--accent-2)',
        'accent-game': 'var(--accent-game)',
        text:          'var(--text)',
        'text-muted':  'var(--text-muted)',
        'text-subtle': 'var(--text-subtle)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
} satisfies Config
