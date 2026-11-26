import { CONFIG } from '../config'

/* Trimiterea cererilor. Acum deschide WhatsApp sau e-mail cu mesajul completat.
   Pentru backend: înlocuiți corpul funcției sendRequest cu un fetch('/api/...', { method:'POST', body: JSON.stringify(payload) })
   — payload conține deja toate câmpurile structurate. */
export function sendRequest({ via, subject, text, payload }) {
  void payload
  const url = via === 'mail'
    ? `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
    : `https://wa.me/${CONFIG.telefon}?text=${encodeURIComponent(text)}`
  const a = document.createElement('a')
  a.href = url; a.target = '_blank'; a.rel = 'noopener'
  document.body.append(a); a.click(); a.remove()
  return via === 'mail'
    ? `Se deschide aplicația de e-mail cu mesajul completat. Dacă nu se deschide: ${CONFIG.email}.`
    : `Se deschide WhatsApp cu mesajul completat; apăsați „Trimite” acolo. Dacă nu merge, sunați la ${CONFIG.telefonAfisat}.`
}

export const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10)
export const today = () => iso(new Date())
export const dLong = (v) => new Date(v + 'T12:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
export const dShort = (v) => new Date(v + 'T12:00').toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })
export const lei = (n) => n.toLocaleString('ro-RO') + ' lei'
export const nightsBetween = (a, b) => (!a || !b ? 0 : Math.round((new Date(b) - new Date(a)) / 864e5))
export const validPhone = (p) => p.replace(/\D/g, '').length >= 9
