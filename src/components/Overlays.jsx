import { CONFIG } from '../config'
import { lei } from '../lib/booking'
import { Crest, Img, Modal } from './ui'

const Top = ({ onClose }) => (
  <div className="top">
    <button className="x" type="button" data-close="" onClick={onClose}>Închide</button>
    <span className="crest-l" aria-hidden="true"><Crest /><span>Drumul Dragostei<small>Vințu de Jos · Alba</small></span></span>
    <span />
  </div>
)

const LEFT = [['#continut', 'Povestea casei'], ['#camere', 'Anotimpurile'], ['#restaurant', 'Gustul casei'], ['#evenimente', 'Nunți și botezuri'], ['#piscina', 'Piscina'], ['#recenzii', 'Oaspeții noștri']]
const RIGHT = [['#cazare', 'Camere'], ['#restaurant', 'Restaurant'], ['#evenimente', 'Evenimente'], ['#contact', 'Contact']]

export function About({ open, onClose, onAfterClose, onGo, onBook }) {
  const go = (h) => (e) => { e.preventDefault(); onGo(h) }
  return (
    <Modal open={open} onClose={onClose} onAfterClose={onAfterClose} className="full about" id="about" aria-label="Despre noi">
      <Top onClose={onClose} />
      <div className="cols">
        <div className="col"><h2><em>Drumul</em><br />Dragostei</h2>
          {LEFT.map(([h, t], i) => <a key={t} href={h} style={{ '--i': i }} onClick={go(h)}>{t}</a>)}
        </div>
        <div className="vl" aria-hidden="true" />
        <div className="col"><h2>În casa<br /><em>noastră</em></h2>
          {RIGHT.map(([h, t], i) => <a key={t} href={h} style={{ '--i': i }} onClick={go(h)}>{t}</a>)}
          <a href="#rezervare" data-book="caz" style={{ '--i': 4 }} onClick={(e) => { e.preventDefault(); onBook('caz') }}>Rezervare</a>
          <a href={CONFIG.harta} target="_blank" rel="noopener noreferrer" style={{ '--i': 5 }}>Cum ajungeți</a>
        </div>
      </div>
      <div className="foot"><p className="sig">Pe Drumul Dragostei</p><span>{CONFIG.telefonAfisat} · {CONFIG.email}</span></div>
    </Modal>
  )
}

export function RoomDrawer({ room, onClose, onBookRoom, onAfterClose }) {
  const r = room ? CONFIG.camere[room] : null
  return (
    <Modal open={!!room} onClose={onClose} onAfterClose={onAfterClose} delay={420} className="drawer" id="drawer" aria-labelledby="dr-h">
      {r && (
        <div className="inner">
          <div className="dt"><p className="cap">Camera</p><button className="x" type="button" id="drX" onClick={onClose}>Închide</button></div>
          <h2 className="t-h2" id="dr-h">{room}</h2>
          <div className="gal" id="drGal" tabIndex={0} aria-label="Fotografii, derulați lateral">
            {r.img.map((s, i) => <Img key={s} name={s} eager sizes="(max-width:640px) 86vw, 540px" alt={`Camera ${room}, fotografia ${i + 1}`} />)}
          </div>
          <p className="t-letter">{r.desc}</p>
          <dl className="dfacts">
            <dt>Capacitate</dt><dd>{r.pers} persoane{r.extra ? ', plus pat suplimentar la cerere' : ''}</dd>
            <dt>Paturi</dt><dd>{r.paturi}</dd>
            <dt>Camere</dt><dd>{r.nr} de acest tip</dd>
            <dt>Dotări</dt><dd>Intrare separată, terasă privată, baie cu duș, frigider, TV, prosoape, Wi-Fi</dd>
            <dt>Mic dejun</dt><dd>{CONFIG.micDejun} lei de persoană, opțional</dd>
          </dl>
          <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn fill" type="button" id="drBook" onClick={onBookRoom}>Cere această cameră</button>
            <span className="hint">de la {lei(r.pret)} / noapte</span>
          </div>
          <p className="hint">Prețul final pentru perioada dumneavoastră îl confirmăm la rezervare.</p>
        </div>
      )}
    </Modal>
  )
}

export function Doc({ id, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} delay={0} className="doc" id={id} aria-labelledby={id + '-h'} onClick={(e) => { if (e.target.tagName === 'DIALOG') onClose() }}>
      <div className="inner">
        {id === 'privacy' ? (
          <>
            <h2 id="privacy-h">Confidențialitate</h2>
            <p>Operatorul datelor este Pensiunea Drumul Dragostei, Strada Prieteniei nr. 2, Vințu de Jos, jud. Alba, {CONFIG.email}.</p>
            <h3>Ce date colectăm</h3><p>Formularele nu stochează nimic pe server: pregătesc un mesaj pe care îl trimiteți pe WhatsApp sau e-mail. Datele trimise astfel le folosim doar pentru a vă răspunde.</p>
            <h3>Temei și durată</h3><p>Răspunsul la cerere și încheierea rezervării (art. 6 alin. 1 lit. b GDPR) și obligațiile legale privind evidența turiștilor (lit. c). Cererile fără rezervare se șterg în cel mult 6 luni.</p>
            <h3>Drepturile dumneavoastră</h3><p>Acces, rectificare, ștergere, restricționare, portabilitate, opoziție și plângere la ANSPDCP (dataprotection.ro).</p>
          </>
        ) : (
          <>
            <h2 id="cookies-h">Cookies</h2>
            <p>Site-ul nu folosește cookie-uri de analiză, de publicitate sau de la terți. Browserul păstrează doar, pe durata vizitei, faptul că ați văzut animația de început.</p>
          </>
        )}
        <div><button className="btn" type="button" onClick={onClose}>Închide</button></div>
      </div>
    </Modal>
  )
}

export { Top as OverlayTop }
