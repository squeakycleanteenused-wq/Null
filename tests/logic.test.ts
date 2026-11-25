import { describe, expect, it } from 'vitest'
import { buyList, retire, sampleState, streak, undoWear, wash, wear, wornToday } from '../src/logic'

const day = '2026-03-10'

describe('kapsli loogika', () => {
  it('kandmine viib osad pesu ootele ja logib päeva', () => {
    const s = sampleState()
    const u = s.uniforms[0]
    const next = wear(s, u.id, day)
    expect(next.items[0].clean).toBe(4)
    expect(next.items[0].dirty).toBe(1)
    expect(wornToday(next, day)).toBeTruthy()
  })

  it('sama päeva teist korda ei saa märkida', () => {
    const s = sampleState()
    const once = wear(s, s.uniforms[0].id, day)
    expect(wear(once, s.uniforms[0].id, day)).toBe(once)
  })

  it('puhta puudumisel kandmine ei toimi', () => {
    const s = sampleState()
    s.items[0].clean = 0
    expect(wear(s, s.uniforms[0].id, day)).toBe(s)
  })

  it('tagasivõtmine taastab seisu', () => {
    const s = sampleState()
    const back = undoWear(wear(s, s.uniforms[0].id, day), day)
    expect(back.items).toEqual(s.items)
    expect(back.log).toHaveLength(0)
  })

  it('pesu teeb kõik puhtaks', () => {
    const s = sampleState()
    const washed = wash(wear(s, s.uniforms[0].id, day))
    expect(washed.items.every((i) => i.dirty === 0)).toBe(true)
    expect(washed.items[0].clean).toBe(5)
  })

  it('kulunud tükk lisab ostunimekirja', () => {
    const s = sampleState()
    expect(buyList(s)).toHaveLength(0)
    const after = retire(s, s.items[0].id)
    expect(buyList(after)).toEqual([{ item: after.items[0], missing: 1 }])
  })

  it('streak loeb järjestikuseid päevi', () => {
    const s = sampleState()
    s.log = [
      { date: '2026-03-08', uniformId: 'a' },
      { date: '2026-03-09', uniformId: 'a' },
      { date: '2026-03-10', uniformId: 'a' },
    ]
    expect(streak(s, new Date(2026, 2, 10))).toBe(3)
    expect(streak(s, new Date(2026, 2, 11))).toBe(3)
    expect(streak(s, new Date(2026, 2, 13))).toBe(0)
  })
})

import { SHOPS, itemQuery } from '../src/shops'

describe('poe lingid', () => {
  it('kodeerib otsingu õigesti ja viib Eesti poodidesse', () => {
    const q = itemQuery({ name: 'Valge T-särk', brand: 'Gap', color: 'valge' }, 'mehed')
    expect(q).toBe('meeste Gap Valge T-särk')
    for (const s of SHOPS) {
      const url = new URL(s.search(q))
      expect(url.hostname).toMatch(/\.ee$/)
      expect(decodeURIComponent(url.search)).toContain('T-särk')
    }
  })
})

import { addKit } from '../src/pages/Shop'
import { KITS, PRESETS } from '../src/shops'
import { emptyState } from '../src/logic'

describe('komplektid', () => {
  it('kõik komplekti viited on olemas ja kordus ei dubleeri', () => {
    for (const k of KITS) {
      const ids = [...k.presetIds, ...k.uniforms.flatMap((u) => u.presetIds)]
      for (const id of ids) expect(PRESETS.some((p) => p.id === id)).toBe(true)
      const once = addKit(emptyState(), k)
      const twice = addKit(once, k)
      expect(twice.items).toHaveLength(once.items.length)
      expect(twice.uniforms).toHaveLength(k.uniforms.length)
    }
  })

  it('jalats ei lähe kandmisega pessu', () => {
    const s = addKit(emptyState(), KITS[0])
    s.items.forEach((i) => { if (!i.noWash) i.clean = 3 })
    const next = wear(s, s.uniforms[0].id, day)
    const shoes = next.items.find((i) => i.name === 'Valged tossud')!
    expect(shoes.dirty).toBe(0)
    expect(next.items.find((i) => i.name === 'Valge T-särk')!.dirty).toBe(1)
  })
})
