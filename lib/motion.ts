import type { Variants, Transition } from 'framer-motion'

// Shared transition presets
const spring: Transition = { type: 'spring', damping: 24, stiffness: 200 }
const smooth: Transition = { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.6 }

// Fade up — viewport-triggered section reveal
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: smooth },
}

// Stagger container — wraps child variants that use fadeUp/slideIn
export function staggerContainer(staggerChildren = 0.1, delayChildren = 0): Variants {
  return {
    hidden: {},
    show:   { transition: { staggerChildren, delayChildren } },
  }
}

// Slide in from a direction
export function slideIn(
  direction: 'left' | 'right' | 'up' | 'down',
  delay = 0,
  duration = 0.6,
): Variants {
  const isHoriz = direction === 'left' || direction === 'right'
  const sign    = direction === 'left' || direction === 'up' ? -1 : 1
  const t = { delay, duration, ease: [0.22, 1, 0.36, 1] as const }
  if (isHoriz) {
    return {
      hidden: { opacity: 0, x: sign * 60 },
      show:   { opacity: 1, x: 0, transition: t },
    }
  }
  return {
    hidden: { opacity: 0, y: sign * 60 },
    show:   { opacity: 1, y: 0, transition: t },
  }
}

// Per-character stagger for hero headings
export const charVariant: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: spring },
}

export function pullupContainer(length: number): Variants {
  return {
    hidden: {},
    show:   { transition: { staggerChildren: 0.04, delayChildren: 0.2 } },
  }
}

// Scale pop — for metric numbers, badges
export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show:   { opacity: 1, scale: 1, transition: spring },
}

// Animated height reveal (framer-motion-recipes panel pattern)
export const heightReveal: Variants = {
  hidden: { height: 0, opacity: 0 },
  show:   { height: 'auto', opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:   { height: 0, opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
}

// Explore-card expand (adrianhajdin metaverse pattern)
export const cardExpand: Variants = {
  inactive: { flex: '0.5', transition: smooth },
  active:   { flex: '3.5', transition: smooth },
}

// Text reveal line-by-line (suitable for mono descriptions)
export function textReveal(delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: 8 },
    show:   { opacity: 1, y: 0, transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  }
}
