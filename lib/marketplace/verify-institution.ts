const SADC_GOV_TLDS = [
  '.gov.sz', '.gov.za', '.gov.bw', '.gov.zw', '.gov.mz',
  '.gov.ls', '.gov.na', '.gov.zm', '.gov.mw', '.gov.tz',
  '.ac.sz', '.ac.za', '.ac.bw', '.ac.zw', '.ac.mz',
  '.edu.mz', '.edu.na', '.edu.zm',
]

const SADC_DEFENCE_DOMAINS = [
  'mod.gov.sz', 'umbutfo.sz',
  'sandf.mil.za', 'armscor.co.za',
  'bdf.gov.bw',
]

let swotCache: Set<string> | null = null

async function getSwotDomains(): Promise<Set<string>> {
  if (swotCache) return swotCache

  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/leereilly/swot/master/lib/data.json',
      { next: { revalidate: 86400 } }
    )
    const data = await res.json() as Record<string, unknown>
    const domains = new Set<string>()
    const flatten = (node: unknown) => {
      if (typeof node === 'string') { domains.add(node.toLowerCase()); return }
      if (Array.isArray(node)) { node.forEach(flatten); return }
      if (node && typeof node === 'object') { Object.values(node as Record<string, unknown>).forEach(flatten) }
    }
    flatten(data)
    swotCache = domains
    return domains
  } catch {
    return new Set()
  }
}

function getDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() ?? ''
}

export async function isInstitutionalEmail(email: string): Promise<boolean> {
  const domain = getDomain(email)
  if (!domain) return false

  if (SADC_DEFENCE_DOMAINS.some(d => domain === d || domain.endsWith('.' + d))) return true
  if (SADC_GOV_TLDS.some(tld => domain.endsWith(tld))) return true

  const swot = await getSwotDomains()
  return swot.has(domain)
}

export function isSadcDomain(email: string): boolean {
  const domain = getDomain(email)
  return SADC_GOV_TLDS.some(tld => domain.endsWith(tld)) ||
    SADC_DEFENCE_DOMAINS.some(d => domain === d)
}
