import { useEffect, useMemo, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { dLong, dShort, iso, lei, nightsBetween, sendRequest, today, validPhone } from '../lib/booking'
import { gsap, reduce } from '../lib/motion'
import { Modal, OverlayTopProxy } from './BookParts'

const TABS = [['caz', 'Cazare'], ['ev', 'Eveniment'], ['rest', 'Restaurant și platouri']]

/* field helpers */
function Err({ id, msg }) { return <span className="err" id={id}>{msg || ''}</span> }
function Stepper({ id, label, value, onChange, min, max }) {
  return (
    <>
      <span className="lb" id={id + '-l'}>{label}</span>
      <div className="stp" role="group" aria-labelledby={id + '-l'}>
        <button type="button" data-s={id.split('-')[1]} data-d="-1" aria-label={`Mai puțin: ${label}`} disabled={value <= min} onClick={() => onChange((v) => Math.max(min, Math.min(max, v) - 1))}>−</button>
        <output id={id}>{value}</output>
        <button type="button" data-s={id.split('-')[1]} data-d="1" aria-label={`Mai mult: ${label}`} disabled={value >= max} onClick={() => onChange((v) => Math.min(max, Math.min(max, v) + 1))}>+</button>
      </div>
    </>
  )
}
function Opts({ legend, name, value, onChange, options, className = 'f', style }) {
  return (
    <fieldset className={className} style={style}><legend>{legend}</legend>
      <div className="opts">
        {options.map(([v, t, small]) => (
          <label key={v}><input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />{t}{small && <small>{small}</small>}</label>
        ))}
      </div>
    </fieldset>
  )
}
function Field({ id, label, err, ...p }) {
  return (
    <div className={'f' + (p.wide ? ' w3' : '')}>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={err ? 'true' : undefined} aria-describedby={err ? id + '-e' : undefined} {...p} wide={undefined} />
      <Err id={id + '-e'} msg={err} />
    </div>
  )
}
const focusFirstError = (form) => setTimeout(() => { const b = form && form.querySelector('[aria-invalid=true]'); if (b) b.focus() }, 0)
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

/* ---------- Cazare ---------- */
function Cazare({ preset }) {
  const [inD, setIn] = useState(''); const [outD, setOut] = useState('')
  const [room, setRoom] = useState('Matrimonială')
  const [rm, setRm] = useState(1); const [ad, setAd] = useState(2); const [ch, setCh] = useState(0)
  const [ages, setAges] = useState([])
  const [extra, setExtra] = useState(false); const [bf, setBf] = useState(false)
  const [nm, setNm] = useState(''); const [ph, setPh] = useState(''); const [msg, setMsg] = useState('')
  const [err, setErr] = useState({}); const [sent, setSent] = useState('')
  const form = useRef(null)
  useEffect(() => { if (preset && preset.room) setRoom(preset.room) }, [preset])

  const R = CONFIG.camere[room]
  const rooms = Math.max(1, Math.min(rm, R.nr))
  const useExtra = extra && !!R.extra
  const per = R.pers + (useExtra ? R.extra : 0)
  const persons = ad + ages.slice(0, ch).filter((a) => a === '' || +a >= CONFIG.copiiFaraLoc).length
  const need = Math.ceil(persons / per)
  const nights = nightsBetween(inD, outD)
  let warn = ''
  if (persons > rooms * per) warn = need <= R.nr
    ? `Pentru ${persons} persoane în camere ${room} aveți nevoie de ${need} camere.`
    : `Avem ${R.nr} camere ${room}, cu cel mult ${R.nr * (R.pers + R.extra)} locuri. Pentru ${persons} persoane combinați tipuri de camere: scrieți-ne în mesaj sau sunați-ne.`

  const setInDate = (v) => {
    setIn(v); clr('in')
    if (v) { const d = new Date(v + 'T12:00'); d.setDate(d.getDate() + 1); const min = iso(d); if (!outD || outD <= v) setOut(min) }
  }
  const clr = (k) => setErr((e) => ({ ...e, [k]: undefined }))
  const setChildren = (u) => setCh((c) => { const n = typeof u === 'function' ? u(c) : u; setAges((a) => { const b = a.slice(0, n); while (b.length < n) b.push(''); return b }); return n })
  const minOut = inD ? iso(new Date(new Date(inD + 'T12:00').getTime() + 864e5)) : today()

  const submit = (e) => {
    e.preventDefault()
    const via = e.nativeEvent.submitter && e.nativeEvent.submitter.dataset.via
    const E = {}
    if (!inD) E.in = 'Alegeți data sosirii.'; else if (inD < today()) E.in = 'Data a trecut.'
    else if (!outD) E.out = 'Alegeți data plecării.'; else if (nights < 1) E.out = 'Plecarea trebuie să fie după sosire.'
    ages.slice(0, ch).forEach((a, i) => { if (a === '') E['age' + i] = 'Alegeți vârsta.' })
    if (nm.trim().length < 3) E.nm = 'Scrieți-ne numele.'
    if (!validPhone(ph)) E.ph = 'Un număr de telefon valid, vă rog.'
    setErr(E)
    if (Object.keys(E).length || warn) { focusFirstError(form.current); return }
    const ag = ch ? `\nVârste copii: ${ages.slice(0, ch).map((a) => (a === '0' ? 'sub 1 an' : a + ' ani')).join(', ')}` : ''
    const text = `Bună ziua! Aș dori o rezervare la Drumul Dragostei.\nPerioada: ${dShort(inD)} – ${dShort(outD)} (${plural(nights, 'noapte', 'nopți')})\nCameră: ${rooms} × ${room}${useExtra ? ' + pat suplimentar' : ''}\nPersoane: ${plural(ad, 'adult', 'adulți')}${ch ? `, ${plural(ch, 'copil', 'copii')}` : ''}${ag}\nMic dejun: ${bf ? 'da' : 'nu'}\nNume: ${nm.trim()}\nTelefon: ${ph.trim()}` + (msg.trim() ? `\nMesaj: ${msg.trim()}` : '')
    setSent(sendRequest({ via, subject: `Cerere cazare ${dShort(inD)} – ${dShort(outD)}`, text, payload: { tip: 'cazare', sosire: inD, plecare: outD, camera: room, camere: rooms, adulti: ad, copii: ch, varste: ages.slice(0, ch), patSuplimentar: useExtra, micDejun: bf, nume: nm.trim(), telefon: ph.trim(), mesaj: msg.trim() } }))
  }
  const sumB = [`${rooms} × ${room}`, plural(ad, 'adult', 'adulți')]
  if (ch) sumB.push(plural(ch, 'copil', 'copii')); if (useExtra) sumB.push('pat suplimentar')
  const est = nights > 0 ? nights * rooms * R.pret + (bf ? nights * (ad + ch) * CONFIG.micDejun : 0) : 0

  return (
    <form ref={form} id="p-caz" role="tabpanel" aria-labelledby="t-caz" noValidate onSubmit={submit} style={{ width: 'min(1100px,100%)', display: 'grid', justifyItems: 'center' }}>
      <div className="bar">
        <div className="cell"><span className="lb">Check-in – Check-out</span>
          <div className="dates">
            <input id="c-in" type="date" aria-label="Sosire" min={today()} value={inD} onChange={(e) => setInDate(e.target.value)} aria-invalid={err.in ? 'true' : undefined} aria-describedby="c-in-e" />
            <span aria-hidden="true">–</span>
            <input id="c-out" type="date" aria-label="Plecare" min={minOut} value={outD} onChange={(e) => { setOut(e.target.value); clr('out') }} aria-invalid={err.out ? 'true' : undefined} aria-describedby="c-in-e" />
          </div>
          <Err id="c-in-e" msg={err.in || err.out} />
        </div>
        <div className="cell"><Stepper id="c-rm" label="Camere" value={rooms} min={1} max={R.nr} onChange={setRm} /></div>
        <div className="cell"><Stepper id="c-ad" label="Adulți" value={ad} min={1} max={20} onChange={setAd} /></div>
        <div className="cell"><Stepper id="c-ch" label="Copii" value={ch} min={0} max={10} onChange={setChildren} /></div>
        <button className="go" type="submit" data-via="wa">Verifică disponibilitatea</button>
      </div>
      <div className="more-f cazx">
        <Opts className="f w2" legend="Camera" name="room" value={room} onChange={setRoom} options={Object.entries(CONFIG.camere).map(([k, v]) => [k, k, v.pret + ' lei'])} />
        <div className="f">
          {!!R.extra && <label className="chk" id="c-extra-box"><input type="checkbox" id="c-extra" checked={extra} onChange={(e) => setExtra(e.target.checked)} />Pat suplimentar <small>la cerere</small></label>}
          <label className="chk"><input type="checkbox" id="c-bf" checked={bf} onChange={(e) => setBf(e.target.checked)} />Mic dejun <small>{CONFIG.micDejun} lei / pers.</small></label>
        </div>
        {ch > 0 && (
          <div className="ages" id="c-ages">
            {ages.slice(0, ch).map((a, i) => (
              <div className="f" key={i}><label htmlFor={'c-age' + i}>Vârsta copilului {i + 1}</label>
                <select id={'c-age' + i} value={a} aria-invalid={err['age' + i] ? 'true' : undefined} onChange={(e) => { const v = e.target.value; setAges((x) => x.map((y, k) => (k === i ? v : y))); clr('age' + i) }}>
                  <option value="">Alegeți</option>
                  {Array.from({ length: 18 }, (_, n) => <option key={n} value={n}>{n === 0 ? 'sub 1 an' : n + (n === 1 ? ' an' : ' ani')}</option>)}
                </select><Err id={`c-age${i}-e`} msg={err['age' + i]} />
              </div>
            ))}
          </div>
        )}
        {warn && <div className="warn" id="c-warn" role="alert"><span id="c-warn-t">{warn}</span>{persons > rooms * per && need <= R.nr && <button type="button" id="c-fix" onClick={() => setRm(Math.min(need, R.nr))}>Ajustează</button>}</div>}
        <Field id="c-nm" label="Nume" autoComplete="name" value={nm} err={err.nm} onChange={(e) => { setNm(e.target.value); clr('nm') }} />
        <Field id="c-ph" label="Telefon" type="tel" autoComplete="tel" inputMode="tel" value={ph} err={err.ph} onChange={(e) => { setPh(e.target.value); clr('ph') }} />
        <Field id="c-msg" label="Mesaj (opțional)" value={msg} onChange={(e) => setMsg(e.target.value)} />
        <div className="sum" aria-live="polite">
          <div className="s"><b id="c-sum-a">{nights > 0 ? `${plural(nights, 'noapte', 'nopți')} · ${dShort(inD)} – ${dShort(outD)}` : 'Alegeți datele'}</b><span id="c-sum-b">{sumB.join(' · ')}</span><span id="c-est">{est ? `Estimare orientativă: ${lei(est)}${bf ? ' cu micul dejun' : ''}` : ''}</span></div>
          <div className="acts"><button className="btn fill" type="submit" data-via="wa">Trimite pe WhatsApp</button><button className="more" type="submit" data-via="mail">sau pe e-mail</button></div>
        </div>
        {sent && <p className="sent" id="c-sent">{sent}</p>}
      </div>
    </form>
  )
}

/* ---------- Eveniment ---------- */
function Eveniment({ preset }) {
  const [type, setType] = useState('Nuntă'); const [date, setDate] = useState(''); const [guests, setGuests] = useState('80')
  const [place, setPlace] = useState('în sala restaurantului'); const [menu, setMenu] = useState('tradițional'); const [stay, setStay] = useState(false)
  const [nm, setNm] = useState(''); const [ph, setPh] = useState(''); const [msg, setMsg] = useState('')
  const [err, setErr] = useState({}); const [sent, setSent] = useState(''); const form = useRef(null)
  useEffect(() => { if (preset && preset.ev) setType(preset.ev) }, [preset])
  const clr = (k) => setErr((e) => ({ ...e, [k]: undefined }))
  const n = +guests || 0
  const submit = (e) => {
    e.preventDefault(); const via = e.nativeEvent.submitter && e.nativeEvent.submitter.dataset.via; const E = {}
    if (!date) E.date = 'Alegeți data.'; else if (date < today()) E.date = 'Data a trecut.'
    if (!(n > 0)) E.g = 'Numărul aproximativ de invitați.'
    if (nm.trim().length < 3) E.nm = 'Scrieți-ne numele.'; if (!validPhone(ph)) E.ph = 'Un număr de telefon valid, vă rog.'
    setErr(E); if (Object.keys(E).length) { focusFirstError(form.current); return }
    const text = `Bună ziua! Aș dori o ofertă pentru un eveniment la Drumul Dragostei.\nTip: ${type}\nData: ${dLong(date)}\nInvitați: ${n}\nLoc: ${place}\nMeniu: ${menu}\nCazare pentru invitați: ${stay ? 'da' : 'nu'}\nNume: ${nm.trim()}\nTelefon: ${ph.trim()}` + (msg.trim() ? `\nDetalii: ${msg.trim()}` : '')
    setSent(sendRequest({ via, subject: `Cerere ofertă: ${type}, ${date}`, text, payload: { tip: 'eveniment', eveniment: type, data: date, invitati: n, loc: place, meniu: menu, cazare: stay, nume: nm.trim(), telefon: ph.trim(), mesaj: msg.trim() } }))
  }
  return (
    <form ref={form} className="more-f" id="p-ev" role="tabpanel" aria-labelledby="t-ev" noValidate onSubmit={submit}>
      <Opts className="f w3" legend="Ce organizați" name="etype" value={type} onChange={setType} options={['Nuntă', 'Botez', 'Corporate', 'Aniversare', 'Altceva'].map((x) => [x, x])} />
      <Field id="e-date" label="Data" type="date" min={today()} value={date} err={err.date} onChange={(e) => { setDate(e.target.value); clr('date') }} />
      <Field id="e-g" label="Invitați" type="number" inputMode="numeric" min="1" max="1000" value={guests} err={err.g} onChange={(e) => { setGuests(e.target.value); clr('g') }} />
      <Opts legend="Unde" name="eplace" value={place} onChange={setPlace} options={[['în sala restaurantului', 'Sală'], ['în grădină', 'Grădină'], ['încă nu știm', 'Nu știm']]} />
      <Opts legend="Meniu" name="emenu" value={menu} onChange={setMenu} options={[['tradițional', 'Tradițional'], ['internațional', 'Internațional'], ['de discutat', 'De discutat']]} />
      <label className="chk f w2"><input type="checkbox" id="e-stay" checked={stay} onChange={(e) => setStay(e.target.checked)} />Avem nevoie și de cazare pentru invitați <small>10 camere, până la 26 de locuri</small></label>
      <Field id="e-nm" label="Nume" autoComplete="name" value={nm} err={err.nm} onChange={(e) => { setNm(e.target.value); clr('nm') }} />
      <Field id="e-ph" label="Telefon" type="tel" autoComplete="tel" inputMode="tel" value={ph} err={err.ph} onChange={(e) => { setPh(e.target.value); clr('ph') }} />
      <Field id="e-msg" label="Ce vă doriți" value={msg} onChange={(e) => setMsg(e.target.value)} />
      <div className="sum" aria-live="polite">
        <div className="s"><b id="e-sum-a">{type} · {n} {n === 1 ? 'invitat' : 'de invitați'}</b><span id="e-sum-b">{date ? `${dLong(date)} · ${place} · meniu ${menu}${stay ? ' · cu cazare' : ''}` : 'Alegeți data'}</span></div>
        <div className="acts"><button className="btn fill" type="submit" data-via="wa">Trimite pe WhatsApp</button><button className="more" type="submit" data-via="mail">sau pe e-mail</button></div>
      </div>
      {sent && <p className="sent" id="e-sent">{sent}</p>}
    </form>
  )
}

/* ---------- Restaurant ---------- */
function Restaurant({ preset }) {
  const [mode, setMode] = useState('masa'); const [date, setDate] = useState(''); const [hour, setHour] = useState(''); const [p, setP] = useState(2)
  const [place, setPlace] = useState('în sală'); const [kind, setKind] = useState('reci'); const [pick, setPick] = useState('le ridic de la pensiune')
  const [nm, setNm] = useState(''); const [ph, setPh] = useState(''); const [msg, setMsg] = useState('')
  const [err, setErr] = useState({}); const [sent, setSent] = useState(''); const form = useRef(null)
  useEffect(() => { if (preset && preset.rmode) setMode(preset.rmode) }, [preset])
  const clr = (k) => setErr((e) => ({ ...e, [k]: undefined }))
  const hours = useMemo(() => { const h = []; for (let t = CONFIG.restaurant.deschide * 60; t <= CONFIG.restaurant.inchide * 60 - 60; t += 30) h.push(`${String((t / 60) | 0).padStart(2, '0')}:${t % 60 ? '30' : '00'}`); return h }, [])
  const masa = mode === 'masa'
  const submit = (e) => {
    e.preventDefault(); const via = e.nativeEvent.submitter && e.nativeEvent.submitter.dataset.via; const E = {}
    if (!date) E.date = 'Alegeți data.'; else if (date < today()) E.date = 'Data a trecut.'
    if (!hour) E.hour = 'Alegeți ora.'
    else if (date === today()) { const [hh, mm] = hour.split(':').map(Number); const n = new Date(); if (hh * 60 + mm < n.getHours() * 60 + n.getMinutes() + 30) E.hour = 'Alegeți o oră mai târzie.' }
    if (nm.trim().length < 3) E.nm = 'Scrieți-ne numele.'; if (!validPhone(ph)) E.ph = 'Un număr de telefon valid, vă rog.'
    setErr(E); if (Object.keys(E).length) { focusFirstError(form.current); return }
    const text = (masa ? `Bună ziua! Aș dori să rezerv o masă la restaurantul Drumul Dragostei.\nData: ${dLong(date)}, ora ${hour}\nPersoane: ${p}\nLoc: ${place}` : `Bună ziua! Aș dori să comand platouri de la Drumul Dragostei.\nPlatouri: ${kind}, pentru ${p} persoane\nData: ${dLong(date)}, ora ${hour}\nRidicare: ${pick}`) + `\nNume: ${nm.trim()}\nTelefon: ${ph.trim()}` + (msg.trim() ? `\nDetalii: ${msg.trim()}` : '')
    setSent(sendRequest({ via, subject: masa ? `Rezervare masă ${date} ${hour}` : `Comandă platouri ${date}`, text, payload: { tip: masa ? 'masa' : 'platouri', data: date, ora: hour, persoane: p, loc: masa ? place : undefined, platouri: masa ? undefined : kind, ridicare: masa ? undefined : pick, nume: nm.trim(), telefon: ph.trim(), mesaj: msg.trim() } }))
  }
  return (
    <form ref={form} className="more-f" id="p-rest" role="tabpanel" aria-labelledby="t-rest" noValidate onSubmit={submit}>
      <Opts className="f w3" legend="Ce doriți" name="rmode" value={mode} onChange={setMode} options={[['masa', 'Rezervare masă'], ['platouri', 'Comandă platouri']]} />
      <Field id="r-date" label="Data" type="date" min={today()} value={date} err={err.date} onChange={(e) => { setDate(e.target.value); clr('date') }} />
      <div className="f"><label htmlFor="r-hour">{masa ? 'Ora' : 'Ora de ridicare'}</label>
        <select id="r-hour" value={hour} aria-invalid={err.hour ? 'true' : undefined} onChange={(e) => { setHour(e.target.value); clr('hour') }}><option value="">Alegeți ora</option>{hours.map((h) => <option key={h}>{h}</option>)}</select>
        <Err id="r-hour-e" msg={err.hour} /></div>
      <div className="f" style={{ borderBottom: '1px solid #cfcfcf' }}><Stepper id="r-p" label={masa ? 'Persoane' : 'Pentru câte persoane'} value={p} min={1} max={500} onChange={setP} /></div>
      {masa
        ? <Opts className="f r-masa" legend="Unde" name="rplace" value={place} onChange={setPlace} options={[['în sală', 'Sală'], ['pe terasă', 'Terasă']]} />
        : <>
          <Opts className="f r-plat" legend="Platouri" name="rkind" value={kind} onChange={setKind} options={[['reci', 'Reci'], ['dulciuri', 'Dulciuri'], ['reci și dulciuri', 'Ambele']]} />
          <Opts className="f r-plat" legend="Ridicare" name="rpick" value={pick} onChange={setPick} options={[['le ridic de la pensiune', 'De la pensiune'], ['aș dori să discutăm livrarea', 'Livrare']]} />
        </>}
      <Field id="r-nm" label="Nume" autoComplete="name" value={nm} err={err.nm} onChange={(e) => { setNm(e.target.value); clr('nm') }} />
      <Field id="r-ph" label="Telefon" type="tel" autoComplete="tel" inputMode="tel" value={ph} err={err.ph} onChange={(e) => { setPh(e.target.value); clr('ph') }} />
      <Field id="r-msg" label="Detalii" wide value={msg} onChange={(e) => setMsg(e.target.value)} />
      <div className="sum" aria-live="polite">
        <div className="s"><b id="r-sum-a">{masa ? `Masă pentru ${p} ${p === 1 ? 'persoană' : 'persoane'}` : `Platouri ${kind} pentru ${p} ${p === 1 ? 'persoană' : 'persoane'}`}</b><span id="r-sum-b">{date && hour ? `${dLong(date)}, ora ${hour}` : 'Alegeți data și ora'}</span></div>
        <div className="acts"><button className="btn fill" type="submit" data-via="wa">Trimite pe WhatsApp</button><button className="more" type="submit" data-via="mail">sau pe e-mail</button></div>
      </div>
      {sent && <p className="sent" id="r-sent">{sent}</p>}
    </form>
  )
}

export default function Book({ req, onClose, onAfterClose }) {
  const open = !!req
  const [tab, setTab] = useState('caz')
  const panel = useRef(null)
  useEffect(() => { if (req) setTab(req.tab) }, [req])
  useEffect(() => {
    if (!open || reduce || !panel.current) return
    gsap.fromTo(panel.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' })
  }, [tab, open])
  const tabs = useRef([])
  const onKey = (k) => (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return
    e.preventDefault(); const n = (k + d + 3) % 3; tabs.current[n].focus(); setTab(TABS[n][0])
  }
  return (
    <Modal open={open} onClose={onClose} onAfterClose={onAfterClose} className="full book" id="book" aria-labelledby="bk-h">
      <OverlayTopProxy onClose={onClose} />
      <div className="body">
        <h2 id="bk-h">Doriți să faceți o rezervare pe Drumul Dragostei?</h2>
        <div className="tabs" role="tablist" aria-label="Tip de cerere">
          {TABS.map(([k, t], i) => (
            <button key={k} ref={(el) => (tabs.current[i] = el)} type="button" role="tab" id={'t-' + k} aria-selected={tab === k} aria-controls={'p-' + k} tabIndex={tab === k ? 0 : -1} onClick={() => setTab(k)} onKeyDown={onKey(i)}>{t}</button>
          ))}
        </div>
        {/* forms stay mounted so typed data survives switching tabs */}
        <div ref={panel} style={{ width: '100%', display: 'grid', justifyItems: 'center' }}>
          <div hidden={tab !== 'caz'} style={{ width: '100%', display: tab === 'caz' ? 'grid' : 'none', justifyItems: 'center' }}><Cazare preset={req && req.tab === 'caz' ? req : null} /></div>
          <div hidden={tab !== 'ev'} style={{ width: '100%', display: tab === 'ev' ? 'grid' : 'none', justifyItems: 'center' }}><Eveniment preset={req && req.tab === 'ev' ? req : null} /></div>
          <div hidden={tab !== 'rest'} style={{ width: '100%', display: tab === 'rest' ? 'grid' : 'none', justifyItems: 'center' }}><Restaurant preset={req && req.tab === 'rest' ? req : null} /></div>
        </div>
        <div className="binfo"><span>Check-in <b>14:00 – 18:00</b></span><span>Check-out <b>până la 11:00</b></span><span>Plata <b>card sau numerar</b></span><span>Telefon <b><a href={'tel:+' + CONFIG.telefon}>{CONFIG.telefonAfisat}</a></b></span></div>
      </div>
    </Modal>
  )
}
