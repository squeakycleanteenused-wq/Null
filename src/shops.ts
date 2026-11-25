// Poodide otsingulingid. Kõik poe-spetsiifiline on siin ühes failis,
// et aadressi muutumisel saaks parandada ühes kohas.
import type { Item, Role } from './logic'

export type Gender = 'naised' | 'mehed'

export type Shop = { id: string; name: string; search: (q: string) => string }

export const SHOPS: Shop[] = [
  { id: 'zalando', name: 'Zalando', search: (q) => `https://www.zalando.ee/katalog/?q=${encodeURIComponent(q)}` },
  { id: 'aboutyou', name: 'About You', search: (q) => `https://www.aboutyou.ee/suche?term=${encodeURIComponent(q)}` },
]

export type Preset = { id: string; title: string; role: Role; color: string; query: string; note: string }

/** Kapslisse sobivad lihtsad põhitükid: üks värv, ilma trükita. */
export const PRESETS: Preset[] = [
  { id: 'tee-white', title: 'Valge T-särk', role: 'top', color: 'valge', query: 'valge puuvillane t-särk', note: 'Põhitükk, kanna iga päev' },
  { id: 'tee-black', title: 'Must T-särk', role: 'top', color: 'must', query: 'must puuvillane t-särk', note: 'Kui valge ei sobi' },
  { id: 'tee-grey', title: 'Hall T-särk', role: 'top', color: 'hall', query: 'hall puuvillane t-särk', note: 'Ei näita plekke' },
  { id: 'pants-black', title: 'Mustad püksid', role: 'bottom', color: 'must', query: 'mustad püksid', note: 'Sobivad kõigega' },
  { id: 'jeans-black', title: 'Mustad teksad', role: 'bottom', color: 'must', query: 'mustad teksad', note: 'Vabam variant' },
  { id: 'sweater-black', title: 'Must pusa', role: 'layer', color: 'must', query: 'must dressipluus', note: 'Külma päeva kiht' },
  { id: 'sweater-grey', title: 'Hall pusa', role: 'layer', color: 'hall', query: 'hall dressipluus', note: 'Külma päeva kiht' },
  { id: 'jacket-black', title: 'Must jope', role: 'layer', color: 'must', query: 'must jope', note: 'Ilmakaitse' },
  { id: 'shoes-white', title: 'Valged tossud', role: 'shoes', color: 'valge', query: 'valged nahktossud', note: 'Üks paar kõigeks' },
  { id: 'socks-black', title: 'Mustad sokid', role: 'other', color: 'must', query: 'mustad sokid', note: 'Osta komplektis, sobitamist pole' },
]

const genderWord: Record<Gender, string> = { naised: 'naiste', mehed: 'meeste' }

export const presetQuery = (p: Preset, g: Gender) => `${genderWord[g]} ${p.query}`

/** Otsing sinu enda tüki järgi: mark, nimi, värv. Suurus jääb poe filtrisse. */
export const itemQuery = (i: Pick<Item, 'name' | 'brand' | 'color'>, g: Gender) =>
  [genderWord[g], i.brand, i.name].filter(Boolean).join(' ')
