import { useEffect, useState } from 'react'
import { CONFIG } from '../config'
import { goTo, reduce } from '../lib/motion'
import { Crest, Img, SplitLines } from './ui'

const A = ({ href, children, ...p }) => <a href={href} onClick={(e) => { e.preventDefault(); goTo(href) }} {...p}>{children}</a>
const Hair = () => <><div className="g-l" /><hr className="hair hairline-anim" data-hl="" /><div className="g-l" /></>

export function Statement() {
  return (
    <section className="sec s01" aria-label="Despre casă">
      <SplitLines className="t-st" text="Drumul Dragostei este un loc anume. Așezată pe un fost braț al râului Sebeș, la marginea satului Vințu de Jos, pensiunea a fost gândită ca o casă a inimii: pentru prieteni și pentru iubire, pentru plăcerile mesei și pentru liniștea de la țară. Bine ați venit pe Drumul Dragostei." />
    </section>
  )
}

export function Seasons() {
  return (
    <section className="sec s02" aria-labelledby="h-ano">
      <A href="#piscina" className="ph rv" aria-label="Spre piscină"><Img name="gazebo" alt="Foișorul din grădină, la apus" sizes="(max-width:900px) 100vw, 58vw" /></A>
      <div className="tx">
        <h2 className="t-h3" id="h-ano" data-r="">Cel mai frumos anotimp pe Drumul Dragostei? Fiecare.</h2>
        <div className="t-p" data-r="" style={{ '--d': '120ms' }}>
          <p>Primăvara, când se deschid trandafirii de pe alee și grădina miroase a iarbă proaspăt tăiată. Vara, cu zile lungi la piscină și seri pe terasa camerei. Toamna, când dealurile Albei se fac aramii, iar în bucătărie se gătește încet. Iarna, când casa cu acoperișuri în A se luminează în zăpadă și sala restaurantului devine locul cel mai cald din sat.</p>
          <p>O pensiune de trei margarete, la nouă kilometri de Alba Iulia, cu un singur fel de a primi oaspeți: ca acasă.</p>
        </div>
      </div>
    </section>
  )
}

export function TwoUp() {
  return (
    <section className="sec s03" aria-label="Restaurant și evenimente">
      <article className="a" data-r="">
        <A href="#restaurant" className="ph rv"><Img name="dish-ribs" alt="Coaste la grătar pe fața de masă cusută în albastru" style={{ objectPosition: '40% 60%' }} sizes="(max-width:900px) 100vw, 33vw" /></A>
        <h3 className="t-h3">Gustul casei</h3>
        <p className="t-p">Bucătărie tradițională și internațională, gătită zilnic de la 10 la 22 și servită pe fețe de masă cusute în albastru, în sala de sub grinzi sau pe terasa umbrită.</p>
        <A className="more" href="#restaurant">Restaurantul</A>
      </article>
      <article className="b" data-r="" style={{ '--d': '140ms' }}>
        <A href="#evenimente" className="ph rv" style={{ '--d': '140ms' }}><Img name="table-round" alt="Mese rotunde pregătite pentru eveniment, cu șervete roșii" sizes="(max-width:900px) 100vw, 66vw" /></A>
        <h3 className="t-h3">Zilele importante</h3>
        <p className="t-p" style={{ maxWidth: '60ch' }}>Nunți sub pergola cu trandafiri, botezuri și mese de familie în sala mare, petreceri în grădină. Invitații care vin de departe dorm la noi, în cele zece camere ale casei.</p>
        <A className="more" href="#evenimente">Evenimente</A>
      </article>
    </section>
  )
}

export function RoomsIntro() {
  return (
    <section className="sec s02 rev" id="camere" aria-labelledby="h-cam">
      <A href="#cazare" className="ph rv"><Img name="room-red" alt="Camera matrimonială, cu perete roșu și mobilier din lemn masiv" sizes="(max-width:900px) 100vw, 58vw" /></A>
      <div className="tx">
        <h2 className="t-h3" id="h-cam" data-r="">Camerele noastre</h2>
        <p className="t-p" data-r="" style={{ '--d': '100ms' }}>Trei feluri de a dormi pe Drumul Dragostei: Matrimonială, Twin și Triplă. Zece camere în aripi joase, în jurul curții, fiecare cu intrarea ei, terasă privată cu fotolii de răchită, baie proprie, frigider și televizor. Dimineața, ușa se deschide direct spre grădină.</p>
        <A className="more" href="#cazare" data-r="" style={{ '--d': '180ms' }}>Descoperă camerele</A>
      </div>
    </section>
  )
}

const TRIP = [['Matrimonială', 'room-red2', '60% 50%'], ['Twin', 'room-twin', '55% 50%'], ['Triplă', 'room-gold', '50% 50%']]
export function Rooms({ onRoom }) {
  return (
    <>
      <Hair />
      <section className="sec s07" id="cazare" aria-label="Tipurile de camere">
        {TRIP.map(([n, img, pos], k) => {
          const r = CONFIG.camere[n]
          return (
            <button key={n} type="button" data-room={n} aria-haspopup="dialog" onClick={() => onRoom(n)}>
              <span className="ph rv" style={{ '--d': k * 110 + 'ms' }}><Img name={img} style={{ objectPosition: pos }} sizes="(max-width:540px) 100vw, 33vw" /></span>
              <span><span className="lb">{n}</span><small>{r.nr} camere · {r.pers} persoane · de la {r.pret} lei</small></span>
            </button>
          )
        })}
      </section>
      <Hair />
    </>
  )
}

export function Voices() {
  const R = CONFIG.recenzii
  const [i, setI] = useState(0)
  const [sw, setSw] = useState(false)
  const [auto, setAuto] = useState(true)
  const show = (n) => { setSw(true); setTimeout(() => { setI((n + R.length) % R.length); setSw(false) }, reduce ? 0 : 380) }
  useEffect(() => {
    if (!auto || reduce) return
    const t = setInterval(() => show(i + 1), 8000)
    return () => clearInterval(t)
  })
  return (
    <section className="sec s08" id="recenzii" aria-labelledby="h-voc">
      <div className="tx">
        <p className="cap" data-r="">Oaspeții noștri</p>
        <h2 className="t-h3" id="h-voc" data-r="" style={{ '--d': '80ms' }}>Liniștea, de dimineața până seara</h2>
        <blockquote className={'hand' + (sw ? ' sw' : '')} id="vq" aria-live="polite" data-r="" style={{ '--d': '140ms' }}><span>{R[i][0]}</span></blockquote>
        <p className="who" id="vw">– {R[i][1]}</p>
        <div className="ctl">
          <button type="button" id="vp" aria-label="Recenzia anterioară" onClick={() => { setAuto(false); show(i - 1) }}>←</button>
          <span id="vn">{i + 1} / {R.length}</span>
          <button type="button" id="vx" aria-label="Recenzia următoare" onClick={() => { setAuto(false); show(i + 1) }}>→</button>
        </div>
        <p className="cap" style={{ color: 'var(--grey)' }}>9,0 din 105 evaluări pe Booking.com</p>
        <a className="btn" href={CONFIG.booking} target="_blank" rel="noopener noreferrer">Citește toate recenziile</a>
      </div>
      <div className="stack">
        <figure className="ph rv a"><Img name="terrace" alt="Terasa unei camere, cu fotolii de răchită și flori" style={{ objectPosition: '62% 50%' }} sizes="(max-width:900px) 58vw, 28vw" /></figure>
        <figure className="ph rv b" style={{ '--d': '240ms' }}><Img name="path" alt="Aleea cu pergolă și trandafiri spre casă" sizes="(max-width:900px) 43vw, 21vw" /></figure>
      </div>
    </section>
  )
}

export function Restaurant({ onBook }) {
  return (
    <>
      <Hair />
      <section className="sec s18" id="restaurant" aria-labelledby="h-rest">
        <figure className="ph rv"><Img name="hall-tri" alt="Sala restaurantului sub acoperișul în A, cu ferestre triunghiulare" sizes="(max-width:900px) 100vw, 32vw" /></figure>
        <div className="tx">
          <h2 className="t-h2" id="h-rest" data-r="">Sub grinzi de lemn, masa e pusă</h2>
          <p className="cap" data-r="" style={{ '--d': '60ms' }}>Restaurantul · zilnic {CONFIG.restaurant.program}</p>
          <div className="t-letter" data-r="" style={{ '--d': '120ms' }}><p>Restaurantul e deschis pentru oaspeții casei, pentru cei aflați în drum și pentru vecinii din Vințu de Jos. Gătim din bucătăria tradițională și internațională, à la carte, iar vara mesele se mută pe terasa umbrită. Micul dejun al oaspeților costă {CONFIG.micDejun} de lei de persoană.</p></div>
          <dl className="menu" data-r="" style={{ '--d': '180ms' }}>
            {CONFIG.meniu.map((m) => <div key={m.n}><dt>{m.n}</dt><dd>{m.d}</dd></div>)}
          </dl>
          <div data-r="" style={{ '--d': '220ms', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button className="btn" type="button" data-book="rest" data-rmode="masa" onClick={() => onBook('rest', { rmode: 'masa' })}>Rezervă o masă</button>
            <button className="btn" type="button" data-book="rest" data-rmode="platouri" onClick={() => onBook('rest', { rmode: 'platouri' })}>Platouri la comandă</button>
          </div>
        </div>
      </section>
    </>
  )
}

export function Events({ onBook }) {
  return (
    <>
      <div className="g-l" />
      <section className="sec s18 rev" id="evenimente" aria-labelledby="h-ev">
        <figure className="ph rv"><Img name="hero2" alt="Grădina cu pergola și trandafiri, la apus" style={{ objectPosition: '60% 70%' }} sizes="(max-width:900px) 100vw, 32vw" /></figure>
        <div className="tx">
          <h2 className="t-h2" id="h-ev" data-r="">Zilele importante, la noi</h2>
          <p className="cap" data-r="" style={{ '--d': '60ms' }}>Nunți · botezuri · aniversări · evenimente corporate</p>
          <div className="t-letter" data-r="" style={{ '--d': '120ms' }}>
            <p>„Dragă Drumul Dragostei, ne-am cunoscut într-o zi de vară, sub pergola cu trandafiri.” Așa ne-am dori să înceapă amintirile oaspeților noștri.</p>
            <p>Avem sala mare de sub acoperișul în A, grădina cu pergolă pentru ceremonie, bucătăria casei, platourile reci și dulciurile făcute la noi, și zece camere pentru invitații care vin de departe. Spuneți-ne câți invitați aveți și ce vă doriți, iar noi vă propunem aranjamentul potrivit.</p>
          </div>
          <button className="btn" type="button" data-book="ev" onClick={() => onBook('ev')}>Cere o ofertă</button>
        </div>
      </section>
    </>
  )
}

const POOL = { deschisa: ['deschisă azi', '#2f7a4e'], inchisa: ['închisă în sezonul rece', '#9a9a9a'], curand: ['se deschide în curând', '#b8862b'] }
export function Pool() {
  const [st, col] = POOL[CONFIG.piscina.status] || POOL.inchisa
  return (
    <>
      <div className="g-l" />
      <section className="sec s18" id="piscina" aria-labelledby="h-pool">
        <figure className="ph rv"><Img name="pool2" alt="Piscina exterioară, cu șezlongurile pe margine" sizes="(max-width:900px) 100vw, 32vw" /></figure>
        <div className="tx">
          <h2 className="t-h2" id="h-pool" data-r="">Vara, la apă</h2>
          <p className="cap" data-r="" style={{ '--d': '60ms' }}>Piscina · <span className="pstat"><i style={{ background: col }} /><span>{st}</span></span></p>
          <div className="t-letter" data-r="" style={{ '--d': '120ms' }}><p>Piscina exterioară funcționează pe timpul verii și e gratuită pentru oaspeții cazați. Alături e un bar cu terasă umbrită: răcoritoare, înghețată și mâncare gătită.</p></div>
          <div className="facts" data-r="" style={{ '--d': '160ms' }}><div><b>1,60 m</b><span>adâncimea</span></div><div><b>0,80 m</b><span>zona copiilor</span></div><div><b>0 lei</b><span>pentru oaspeți</span></div></div>
          <table className="ptab" data-r="" style={{ '--d': '200ms' }}>
            <caption className="sr">Tarife pentru vizitatori</caption>
            <thead><tr><th scope="col">Vizitatori</th><th scope="col">Adulți</th><th scope="col">Copii 4–12</th></tr></thead>
            <tbody>
              <tr><th scope="row">Luni – vineri<small>10:00 – 20:00</small></th><td>45 lei</td><td>40 lei</td></tr>
              <tr><th scope="row">Sâmbătă – duminică<small>09:00 – 20:00</small></th><td>60 lei</td><td>55 lei</td></tr>
            </tbody>
          </table>
          <p className="hint">Copiii sub 4 ani intră gratuit. Tarifele se confirmă la deschiderea sezonului.</p>
        </div>
      </section>
    </>
  )
}

export function Surroundings() {
  return (
    <>
      <div className="g-l" />
      <section className="sec s18 rev" aria-labelledby="h-alba">
        <figure className="ph rv"><Img name="citadel" alt="Aleea din interiorul zidurilor Cetății Alba Carolina" sizes="(max-width:900px) 100vw, 32vw" /></figure>
        <div className="tx">
          <h2 className="t-h2" id="h-alba" data-r="">Alba Carolina, la nouă kilometri</h2>
          <p className="cap" data-r="" style={{ '--d': '60ms' }}>Împrejurimi</p>
          <div className="t-letter" data-r="" style={{ '--d': '120ms' }}>
            <p>Cea mai mare cetate în stil Vauban din România e la un sfert de oră de pensiune: porțile baroce, cele două catedrale și aleile de pe ziduri, bune de plimbat în orice anotimp.</p>
            <p>Spre sud, pe drumul Sebeșului, cetatea medievală de la Câlnic, din patrimoniul UNESCO, e la 24 de kilometri. Gara e la 5 km, iar aeroportul din Sibiu la 67 km.</p>
          </div>
          <a className="btn" href={CONFIG.harta} target="_blank" rel="noopener noreferrer">Vezi pe hartă</a>
          <p className="hint">Foto: DimiTalen, CC0, Wikimedia Commons</p>
        </div>
      </section>
    </>
  )
}

export function Footer({ onDoc }) {
  return (
    <footer id="contact">
      <nav className="fnav" aria-label="Linkuri">
        <A href="#cazare">Camere</A><A href="#restaurant">Restaurant</A><A href="#evenimente">Evenimente</A><A href="#piscina">Piscina</A><A href="#recenzii">Recenzii</A>
        <button type="button" data-doc="privacy" onClick={() => onDoc('privacy')}>Confidențialitate</button>
        <button type="button" data-doc="cookies" onClick={() => onDoc('cookies')}>Cookies</button>
        <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">ANPC</a>
      </nav>
      <div className="fbot">
        <div className="badges">
          <div className="badge"><Crest /><span>Drumul<br />Dragostei</span></div>
          <div className="badge"><b>9,0</b><span>Booking.com<br />105 evaluări</span></div>
          <div className="badge"><b>3</b><span>margarete<br />pensiune</span></div>
          <div className="badge"><b>10</b><span>camere<br />terasă privată</span></div>
        </div>
        <div className="fcon">
          <a className="tel" href={'tel:+' + CONFIG.telefon}>{CONFIG.telefonAfisat}</a>
          <a href={'mailto:' + CONFIG.email}>{CONFIG.email}</a>
          <span>Strada Prieteniei nr. 2, Vințu de Jos, Alba</span>
        </div>
      </div>
      <p className="fine">© {new Date().getFullYear()} Pensiunea Drumul Dragostei. Fotografii: Pensiunea Drumul Dragostei; Cetatea Alba Carolina: DimiTalen (CC0), Wikimedia Commons. Check-in 14:00–18:00, check-out până la 11:00. Plata cu cardul sau numerar. Nu se acceptă animale de companie.</p>
    </footer>
  )
}
