/* ===== DATE DE ACTUALIZAT DE PENSIUNE =====
   Tot conținutul care se schimbă des stă aici (prețuri, program, meniu, recenzii).
   Backend: funcțiile din src/lib/booking.js sunt locul unde se leagă API-ul. */
export const CONFIG = {
  camere: {
    'Matrimonială': { nr: 5, pers: 2, extra: 1, pret: 210, paturi: '1 pat dublu mare', desc: 'Un pat dublu mare, mobilier din lemn masiv și un perete roșu care dă căldură camerei. Ușa se deschide spre terasa privată și grădină.', img: ['room-red', 'room-red2', 'terrace2'] },
    'Twin': { nr: 3, pers: 2, extra: 1, pret: 210, paturi: '2 paturi de o persoană', desc: 'Două paturi separate, potrivită pentru prieteni, colegi sau părinte cu copil mare, cu aceeași terasă privată spre curte.', img: ['room-twin', 'room-twin2', 'bath'] },
    'Triplă': { nr: 2, pers: 3, extra: 0, pret: 260, paturi: '3 paturi', desc: 'Loc pentru trei, cu aceeași liniște: terasă privată, baie proprie și ușa direct spre curte.', img: ['room-gold', 'room-gold2', 'porch'] },
  },
  micDejun: 35,
  copiiFaraLoc: 3, // copiii sub această vârstă nu ocupă loc
  restaurant: { program: '10:00 – 22:00', deschide: 10, inchide: 22 },
  piscina: { status: 'inchisa' }, // 'deschisa' | 'inchisa' | 'curand'
  meniu: [
    { n: 'Platou rece al casei', d: 'Mezeluri, brânzeturi, legume și tartine; și la comandă.' },
    { n: 'Șuberek', d: 'Plăcintă prăjită cu carne, cu sos dulce-picant.' },
    { n: 'Mămăligă cu brânză și smântână', d: 'În castron de lut, cu jambon crud.' },
    { n: 'Coaste de porc la grătar', d: 'Glazurate, cu piure de morcov și murături.' },
    { n: 'Ceafă de porc la grătar', d: 'Cu cartofi wedges și salată de varză.' },
    { n: 'Desertul casei', d: 'Cu smântână, sos de ciocolată și fructe.' },
  ],
  recenzii: [
    ['„Locația liniștită și super frumoasă, camera foarte curată, iar mâncarea a fost delicioasă.”', 'Mihaela'],
    ['„Porții generoase, foarte bine gătite. Terasele din fața camerelor sunt perfecte pentru relaxare.”', 'Oana'],
    ['„Mic dejun bogat, variat, locație frumoasă și liniștită, gazdă amabilă.”', 'Monica'],
    ['„Liniște, mult spațiu verde, camere curate.”', 'Virgil'],
  ],
  telefon: '40733015709',
  telefonAfisat: '0733 015 709',
  email: 'contact@drumuldragostei.ro',
  harta: 'https://goo.gl/maps/L79jBwssk6gyWst26',
  booking: 'https://www.booking.com/hotel/ro/drumul-dragostei.ro.html#tab-reviews',
}
