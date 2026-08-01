'use client'
import { useState } from 'react'

const TRENDING = [
  'UAV components', 'Solar grid', 'Biometric ID', 'Precision sensors',
  'Encrypted comms', 'Water treatment', 'Agri drones', 'Smart meters',
  'Medical imaging', 'Border surveillance',
]

export function MarketplaceSearch() {
  const [query, setQuery] = useState('')

  return (
    <div>
      <div style={{
        display: 'flex',
        maxWidth: 640,
        margin: '0 auto 20px',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
      }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Find SADC-verified suppliers, services, technology..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: 'none',
            padding: '14px 20px',
            fontSize: 13,
            color: 'rgba(240,240,250,0.9)',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button style={{
          background: '#2dd4bf',
          border: 'none',
          padding: '14px 28px',
          fontSize: 12,
          fontFamily: 'var(--font-barlow-condensed), Arial',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#000',
          cursor: 'pointer',
          flexShrink: 0,
        }}>
          SEARCH
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 640, margin: '0 auto' }}>
        <span style={{ fontSize: 11, color: 'rgba(240,240,250,0.3)', alignSelf: 'center', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Trending:
        </span>
        {TRENDING.map(tag => (
          <button
            key={tag}
            onClick={() => setQuery(tag)}
            style={{
              background: query === tag ? 'rgba(45,212,191,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${query === tag ? 'rgba(45,212,191,0.35)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 11,
              color: query === tag ? '#2dd4bf' : 'rgba(240,240,250,0.5)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
