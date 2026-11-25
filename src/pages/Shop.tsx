import { PRESETS, SHOPS, itemQuery, presetQuery, type Gender, type Preset } from '../shops'
import { ROLE_LABELS, uid, type Item } from '../logic'
import type { Props } from './types'

const GENDERS: { id: Gender; label: string }[] = [
  { id: 'naised', label: 'Naistele' },
  { id: 'mehed', label: 'Meestele' },
]

function ShopLinks({ query }: { query: string }) {
  return (
    <div className="row wrap">
      {SHOPS.map((s) => (
        <a key={s.id} className="btn small" href={s.search(query)} target="_blank" rel="noopener noreferrer">
          {s.name} ↗
        </a>
      ))}
    </div>
  )
}

export default function Shop({ state, update }: Props) {
  const have = new Set(state.items.map((i) => i.name.toLowerCase()))
  const addPreset = (p: Preset) =>
    update((s) => {
      const item: Item = { id: uid(), name: p.title, role: p.role, color: p.color, brand: '', size: '', clean: 0, dirty: 0, target: 3 }
      return { ...s, items: [...s.items, item] }
    })

  return (
    <>
      <h1>Pood</h1>
      <p className="muted">
        Leia kapsli põhitükid Zalandost ja About Youst. Vajutus avab poe otsingu, tellid seal ise. Hindu ja laoseisu näed poes.
      </p>

      <div className="seg" role="group" aria-label="Kellele">
        {GENDERS.map((g) => (
          <button key={g.id} className={state.gender === g.id ? 'on' : ''} onClick={() => update((s) => ({ ...s, gender: g.id }))}>
            {g.label}
          </button>
        ))}
      </div>

      <h2>Põhitükid</h2>
      <ul className="list">
        {PRESETS.map((p) => (
          <li key={p.id} className="card">
            <div className="row">
              <div>
                <strong>{p.title}</strong>
                <div className="muted small">{ROLE_LABELS[p.role]} · {p.note}</div>
              </div>
              {have.has(p.title.toLowerCase()) ? (
                <span className="muted small">Garderoobis ✓</span>
              ) : (
                <button className="btn small" onClick={() => addPreset(p)}>+ Garderoobi</button>
              )}
            </div>
            <ShopLinks query={presetQuery(p, state.gender)} />
          </li>
        ))}
      </ul>

      {state.items.length > 0 && (
        <>
          <h2>Osta uuesti oma tükke</h2>
          <p className="muted small">Otsing nime ja margi järgi. Suuruse ja värvi vali poes.</p>
          <ul className="list">
            {state.items.map((i) => (
              <li key={i.id} className="card">
                <strong>{i.name}</strong>
                <div className="muted small">{[i.brand, i.size && `suurus ${i.size}`].filter(Boolean).join(' · ') || 'Lisa mark ja suurus garderoobi lehel'}</div>
                <ShopLinks query={itemQuery(i, state.gender)} />
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="muted small">Äpp ei ole Zalando ega About You ametlik partner. Lingid viivad poe enda otsingule.</p>
    </>
  )
}
