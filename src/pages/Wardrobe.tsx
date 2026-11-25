import { useState } from 'react'
import { emptyState, parseState, removeItem, removeUniform, ROLE_LABELS, uid, type Item, type Role, type State, type Uniform } from '../logic'
import type { Props } from './types'

const blankItem = (): Item => ({ id: uid(), name: '', role: 'top', color: '', brand: '', size: '', clean: 3, dirty: 0, target: 3 })

export default function Wardrobe({ state, update, replace }: Props & { replace: (s: State) => void }) {
  const [item, setItem] = useState<Item | null>(null)
  const [uniform, setUniform] = useState<Uniform | null>(null)

  return (
    <>
      <h1>Garderoob</h1>

      <h2>Vormid</h2>
      <ul className="list">
        {state.uniforms.map((u) => (
          <li key={u.id} className="card row">
            <div>
              <strong>{u.name}</strong>
              <div className="muted small">{u.itemIds.map((id) => state.items.find((i) => i.id === id)?.name).filter(Boolean).join(' + ')}</div>
            </div>
            <button className="btn small" onClick={() => setUniform(u)}>Muuda</button>
          </li>
        ))}
      </ul>
      {!uniform && (
        <button className="btn" onClick={() => setUniform({ id: uid(), name: '', itemIds: [] })} disabled={state.items.length === 0}>
          + Uus vorm
        </button>
      )}
      {uniform && (
        <form
          className="card form"
          onSubmit={(e) => {
            e.preventDefault()
            if (!uniform.name.trim() || uniform.itemIds.length === 0) return
            update((s) => {
              const exists = s.uniforms.some((u) => u.id === uniform.id)
              const uniforms = exists ? s.uniforms.map((u) => (u.id === uniform.id ? uniform : u)) : [...s.uniforms, uniform]
              return { ...s, uniforms, activeUniformId: s.activeUniformId ?? uniform.id }
            })
            setUniform(null)
          }}
        >
          <label>Nimi<input value={uniform.name} onChange={(e) => setUniform({ ...uniform, name: e.target.value })} placeholder="nt Külm päev" required /></label>
          <fieldset>
            <legend>Mis kuulub vormi?</legend>
            {state.items.map((i) => (
              <label key={i.id} className="check">
                <input
                  type="checkbox"
                  checked={uniform.itemIds.includes(i.id)}
                  onChange={(e) =>
                    setUniform({ ...uniform, itemIds: e.target.checked ? [...uniform.itemIds, i.id] : uniform.itemIds.filter((x) => x !== i.id) })
                  }
                />{' '}
                {i.name}
              </label>
            ))}
          </fieldset>
          <div className="row">
            <button className="btn primary">Salvesta</button>
            <button type="button" className="btn" onClick={() => setUniform(null)}>Katkesta</button>
            {state.uniforms.some((u) => u.id === uniform.id) && (
              <button type="button" className="btn danger" onClick={() => { update((s) => removeUniform(s, uniform.id)); setUniform(null) }}>Kustuta</button>
            )}
          </div>
        </form>
      )}

      <h2>Riidetükid</h2>
      <ul className="list">
        {state.items.map((i) => (
          <li key={i.id} className="card row">
            <div>
              <strong>{i.name}</strong>
              <div className="muted small">
                {ROLE_LABELS[i.role]} · {i.clean + i.dirty} tk (siht {i.target})
              </div>
            </div>
            <button className="btn small" onClick={() => setItem(i)}>Muuda</button>
          </li>
        ))}
      </ul>
      {!item && <button className="btn" onClick={() => setItem(blankItem())}>+ Uus riidetükk</button>}
      {item && (
        <form
          className="card form"
          onSubmit={(e) => {
            e.preventDefault()
            if (!item.name.trim()) return
            update((s) => {
              const exists = s.items.some((i) => i.id === item.id)
              return { ...s, items: exists ? s.items.map((i) => (i.id === item.id ? item : i)) : [...s.items, item] }
            })
            setItem(null)
          }}
        >
          <label>Nimi<input value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} placeholder="nt Valge T-särk" required /></label>
          <label>Roll
            <select value={item.role} onChange={(e) => setItem({ ...item, role: e.target.value as Role })}>
              {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <div className="grid2">
            <label>Värv<input value={item.color} onChange={(e) => setItem({ ...item, color: e.target.value })} /></label>
            <label>Suurus<input value={item.size} onChange={(e) => setItem({ ...item, size: e.target.value })} /></label>
          </div>
          <label>Mark / mudel (et osta sama)<input value={item.brand} onChange={(e) => setItem({ ...item, brand: e.target.value })} /></label>
          <div className="grid2">
            <label>Puhast praegu<input type="number" min={0} value={item.clean} onChange={(e) => setItem({ ...item, clean: Math.max(0, +e.target.value || 0) })} /></label>
            <label>Soovitud kokku<input type="number" min={1} value={item.target} onChange={(e) => setItem({ ...item, target: Math.max(1, +e.target.value || 1) })} /></label>
          </div>
          <label className="check">
            <input type="checkbox" checked={!!item.noWash} onChange={(e) => setItem({ ...item, noWash: e.target.checked })} />{' '}
            Ei vaja pesemist iga kandmise järel (jalats, jope)
          </label>
          <div className="row">
            <button className="btn primary">Salvesta</button>
            <button type="button" className="btn" onClick={() => setItem(null)}>Katkesta</button>
            {state.items.some((i) => i.id === item.id) && (
              <button type="button" className="btn danger" onClick={() => { update((s) => removeItem(s, item.id)); setItem(null) }}>Kustuta</button>
            )}
          </div>
        </form>
      )}

      <h2>Andmed</h2>
      <p className="muted small">Kõik on salvestatud ainult selles seadmes. Tee varukoopia, kui vahetad telefoni.</p>
      <div className="row wrap">
        <button
          className="btn"
          onClick={() => {
            const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = 'kapsel-varukoopia.json'
            a.click()
            URL.revokeObjectURL(a.href)
          }}
        >
          Ekspordi
        </button>
        <label className="btn">
          Impordi
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              const parsed = parseState(await f.text())
              if (parsed) replace(parsed)
              else alert('See fail ei sobi.')
              e.target.value = ''
            }}
          />
        </label>
        <button className="btn danger" onClick={() => confirm('Kustutan kõik andmed?') && replace(emptyState())}>Nulli</button>
      </div>
    </>
  )
}
