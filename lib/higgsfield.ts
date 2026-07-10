const BASE = process.env.HIGGSFIELD_API_BASE_URL ?? 'https://api.higgsfield.ai'

function authHeaders() {
  const key = process.env.HIGGSFIELD_API_KEY
  if (!key) throw new Error('HIGGSFIELD_API_KEY is not set')
  return {
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

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

export async function submitJob(
  jobSetType: ImageModel | VideoModel,
  params: ImageParams | VideoParams,
): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/jobs/submit`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ job_set_type: jobSetType, params }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Higgsfield submit failed (${res.status}): ${body}`)
  }
  return res.json()
}

export async function getJob(jobId: string): Promise<Job> {
  const res = await fetch(`${BASE}/jobs/${jobId}`, {
    headers: authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Higgsfield poll failed (${res.status}): ${body}`)
  }
  return res.json()
}
