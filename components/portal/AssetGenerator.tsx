'use client'
import { useState, useRef } from 'react'

type Model = 'gpt_image_2' | 'nano_banana_2' | 'recraft_v4_1' | 'seedance_2_0' | 'kling3_0'
type Status = 'idle' | 'submitting' | 'polling' | 'done' | 'error'
type MediaType = 'image' | 'video'

const MODELS: { value: Model; label: string; type: MediaType; note: string }[] = [
  { value: 'gpt_image_2',    label: 'GPT Image 2',     type: 'image', note: 'Best for UI, banners, text-on-image, high-fidelity' },
  { value: 'nano_banana_2',  label: 'Nano Banana 2',   type: 'image', note: 'Character, cartoon, stylized art' },
  { value: 'recraft_v4_1',   label: 'Recraft V4.1',    type: 'image', note: 'Logos, icons, vector-style graphics' },
  { value: 'seedance_2_0',   label: 'Seedance 2.0',    type: 'video', note: 'Cinematic video up to 4K, 4–15s' },
  { value: 'kling3_0',       label: 'Kling 3.0',       type: 'video', note: 'Budget cinematic, simpler scenes' },
]

const ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:4']
const IMAGE_RESOLUTIONS = ['1k', '2k', '4k']
const VIDEO_RESOLUTIONS = ['480p', '720p', '1080p', '4k']
const VIDEO_DURATIONS = [4, 5, 6, 8, 10, 12, 15]

const PRESETS = [
  { label: 'BRT Inc. Hero Image', model: 'gpt_image_2' as Model, prompt: 'Dark cinematic banner: defence-grade software engineering firm BRT Inc., Manzini Eswatini. Dark background (#09090b), indigo accent (#6366f1), geometric circuit-board patterns, SADC map silhouette, professional tech aesthetic, no people', aspectRatio: '16:9', resolution: '2k' },
  { label: 'MahlanyaRPG Trailer', model: 'seedance_2_0' as Model, prompt: 'Cinematic UE5 historical RPG trailer: 18th century Eswatini kingdom, warriors in traditional dress, dramatic African savanna landscape at golden hour, Swazi royal architecture, atmospheric volumetric lighting, 4K cinematic grade', aspectRatio: '16:9', duration: 12, resolution: '4k' },
  { label: 'OG Image', model: 'gpt_image_2' as Model, prompt: 'Professional dark tech OG image for BRT Inc. website. Text "BRT Inc." large and bold, subtitle "Safety-Critical Software for SADC Institutions", dark background, indigo glow accent, southern Africa map subtle background element', aspectRatio: '16:9', resolution: '2k' },
  { label: 'UAV Stack Visual', model: 'gpt_image_2' as Model, prompt: 'Technical illustration: autonomous UAV drone with digital safety-layer shield overlay, formal verification mathematical symbols, dark background with cyan (#2dd4bf) accent lines, defence-grade aesthetic, isometric engineering diagram style', aspectRatio: '16:9', resolution: '2k' },
]

interface GeneratedAsset {
  url: string
  thumbnailUrl?: string
  model: Model
  prompt: string
  type: MediaType
  timestamp: number
}

export function AssetGenerator() {
  const [model, setModel] = useState<Model>('gpt_image_2')
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [resolution, setResolution] = useState('2k')
  const [duration, setDuration] = useState(8)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [assets, setAssets] = useState<GeneratedAsset[]>([])
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const selectedModel = MODELS.find(m => m.value === model)!
  const isVideo = selectedModel.type === 'video'

  function applyPreset(p: typeof PRESETS[0]) {
    setModel(p.model)
    setPrompt(p.prompt)
    setAspectRatio(p.aspectRatio ?? '16:9')
    if ('resolution' in p && p.resolution) setResolution(p.resolution)
    if ('duration' in p && p.duration) setDuration(p.duration)
  }

  function stopPolling() {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = null
  }

  async function pollJob(jobId: string, modelValue: Model, promptText: string, mediaType: MediaType) {
    try {
      const res = await fetch(`/api/generate/${jobId}`)
      const data = await res.json()

      if (data.status === 'completed' && data.url) {
        stopPolling()
        setStatus('done')
        setCurrentJobId(null)
        setAssets(prev => [{
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          model: modelValue,
          prompt: promptText,
          type: mediaType,
          timestamp: Date.now(),
        }, ...prev])
      } else if (data.status === 'failed') {
        stopPolling()
        setStatus('error')
        setError(data.error ?? 'Generation failed on server')
        setCurrentJobId(null)
      }
    } catch {
      // transient network error — keep polling
    }
  }

  async function generate() {
    if (!prompt.trim()) return
    setStatus('submitting')
    setError(null)

    const params: Record<string, unknown> = {
      prompt: prompt.trim(),
      aspect_ratio: aspectRatio,
      resolution,
    }
    if (isVideo) params.duration = duration

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, params }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setError(data.error ?? 'Submit failed')
        return
      }

      setCurrentJobId(data.jobId)
      setStatus('polling')
      const capturedModel = model
      const capturedPrompt = prompt.trim()
      const capturedType = selectedModel.type
      pollRef.current = setInterval(() => {
        pollJob(data.jobId, capturedModel, capturedPrompt, capturedType)
      }, 5000)
    } catch {
      setStatus('error')
      setError('Network error — check connection')
    }
  }

  const isBusy = status === 'submitting' || status === 'polling'

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>
          Quick presets
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              disabled={isBusy}
              className="font-mono text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: controls */}
        <div className="space-y-4">
          {/* Model */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>
              Model
            </label>
            <div className="space-y-1.5">
              {MODELS.map(m => (
                <label
                  key={m.value}
                  className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                  style={{
                    borderColor: model === m.value ? 'var(--accent)' : 'var(--border)',
                    background: model === m.value ? 'rgba(99,102,241,0.06)' : 'var(--surface-1)',
                  }}
                >
                  <input
                    type="radio"
                    name="model"
                    value={m.value}
                    checked={model === m.value}
                    onChange={() => { setModel(m.value); setResolution(m.type === 'video' ? '720p' : '2k') }}
                    className="mt-0.5 accent-indigo-500"
                  />
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{m.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.note}</div>
                  </div>
                  <span
                    className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-subtle)' }}
                  >
                    {m.type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe what to generate…"
              disabled={isBusy}
              className="w-full px-4 py-3 rounded-md text-sm resize-none focus:outline-none transition-colors disabled:opacity-40"
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Options row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[120px]">
              <label className="block font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>
                Aspect
              </label>
              <select
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value)}
                disabled={isBusy}
                className="w-full px-3 py-2 rounded-md text-sm disabled:opacity-40"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="flex-1 min-w-[100px]">
              <label className="block font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>
                Resolution
              </label>
              <select
                value={resolution}
                onChange={e => setResolution(e.target.value)}
                disabled={isBusy}
                className="w-full px-3 py-2 rounded-md text-sm disabled:opacity-40"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                {(isVideo ? VIDEO_RESOLUTIONS : IMAGE_RESOLUTIONS).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {isVideo && (
              <div className="flex-1 min-w-[80px]">
                <label className="block font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  disabled={isBusy}
                  className="w-full px-3 py-2 rounded-md text-sm disabled:opacity-40"
                  style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  {VIDEO_DURATIONS.map(d => <option key={d} value={d}>{d}s</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={generate}
            disabled={isBusy || !prompt.trim()}
            className="w-full py-3 rounded-md text-sm font-medium transition-colors disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {status === 'submitting' && 'Submitting…'}
            {status === 'polling' && (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Generating{isVideo ? ' video' : ' image'}… ({currentJobId?.slice(0, 8)})
              </span>
            )}
            {(status === 'idle' || status === 'done' || status === 'error') && `Generate ${isVideo ? 'Video' : 'Image'}`}
          </button>

          {error && (
            <p role="alert" className="text-sm px-3 py-2 rounded-md" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
              {error}
            </p>
          )}
        </div>

        {/* Right: results */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>
            Generated assets
          </p>

          {assets.length === 0 && status !== 'polling' && (
            <div
              className="h-48 rounded-xl border flex items-center justify-center"
              style={{ borderColor: 'var(--border)', color: 'var(--text-subtle)' }}
            >
              <span className="text-sm">Results appear here</span>
            </div>
          )}

          {status === 'polling' && assets.length === 0 && (
            <div
              className="h-48 rounded-xl border flex flex-col items-center justify-center gap-3"
              style={{ borderColor: 'var(--border)', color: 'var(--text-subtle)' }}
            >
              <span className="inline-block w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span className="text-xs">Polling for result every 5s…</span>
            </div>
          )}

          <div className="space-y-3">
            {assets.map(asset => (
              <div
                key={asset.timestamp}
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: 'var(--border)' }}
              >
                {asset.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.url}
                    alt={asset.prompt}
                    className="w-full object-cover"
                    style={{ maxHeight: 280 }}
                  />
                ) : (
                  <video
                    src={asset.url}
                    controls
                    className="w-full"
                    style={{ maxHeight: 280 }}
                  />
                )}
                <div className="p-3" style={{ background: 'var(--surface-1)' }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px]" style={{ color: 'var(--text-subtle)' }}>
                      {asset.model} · {new Date(asset.timestamp).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(asset.url)}
                      className="font-mono text-[10px] px-2 py-0.5 rounded border transition-colors"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                    >
                      Copy URL
                    </button>
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{asset.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
