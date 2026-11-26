import { forwardRef, useEffect, useRef } from 'react'
import { src, srcSet } from '../lib/images'
import { lockScroll, unlockScroll } from '../lib/motion'

export const Img = forwardRef(function Img({ name, sizes = '100vw', alt = '', style, eager, ...rest }, ref) {
  return <img ref={ref} src={src(name)} srcSet={srcSet(name)} sizes={sizes} alt={alt} style={style} loading={eager ? 'eager' : 'lazy'} decoding="async" {...rest} />
})

export function Crest(props) {
  return <svg viewBox="0 0 64 60" aria-hidden="true" {...props}><use href="#crest" /></svg>
}

export function CrestSymbol() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="crest" viewBox="0 0 64 60"><g className="crest">{CREST_PATHS.map((d) => <path key={d} d={d} />)}</g></symbol>
    </svg>
  )
}
export const CREST_PATHS = [
  'M32 3 L50 44 L14 44 Z', 'M32 12 L44.5 40.5 L19.5 40.5 Z', 'M32 21 V40.5', 'M13 18 L25 44 L1 44 Z', 'M51 18 L63 44 L39 44 Z',
  'M2 50 C12 46 20 54 32 50 C44 46 52 54 62 50', 'M8 56 C16 53 24 59 32 56 C40 53 48 59 56 56',
]

/* <dialog> with enter/exit animation, scroll lock and focus return.
   onAfterClose runs once the exit animation has finished. */
export function Modal({ open, onClose, onAfterClose, className, delay = 380, children, ...rest }) {
  const ref = useRef(null)
  const ret = useRef(null)
  const after = useRef(onAfterClose)
  after.current = onAfterClose
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      ret.current = document.activeElement
      d.showModal()
      requestAnimationFrame(() => d.classList.add('in'))
      lockScroll()
    } else if (!open && d.open) {
      d.classList.remove('in')
      const t = setTimeout(() => {
        d.close(); unlockScroll()
        const cb = after.current
        if (cb) cb(); else if (ret.current && ret.current.focus) ret.current.focus()
      }, delay)
      return () => clearTimeout(t)
    }
  }, [open, delay])
  return (
    <dialog ref={ref} data-lenis-prevent className={className}
      onCancel={(e) => { e.preventDefault(); onClose() }}
      onClick={(e) => { if (e.target === ref.current && className.includes('drawer')) onClose() }} {...rest}>
      {children}
    </dialog>
  )
}

/* Splits a paragraph into masked lines for the line-by-line rise; re-splits on width change and after fonts load. */
export function SplitLines({ as: Tag = 'p', text, className }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const split = () => {
      el.innerHTML = text.split(/\s+/).map((w) => `<span class="w" style="display:inline-block">${esc(w)}</span>`).join(' ')
      const L = []; let top = null
      el.querySelectorAll('.w').forEach((w) => { if (w.offsetTop !== top) { L.push([]); top = w.offsetTop } L[L.length - 1].push(w.textContent) })
      el.innerHTML = L.map((l, i) => `<span class="ln" aria-hidden="true"><span style="--i:${i}">${esc(l.join(' '))}</span></span>`).join('')
    }
    split()
    document.fonts && document.fonts.ready.then(split)
    let lw = innerWidth, rt
    const onR = () => { if (innerWidth === lw) return; lw = innerWidth; clearTimeout(rt); rt = setTimeout(split, 150) }
    addEventListener('resize', onR)
    return () => { removeEventListener('resize', onR); clearTimeout(rt) }
  }, [text])
  return <Tag ref={ref} className={className} data-lines="" aria-label={text}>{text}</Tag>
}
