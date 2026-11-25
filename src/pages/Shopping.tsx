import { useState } from 'react'
import { buyList, retire, uid } from '../logic'
import { SHOPS, itemQuery } from '../shops'
import type { Props } from './types'

export default function Shopping({ state, update }: Props) {
  const lines = buyList(state)
  const [text, setText] = useState('')

  return (
    <>
      <h1>Ostunimekiri</h1>
      <p className="muted">Kui tükk kulub ära, osta täpselt sama. Siis jääb vorm ühesuguseks.</p>

      {lines.length === 0 ? (
        <p className="card">Kõik vajalik on olemas. ✓</p>
      ) : (
        <ul className="list">
          {lines.map(({ item, missing }) => (
            <li key={item.id} className="card">
              <strong>
                {missing} × {item.name}
              </strong>
              <div className="muted small">
                {[item.color, item.brand, item.size && `suurus ${item.size}`].filter(Boolean).join(' · ') || 'Lisa mark ja suurus garderoobi lehel'}
              </div>
              <div className="row wrap" style={{ marginTop: 8 }}>
                {SHOPS.map((s) => (
                  <a key={s.id} className="btn small" href={s.search(itemQuery(item, state.gender))} target="_blank" rel="noopener noreferrer">
                    Osta: {s.name} ↗
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2>Kulunud tükk</h2>
      <p className="muted small">Vajuta, kui mõni tükk lähebki minema. Nimekiri uueneb ise.</p>
      <ul className="list">
        {state.items.map((i) => (
          <li key={i.id} className="card row">
            <span>{i.name} <span className="muted small">({i.clean + i.dirty}/{i.target})</span></span>
            <button className="btn small" onClick={() => update((s) => retire(s, i.id))}>Kulus ära</button>
          </li>
        ))}
      </ul>

      <h2>Muud märkmed</h2>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          update((s) => ({ ...s, notes: [...s.notes, { id: uid(), text: text.trim(), done: false }] }))
          setText('')
        }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="nt sokid" aria-label="Uus märge" />
        <button className="btn small primary">Lisa</button>
      </form>
      <ul className="list">
        {state.notes.map((n) => (
          <li key={n.id} className="card row">
            <label className={n.done ? 'done' : ''}>
              <input
                type="checkbox"
                checked={n.done}
                onChange={() => update((s) => ({ ...s, notes: s.notes.map((x) => (x.id === n.id ? { ...x, done: !x.done } : x)) }))}
              />{' '}
              {n.text}
            </label>
            <button className="btn small" aria-label="Kustuta" onClick={() => update((s) => ({ ...s, notes: s.notes.filter((x) => x.id !== n.id) }))}>×</button>
          </li>
        ))}
      </ul>
    </>
  )
}
