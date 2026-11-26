import { useCallback, useEffect, useRef, useState } from 'react'
import { fine, goTo, gsap, reduce, ScrollTrigger, startLenis } from './lib/motion'
import { CrestSymbol } from './components/ui'
import { Header, Hero, Intro } from './components/Top'
import { Events, Footer, Pool, Restaurant, Rooms, RoomsIntro, Seasons, Statement, Surroundings, TwoUp, Voices } from './components/Sections'
import { About, Doc, RoomDrawer } from './components/Overlays'
import Book from './components/Book'

/* reveal on scroll, parallax and the small cursor */
function useMotion(ready) {
  useEffect(() => {
    if (!ready) return
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('v'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -10% 0px' })
    document.querySelectorAll('[data-r],.rv,[data-lines],[data-hl]').forEach((el) => io.observe(el))
    if (reduce) return () => io.disconnect()
    const ctx = gsap.context(() => {
      gsap.to('#slides', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('#heroQ', { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: true } })
      gsap.utils.toArray('.s02 .ph img,.s03 .ph img,.s18 .ph img').forEach((img) => gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.closest('.ph'), start: 'top bottom', end: 'bottom top', scrub: true } }))
      gsap.fromTo('.stack .b', { yPercent: 20 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.stack', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.stack .a', { yPercent: -4 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.stack', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.s07 button:nth-child(2) .ph', { y: 50 }, { y: -20, ease: 'none', scrollTrigger: { trigger: '.s07', start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    const refresh = () => ScrollTrigger.refresh()
    addEventListener('load', refresh)
    let off = () => {}
    if (fine) {
      const c = document.getElementById('cur')
      const qx = gsap.quickTo(c, 'x', { duration: 0.35, ease: 'power3' }), qy = gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power3' })
      const hd = document.getElementById('hd')
      const mv = (e) => {
        qx(e.clientX); qy(e.clientY); c.classList.add('on')
        const t = e.target
        c.classList.toggle('lt', !!t.closest('.hero') || (!!t.closest('.hd') && !hd.classList.contains('solid')))
        const hot = t.closest('a,button,label,select,input')
        gsap.to(c, { scale: hot ? 4.6 : 1, opacity: hot ? 0.2 : 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
      }
      const lv = () => c.classList.remove('on')
      addEventListener('pointermove', mv, { passive: true }); document.addEventListener('pointerleave', lv)
      off = () => { removeEventListener('pointermove', mv); document.removeEventListener('pointerleave', lv) }
    }
    return () => { io.disconnect(); ctx.revert(); removeEventListener('load', refresh); off() }
  }, [ready])
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [about, setAbout] = useState(false)
  const [book, setBook] = useState(null) // { tab, room?, rmode?, ev?, n }
  const [room, setRoom] = useState(null)
  const [doc, setDoc] = useState(null)
  const pending = useRef(null) // action to run once an overlay has finished closing

  useEffect(() => { startLenis() }, [])
  useMotion(true)
  const onIntroDone = useCallback(() => setStarted(true), [])

  const openBook = (tab, opts = {}) => setBook({ tab, ...opts, n: Date.now() })
  const runPending = () => { const p = pending.current; pending.current = null; if (p) p() }

  return (
    <>
      <a className="skip" href="#continut">Sari la conținut</a>
      <CrestSymbol />
      <Intro onDone={onIntroDone} />
      <Header onAbout={() => setAbout(true)} onBook={openBook} />
      <main id="top">
        <Hero started={started} />
        <div id="continut" />
        <div className="g-xl" /><Statement /><div className="g-xl" />
        <Seasons /><div className="g-xl" />
        <TwoUp /><div className="g-xl" />
        <RoomsIntro />
        <Rooms onRoom={setRoom} />
        <Voices />
        <Restaurant onBook={openBook} />
        <Events onBook={openBook} />
        <Pool />
        <Surroundings />
      </main>
      <Footer onDoc={setDoc} />

      <About open={about} onClose={() => setAbout(false)}
        onAfterClose={pending.current ? runPending : undefined}
        onGo={(h) => { if (!about) { goTo(h); return } pending.current = () => goTo(h); setAbout(false) }}
        onBook={(t) => { pending.current = () => openBook(t); setAbout(false) }} />
      <Book req={book} onClose={() => setBook(null)} />
      <RoomDrawer room={room} onClose={() => setRoom(null)} onAfterClose={pending.current ? runPending : undefined}
        onBookRoom={() => { const r = room; pending.current = () => openBook('caz', { room: r }); setRoom(null) }} />
      <Doc id="privacy" open={doc === 'privacy'} onClose={() => setDoc(null)} />
      <Doc id="cookies" open={doc === 'cookies'} onClose={() => setDoc(null)} />
      <div className="cur" id="cur" aria-hidden="true" />
    </>
  )
}
