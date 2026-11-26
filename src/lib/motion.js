import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

export const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
export const fine = typeof matchMedia !== 'undefined' && matchMedia('(hover:hover) and (pointer:fine)').matches

let lenis = null
export function startLenis() {
  if (lenis || reduce) return lenis
  // overlays (<dialog>) scroll natively
  lenis = new Lenis({ lerp: 0.08, prevent: (n) => !!(n.closest && n.closest('dialog')) })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}
export const lockScroll = () => lenis && lenis.stop()
export const unlockScroll = () => lenis && lenis.start()

export function goTo(target) {
  const el = typeof target === 'string' ? (target === '#top' ? null : document.querySelector(target)) : target
  if (!el) { lenis ? lenis.scrollTo(0, { duration: 1.6 }) : scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return }
  if (lenis) lenis.scrollTo(el, { offset: -100, duration: 1.6 })
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
}
