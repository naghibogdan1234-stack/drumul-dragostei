# Pensiunea Drumul Dragostei — site

Site de prezentare pentru Pensiunea Drumul Dragostei (Vințu de Jos, Alba). React 18 + Vite, animații cu GSAP și Lenis.

## Pornire

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # rezultat în dist/
```

La fiecare push pe `main`, GitHub Actions construiește site-ul și îl publică pe GitHub Pages (`.github/workflows/deploy.yml`).

## Structură

```
src/
  config.js              prețuri, camere, program, meniu, recenzii, telefon — tot ce se schimbă des
  App.jsx                pagina: ordinea secțiunilor, ferestrele (despre, rezervare, cameră), animațiile la scroll
  components/
    Top.jsx              animația de început, bara de sus, poza mare cu slideshow
    Sections.jsx         secțiunile paginii și subsolul
    Overlays.jsx         „Despre noi”, panoul camerei, Confidențialitate/Cookies
    Book.jsx             fereastra de rezervare: cazare, eveniment, restaurant/platouri (validare inclusă)
    ui.jsx               Img (srcset), Modal (<dialog> cu animație), SplitLines, sigla
  lib/
    booking.js           sendRequest() — AICI se leagă backend-ul
    motion.js            GSAP, ScrollTrigger, Lenis, goTo()
    images.js            lățimile disponibile pentru fiecare poză (srcset)
  styles.css             tot CSS-ul
  fonts/                 Zodiak, Switzer, Italianno (woff2, cu diacritice)
public/img/              fotografiile, în 800 / 1400 / 2000 px (WebP)
```

## Legarea backend-ului

Toate cele trei formulare apelează `sendRequest({ via, subject, text, payload })` din `src/lib/booking.js`.
Acum funcția deschide WhatsApp sau e-mail cu mesajul completat. `payload` are deja datele structurate:

```js
// cazare
{ tip: 'cazare', sosire: '2026-12-20', plecare: '2026-12-22', camera: 'Twin', camere: 1,
  adulti: 2, copii: 1, varste: ['5'], patSuplimentar: false, micDejun: true, nume, telefon, mesaj }
// eveniment
{ tip: 'eveniment', eveniment: 'Nuntă', data, invitati: 80, loc, meniu, cazare: true, nume, telefon, mesaj }
// restaurant
{ tip: 'masa' | 'platouri', data, ora: '12:30', persoane: 4, loc?, platouri?, ridicare?, nume, telefon, mesaj }
```

Pentru un API, înlocuiți corpul funcției cu un `fetch('/api/rezervari', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })` și întoarceți mesajul de confirmare afișat sub formular.
Disponibilitatea reală a camerelor se poate citi în `Book.jsx` (componenta `Cazare`), unde se calculează deja nopțile, camerele necesare și estimarea de preț.

## De confirmat cu pensiunea

Prețurile (210 / 260 lei, mic dejun 35 lei), tarifele piscinei și felurile din meniu sunt în `src/config.js`.

## Credite foto

Fotografiile pensiunii: Pensiunea Drumul Dragostei. Cetatea Alba Carolina: DimiTalen, CC0, Wikimedia Commons.
