// ComfyUI REST client — drop-in replacement for lib/higgsfield.ts
// Requires ComfyUI running at COMFYUI_URL (default: http://comfyui:8188)
// Self-hosted SDXL (image) + AnimateDiff (video), zero paid API spend.

const BASE = process.env.COMFYUI_URL ?? 'http://comfyui:8188'

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface JobResult {
  rawUrl: string
  minUrl?: string
  thumbnailUrl?: string
}

export interface Job {
  id: string
  status: JobStatus
  job_set_type: string
  params: Record<string, unknown>
  results: JobResult[]
  error?: string
  created_at?: string
}

export type ImageModel = 'gpt_image_2' | 'nano_banana_2' | 'nano_banana_2_lite' | 'recraft_v4_1'
export type VideoModel = 'seedance_2_0' | 'kling3_0' | 'cinema_studio_video_3'

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '21:9'
export type ImageResolution = '1k' | '2k' | '4k'
export type VideoResolution = '480p' | '720p' | '1080p' | '4k'

export interface ImageParams {
  prompt: string
  aspect_ratio?: AspectRatio
  resolution?: ImageResolution
}

export interface VideoParams {
  prompt: string
  aspect_ratio?: AspectRatio
  duration?: number
  resolution?: VideoResolution
  start_image_url?: string
}

// ── Aspect ratio → pixel dimensions (SDXL optimal multiples of 64) ──────────

const SDXL_DIMS: Record<AspectRatio, [number, number]> = {
  '16:9':  [1344, 768],
  '9:16':  [768, 1344],
  '1:1':   [1024, 1024],
  '4:3':   [1152, 896],
  '3:4':   [896, 1152],
  '21:9':  [1536, 640],
}

// ── SDXL KSampler steps by resolution tier ───────────────────────────────────

const SDXL_STEPS: Record<ImageResolution, number> = {
  '1k': 20,
  '2k': 25,
  '4k': 30,
}

// ── Model → SDXL checkpoint mapping ──────────────────────────────────────────
// Checkpoint filenames must be present in ComfyUI's models/checkpoints/

const IMAGE_CHECKPOINT: Record<ImageModel, string> = {
  gpt_image_2:       'sd_xl_base_1.0.safetensors',   // high quality
  nano_banana_2:     'sd_xl_base_1.0.safetensors',
  nano_banana_2_lite:'sd_xl_turbo_1.0_fp16.safetensors', // fast, fewer steps
  recraft_v4_1:      'sd_xl_base_1.0.safetensors',
}

// ── Build SDXL ComfyUI workflow JSON ─────────────────────────────────────────

function buildImageWorkflow(
  model: ImageModel,
  params: ImageParams,
): Record<string, unknown> {
  const checkpoint = IMAGE_CHECKPOINT[model]
  const [w, h] = SDXL_DIMS[params.aspect_ratio ?? '1:1']
  const steps   = SDXL_STEPS[params.resolution ?? '1k']
  const turbo   = checkpoint.includes('turbo')
  const cfg     = turbo ? 1.5 : 7.5
  const sampler = turbo ? 'euler_ancestral' : 'euler'

  return {
    '1': { class_type: 'CheckpointLoaderSimple', inputs: { ckpt_name: checkpoint } },
    '2': { class_type: 'CLIPTextEncode', inputs: { text: params.prompt, clip: ['1', 1] } },
    '3': { class_type: 'CLIPTextEncode', inputs: { text: 'low quality, blurry, watermark', clip: ['1', 1] } },
    '4': { class_type: 'EmptyLatentImage', inputs: { width: w, height: h, batch_size: 1 } },
    '5': {
      class_type: 'KSampler',
      inputs: {
        model: ['1', 0], positive: ['2', 0], negative: ['3', 0],
        latent_image: ['4', 0],
        seed: Math.floor(Math.random() * 2 ** 32),
        steps, cfg, sampler_name: sampler, scheduler: 'karras', denoise: 1.0,
      },
    },
    '6': { class_type: 'VAEDecode', inputs: { samples: ['5', 0], vae: ['1', 2] } },
    '7': { class_type: 'SaveImage', inputs: { images: ['6', 0], filename_prefix: 'brt_gen' } },
  }
}

// ── Build AnimateDiff workflow JSON ───────────────────────────────────────────

function buildVideoWorkflow(
  _model: VideoModel,
  params: VideoParams,
): Record<string, unknown> {
  const [w, h] = SDXL_DIMS[params.aspect_ratio ?? '16:9']
  const frames = Math.min(Math.max((params.duration ?? 3) * 8, 8), 48) // 8 fps, 8–48 frames

  return {
    '1':  { class_type: 'CheckpointLoaderSimple', inputs: { ckpt_name: 'sd_xl_base_1.0.safetensors' } },
    '2':  { class_type: 'CLIPTextEncode', inputs: { text: params.prompt, clip: ['1', 1] } },
    '3':  { class_type: 'CLIPTextEncode', inputs: { text: 'low quality, blurry', clip: ['1', 1] } },
    '4':  { class_type: 'ADE_AnimateDiffUniformContextOptions', inputs: { context_length: 16, context_stride: 1, context_overlap: 4 } },
    '5':  { class_type: 'ADE_AnimateDiffLoaderWithContext', inputs: { model: ['1', 0], model_name: 'mm_sdxl_v10_beta.ckpt', context_options: ['4', 0], motion_lora: null } },
    '6':  { class_type: 'EmptyLatentImage', inputs: { width: w, height: h, batch_size: frames } },
    '7':  {
      class_type: 'KSampler',
      inputs: {
        model: ['5', 0], positive: ['2', 0], negative: ['3', 0],
        latent_image: ['6', 0],
        seed: Math.floor(Math.random() * 2 ** 32),
        steps: 20, cfg: 7.5, sampler_name: 'euler', scheduler: 'karras', denoise: 1.0,
      },
    },
    '8':  { class_type: 'VAEDecode', inputs: { samples: ['7', 0], vae: ['1', 2] } },
    '9':  { class_type: 'VHS_VideoCombine', inputs: { images: ['8', 0], frame_rate: 8, loop_count: 0, filename_prefix: 'brt_vid', format: 'video/h264-mp4', pingpong: false, save_output: true } },
  }
}

// ── Public API (identical contract to lib/higgsfield.ts) ─────────────────────

export async function submitJob(
  jobSetType: ImageModel | VideoModel,
  params: ImageParams | VideoParams,
): Promise<{ id: string }> {
  const isVideo = ['seedance_2_0', 'kling3_0', 'cinema_studio_video_3'].includes(jobSetType)
  const workflow = isVideo
    ? buildVideoWorkflow(jobSetType as VideoModel, params as VideoParams)
    : buildImageWorkflow(jobSetType as ImageModel, params as ImageParams)

  const res = await fetch(`${BASE}/api/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: workflow, client_id: 'brt-inc' }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`ComfyUI submit failed (${res.status}): ${body}`)
  }
  const { prompt_id } = await res.json() as { prompt_id: string }
  return { id: prompt_id }
}

export async function getJob(jobId: string): Promise<Job> {
  const res = await fetch(`${BASE}/history/${jobId}`, { cache: 'no-store' })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`ComfyUI poll failed (${res.status}): ${body}`)
  }

  const history = await res.json() as Record<string, unknown>
  const entry = history[jobId] as Record<string, unknown> | undefined

  if (!entry) {
    return { id: jobId, status: 'pending', job_set_type: '', params: {}, results: [] }
  }

  const status = entry.status as Record<string, unknown>
  const completed = (status?.completed as boolean) ?? false
  const errored   = (status?.status_str as string) === 'error'
  const outputs   = (entry.outputs as Record<string, unknown>) ?? {}

  const results: JobResult[] = []
  for (const nodeOut of Object.values(outputs)) {
    const images = ((nodeOut as Record<string, unknown>).images ?? []) as Array<Record<string, string>>
    for (const img of images) {
      if (img.type === 'output') {
        results.push({
          rawUrl: `${BASE}/view?filename=${encodeURIComponent(img.filename)}&subfolder=${img.subfolder ?? ''}&type=output`,
        })
      }
    }
    const videos = ((nodeOut as Record<string, unknown>).gifs ?? []) as Array<Record<string, string>>
    for (const vid of videos) {
      results.push({ rawUrl: `${BASE}/view?filename=${encodeURIComponent(vid.filename)}&subfolder=${vid.subfolder ?? ''}&type=output` })
    }
  }

  return {
    id: jobId,
    status: errored ? 'failed' : completed ? 'completed' : 'processing',
    job_set_type: '',
    params: {},
    results,
    error: errored ? String(status?.messages ?? 'ComfyUI error') : undefined,
  }
}
