# Kapsli garderoob

Üks vorm, null hommikust otsustamist. Äpp inimestele, kes kannavad kapsel- ehk uniformgarderoobi, kus kõik riided on ühesugused.

Töötab telefonis ja veebis (PWA, installitav avaekraanile) ja ka ilma netita. Andmed on ainult sinu seadmes, kontot pole vaja.

## Mida äpp teeb

- **Täna:** näitab, mida selga panna. Üks nupp: "Panin selga". Streak loeb päevi ilma riiete üle mõtlemata.
- **Vormid:** nt "Tavaline päev" ja "Külm päev". Vormi saab hommikul ühe puudutusega vahetada.
- **Pesu:** kantud tükid lähevad pesukorvi, "Pesin kõik" toob need tagasi. Kui puhast pole, äpp ütleb seda.
- **Nimekiri:** kulunud tükist alates koostab ostunimekirja, koos margi ja suurusega, ja "Osta" nupud viivad otse poodi.
- **Pood:** kapslisse sobivad põhitükid (valge T-särk, mustad püksid jne) ja otsingulingid Zalandosse ja About Yousse. Tellimine käib poes. Poodide aadressid on failis `src/shops.ts`.
- **Varukoopia:** eksport/import JSON-ina.

## Käivitamine

```bash
npm install
npm run dev      # arendus
npm test         # loogika testid
npm run build    # toodang kausta dist/
```

## Paigaldus

Ehita (`npm run build`) ja pane `dist/` mis tahes staatilisele hostile (Vercel, Netlify, GitHub Pages). Telefonis: ava link, siis "Lisa avaekraanile".

## Ehitus

Vite + React + TypeScript. Loogika on puhtas failis `src/logic.ts` (testid `tests/`), andmed `localStorage`is.

## Edasi

- Sünkroonimine seadmete vahel (nt Supabase, valikuline sisselogimine)
- Inglise keel
- Pesutsükkel (mitu kandmist enne pesu)
- Fotod riidetükkidest
