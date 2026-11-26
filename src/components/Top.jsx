import { useEffect, useRef, useState } from 'react'
import { gsap, reduce, goTo } from '../lib/motion'
import { Crest, CREST_PATHS, Img } from './ui'

const SLIDES = [
  ['hero', 'Casa principală cu acoperișuri în A și pergola cu trandafiri, la apus'],
  ['front', 'Intrarea principală, cu aleea de trandafiri'],
  ['gazebo', 'Foișorul de lemn la marginea câmpului, sub nori de apus'],
  ['pool', 'Piscina exterioară, vara'],
]

export function Intro({ onDone }) {
  const [show] = useState(() => {
    let seen = false
    try { seen = sessionStorage.getItem('dd3') === '1' } catch { /* private mode */ }
    return !reduce && !seen
  })
  const root = useRef(null)
  const tl = useRef(null)
  useEffect(() => {
    if (!show) { onDone(); return }
    document.documentElement.classList.add('intro-on')
    scrollTo(0, 0)
    const q = gsap.utils.selector(root.current)
    gsap.set(q('path'), { strokeDasharray: 1, strokeDashoffset: 1 })
    const finish = () => {
      document.documentElement.classList.remove('intro-on')
      try { sessionStorage.setItem('dd3', '1') } catch { /* ignore */ }
      if (root.current) root.current.hidden = true
    }
    tl.current = gsap.timeline({ onComplete: finish })
      .to(q('path'), { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.08 }, 0.15)
      .to(q('.w'), { opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.8)
      .to(q('.c'), { opacity: 0, y: -10, duration: 0.5, ease: 'power2.in' }, 2.05)
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.15, ease: 'expo.inOut' }, 2.35)
      .add(onDone, 2.55)
      .to('.hd', { opacity: 1, duration: 0.9 }, 2.9)
    return () => tl.current && tl.current.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!show) return null
  return (
    <div className="intro" id="intro" ref={root} style={{ display: "grid" }}>
      <div className="c" aria-hidden="true">
        <svg viewBox="0 0 64 60"><g className="crest">{CREST_PATHS.map((d) => <path key={d} d={d} pathLength="1" />)}</g></svg>
        <div className="w">Drumul Dragostei<small>Vințu de Jos · Alba</small></div>
      </div>
      <button className="sk" id="isk" type="button" onClick={() => tl.current && tl.current.progress(1)}>Sari peste</button>
    </div>
  )
}

export function Header({ onAbout, onBook }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.72)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <header className={'hd' + (solid ? ' solid' : '')} id="hd">
      <button className="nv" type="button" id="aboutBtn" aria-haspopup="dialog" onClick={onAbout}>Despre noi</button>
      <a className="logo" href="#top" aria-label="Pensiunea Drumul Dragostei, sus" onClick={(e) => { e.preventDefault(); goTo('#top') }}>
        <Crest /><span className="wm" aria-hidden="true">Drumul Dragostei<small>Vințu de Jos · Alba</small></span>
      </a>
      <button className="nv r" type="button" aria-haspopup="dialog" onClick={() => onBook('caz')}>Rezervă acum</button>
    </header>
  )
}

export function Hero({ started }) {
  const [i, setI] = useState(0)
  const imgs = useRef([])
  const q = useRef(null)
  // ken burns on the active slide, auto-advance every 7s
  useEffect(() => {
    if (!started) return
    const img = imgs.current[i]
    if (img && !reduce) gsap.fromTo(img, { scale: 1.1, xPercent: 0 }, { scale: 1, xPercent: Math.random() < 0.5 ? -1.5 : 1.5, duration: 9, ease: 'none' })
    if (reduce) return
    const t = setTimeout(() => setI((n) => (n + 1) % SLIDES.length), 7000)
    return () => clearTimeout(t)
  }, [i, started])
  useEffect(() => {
    if (!started || reduce) return
    const s = gsap.utils.selector(q.current)
    gsap.fromTo(s('.ln>span'), { yPercent: 110 }, { yPercent: 0, duration: 1.6, ease: 'expo.out', stagger: 0.12, delay: 0.2 })
    gsap.fromTo(s('cite'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.7 })
    gsap.fromTo('#dots,.hero .scroll', { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 1 })
  }, [started])
  return (
    <section className="hero" aria-label="Pensiunea Drumul Dragostei">
      <div className="slides" id="slides">
        {SLIDES.map(([n, alt], k) => (
          <Img key={n} name={n} alt={alt} eager={k === 0} fetchpriority={k === 0 ? 'high' : undefined} className={k === i ? 'on' : ''} ref={(el) => (imgs.current[k] = el)} />
        ))}
      </div>
      <div className="q" id="heroQ" ref={q}>
        <p aria-label="Pe Drumul Dragostei te oprești cel puțin o dată-n viață.">
          <span className="ln" aria-hidden="true"><span>Pe Drumul Dragostei te oprești</span></span>
          <span className="ln" aria-hidden="true"><span>cel puțin o dată-n viață.</span></span>
        </p>
        <cite>Vorbă a casei, Vințu de Jos</cite>
      </div>
      <div className="dots" id="dots" role="group" aria-label="Fotografii">
        {SLIDES.map((_, k) => (
          <button key={k} type="button" aria-label={`Fotografia ${k + 1}`} className={k === i ? 'on' : ''} onClick={() => setI(k)}><i key={k === i ? 'a' + i : 'b'} /></button>
        ))}
      </div>
      <span className="scroll" aria-hidden="true" />
    </section>
  )
}
