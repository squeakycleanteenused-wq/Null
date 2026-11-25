// Puhas loogika: ei puutu brauserit, seega lihtne testida.

export type Role = 'top' | 'bottom' | 'layer' | 'shoes' | 'other'

export type Item = {
  id: string
  name: string
  role: Role
  color: string
  brand: string
  size: string
  clean: number // puhtad tükid
  dirty: number // pesu ootavad tükid
  target: number // mitu tükki tahad alati omada
}

export type Uniform = { id: string; name: string; itemIds: string[] }

export type LogEntry = { date: string; uniformId: string }

export type ShoppingNote = { id: string; text: string; done: boolean }

export type State = {
  items: Item[]
  uniforms: Uniform[]
  activeUniformId: string | null
  log: LogEntry[]
  notes: ShoppingNote[]
  started: boolean
  version: 1
}

export const ROLE_LABELS: Record<Role, string> = {
  top: 'Pealmine osa',
  bottom: 'Alumine osa',
  layer: 'Kiht (pusa, jope)',
  shoes: 'Jalanõud',
  other: 'Muu',
}

export const emptyState = (): State => ({
  items: [],
  uniforms: [],
  activeUniformId: null,
  log: [],
  notes: [],
  started: false,
  version: 1,
})

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)

export const todayStr = (d = new Date()) => {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export const total = (i: Item) => i.clean + i.dirty

export function sampleState(): State {
  const tee: Item = { id: uid(), name: 'Valge T-särk', role: 'top', color: 'valge', brand: '', size: '', clean: 5, dirty: 0, target: 5 }
  const pants: Item = { id: uid(), name: 'Mustad püksid', role: 'bottom', color: 'must', brand: '', size: '', clean: 3, dirty: 0, target: 3 }
  const sweater: Item = { id: uid(), name: 'Must pusa', role: 'layer', color: 'must', brand: '', size: '', clean: 2, dirty: 0, target: 2 }
  const base: Uniform = { id: uid(), name: 'Tavaline päev', itemIds: [tee.id, pants.id] }
  const cold: Uniform = { id: uid(), name: 'Külm päev', itemIds: [tee.id, pants.id, sweater.id] }
  return { ...emptyState(), items: [tee, pants, sweater], uniforms: [base, cold], activeUniformId: base.id, started: true }
}

export const wornToday = (s: State, date = todayStr()) => s.log.find((l) => l.date === date)

export function uniformItems(s: State, u: Uniform): Item[] {
  return u.itemIds.map((id) => s.items.find((i) => i.id === id)).filter((i): i is Item => !!i)
}

/** Millised vormi osad on praegu puhtalt otsas. */
export function missingClean(s: State, u: Uniform): Item[] {
  return uniformItems(s, u).filter((i) => i.clean < 1)
}

/** Märgi täna selle vormi kandmine: iga osa läheb puhtast pesu ootele. */
export function wear(s: State, uniformId: string, date = todayStr()): State {
  const u = s.uniforms.find((x) => x.id === uniformId)
  if (!u || wornToday(s, date) || missingClean(s, u).length > 0) return s
  const ids = new Set(u.itemIds)
  return {
    ...s,
    items: s.items.map((i) => (ids.has(i.id) ? { ...i, clean: i.clean - 1, dirty: i.dirty + 1 } : i)),
    log: [...s.log, { date, uniformId }],
  }
}

/** Võta tänane märge tagasi. */
export function undoWear(s: State, date = todayStr()): State {
  const entry = wornToday(s, date)
  if (!entry) return s
  const u = s.uniforms.find((x) => x.id === entry.uniformId)
  const ids = new Set(u?.itemIds ?? [])
  return {
    ...s,
    items: s.items.map((i) => (ids.has(i.id) && i.dirty > 0 ? { ...i, clean: i.clean + 1, dirty: i.dirty - 1 } : i)),
    log: s.log.filter((l) => l !== entry),
  }
}

/** Pesu tehtud: kõik määrdunud (või ühe asja määrdunud) on jälle puhtad. */
export function wash(s: State, itemId?: string): State {
  return {
    ...s,
    items: s.items.map((i) => (!itemId || i.id === itemId ? { ...i, clean: i.clean + i.dirty, dirty: 0 } : i)),
  }
}

/** Üks tükk on kulunud ja läheb minema. */
export function retire(s: State, itemId: string): State {
  return {
    ...s,
    items: s.items.map((i) => {
      if (i.id !== itemId || total(i) < 1) return i
      return i.dirty > 0 ? { ...i, dirty: i.dirty - 1 } : { ...i, clean: i.clean - 1 }
    }),
  }
}

export type BuyLine = { item: Item; missing: number }

/** Ostunimekiri: asjad, mida on vähem kui sihtkogus. */
export function buyList(s: State): BuyLine[] {
  return s.items
    .filter((i) => total(i) < i.target)
    .map((item) => ({ item, missing: item.target - total(item) }))
}

/** Mitu päeva järjest on vorm "otsustamata" kantud (lõpeb täna või eile). */
export function streak(s: State, now = new Date()): number {
  const days = new Set(s.log.map((l) => l.date))
  const d = new Date(now)
  if (!days.has(todayStr(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (days.has(todayStr(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function removeItem(s: State, itemId: string): State {
  return {
    ...s,
    items: s.items.filter((i) => i.id !== itemId),
    uniforms: s.uniforms.map((u) => ({ ...u, itemIds: u.itemIds.filter((id) => id !== itemId) })),
  }
}

export function removeUniform(s: State, uniformId: string): State {
  const uniforms = s.uniforms.filter((u) => u.id !== uniformId)
  return {
    ...s,
    uniforms,
    activeUniformId: s.activeUniformId === uniformId ? (uniforms[0]?.id ?? null) : s.activeUniformId,
  }
}

/** Impordi JSON-ist; tagastab null kui fail ei sobi. */
export function parseState(raw: string): State | null {
  try {
    const p = JSON.parse(raw)
    if (!p || p.version !== 1 || !Array.isArray(p.items) || !Array.isArray(p.uniforms)) return null
    return { ...emptyState(), ...p }
  } catch {
    return null
  }
}
