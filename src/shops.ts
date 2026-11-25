// Poodide otsingulingid. Kõik poe-spetsiifiline on siin ühes failis,
// et aadressi muutumisel saaks parandada ühes kohas.
import type { Item, Role } from './logic'

export type Gender = 'naised' | 'mehed'

export type Shop = { id: string; name: string; search: (q: string) => string }

export const SHOPS: Shop[] = [
  { id: 'zalando', name: 'Zalando', search: (q) => `https://www.zalando.ee/katalog/?q=${encodeURIComponent(q)}` },
  { id: 'aboutyou', name: 'About You', search: (q) => `https://www.aboutyou.ee/suche?term=${encodeURIComponent(q)}` },
]

export type Preset = { id: string; title: string; role: Role; color: string; query: string; note: string; noWash?: boolean }

/** Kapslisse sobivad põhitükid: neutraalne palett (must, valge, hall, beež, navy, teksasinine), ilma trükita. */
export const PRESETS: Preset[] = [
  { id: 'tee-white', title: 'Valge T-särk', role: 'top', color: 'valge', query: 'valge puuvillane t-särk', note: 'Põhitükk, sobib kõigega' },
  { id: 'tee-black', title: 'Must T-särk', role: 'top', color: 'must', query: 'must puuvillane t-särk', note: 'Ei näita plekke' },
  { id: 'tee-grey', title: 'Hall T-särk', role: 'top', color: 'hall', query: 'hall puuvillane t-särk', note: 'Pehme alternatiiv mustale' },
  { id: 'shirt-white', title: 'Valge triiksärk', role: 'top', color: 'valge', query: 'valge triiksärk', note: 'Kontoripäev, smart casual' },
  { id: 'shirt-blue', title: 'Helesinine triiksärk', role: 'top', color: 'helesinine', query: 'helesinine triiksärk', note: 'Sobib teksade ja pükstega' },
  { id: 'polo-navy', title: 'Navy polosärk', role: 'top', color: 'navy', query: 'tumesinine polosärk', note: 'Vahepealne T-särgi ja särgi vahel' },
  { id: 'jeans-blue', title: 'Sinised teksad', role: 'bottom', color: 'sinine', query: 'sinised sirged teksad', note: 'Sirge lõige, igapäevane' },
  { id: 'jeans-black', title: 'Mustad teksad', role: 'bottom', color: 'must', query: 'mustad teksad', note: 'Vabam, aga korrektne' },
  { id: 'pants-black', title: 'Mustad püksid', role: 'bottom', color: 'must', query: 'mustad püksid', note: 'Töö ja õhtu' },
  { id: 'chino-beige', title: 'Beežid chinopüksid', role: 'bottom', color: 'beež', query: 'beežid chino püksid', note: 'Soe maatoon' },
  { id: 'sweater-brown', title: 'Pruun džemper', role: 'layer', color: 'pruun', query: 'pruun džemper', note: 'Külma päeva kiht' },
  { id: 'sweater-black', title: 'Must pusa', role: 'layer', color: 'must', query: 'must dressipluus', note: 'Külma päeva kiht' },
  { id: 'blazer-navy', title: 'Navy blazer', role: 'layer', color: 'navy', query: 'tumesinine blazer', note: 'Tõstab iga komplekti', noWash: true },
  { id: 'trench-beige', title: 'Beež trenchcoat', role: 'layer', color: 'beež', query: 'beež trenchcoat', note: 'Kevad ja sügis', noWash: true },
  { id: 'jacket-black', title: 'Must jope', role: 'layer', color: 'must', query: 'must jope', note: 'Ilmakaitse', noWash: true },
  { id: 'shoes-white', title: 'Valged tossud', role: 'shoes', color: 'valge', query: 'valged nahktossud', note: 'Üks paar kõigeks', noWash: true },
  { id: 'shoes-loafers', title: 'Pruunid loafersid', role: 'shoes', color: 'pruun', query: 'pruunid loafersid', note: 'Smart casual', noWash: true },
  { id: 'socks-black', title: 'Mustad sokid', role: 'other', color: 'must', query: 'mustad sokid', note: 'Osta komplektis, sobitamist pole' },
]

export type Kit = { id: string; title: string; blurb: string; presetIds: string[]; uniforms: { name: string; presetIds: string[] }[] }

/** Valmis stiilikomplektid mood boardi järgi. Üks klikk lisab tükid ja vormid. */
export const KITS: Kit[] = [
  {
    id: 'minimal-10',
    title: 'Minimalist (10 tükki)',
    blurb: 'Must, valge, sinine, beež. Kõik sobib kõigega.',
    presetIds: ['tee-white', 'tee-black', 'shirt-blue', 'jeans-blue', 'pants-black', 'sweater-brown', 'trench-beige', 'shoes-white', 'shoes-loafers', 'socks-black'],
    uniforms: [
      { name: 'Tavaline päev', presetIds: ['tee-white', 'jeans-blue', 'shoes-white', 'socks-black'] },
      { name: 'Tööpäev', presetIds: ['shirt-blue', 'pants-black', 'shoes-loafers', 'socks-black'] },
      { name: 'Külm päev', presetIds: ['tee-black', 'jeans-blue', 'sweater-brown', 'trench-beige', 'shoes-white', 'socks-black'] },
    ],
  },
  {
    id: 'smart-casual-14',
    title: 'Smart casual (14 tükki)',
    blurb: 'Blazer, triiksärgid ja chino. Tööle ja õhtusöögile.',
    presetIds: ['tee-white', 'shirt-white', 'shirt-blue', 'polo-navy', 'jeans-blue', 'pants-black', 'chino-beige', 'sweater-brown', 'blazer-navy', 'trench-beige', 'shoes-white', 'shoes-loafers', 'socks-black'],
    uniforms: [
      { name: 'Tavaline päev', presetIds: ['tee-white', 'jeans-blue', 'shoes-white', 'socks-black'] },
      { name: 'Tööpäev', presetIds: ['shirt-white', 'pants-black', 'blazer-navy', 'shoes-loafers', 'socks-black'] },
      { name: 'Vaba päev', presetIds: ['polo-navy', 'chino-beige', 'shoes-loafers', 'socks-black'] },
    ],
  },
]

const genderWord: Record<Gender, string> = { naised: 'naiste', mehed: 'meeste' }

export const presetQuery = (p: Preset, g: Gender) => `${genderWord[g]} ${p.query}`

/** Otsing sinu enda tüki järgi: mark, nimi, värv. Suurus jääb poe filtrisse. */
export const itemQuery = (i: Pick<Item, 'name' | 'brand' | 'color'>, g: Gender) =>
  [genderWord[g], i.brand, i.name].filter(Boolean).join(' ')
