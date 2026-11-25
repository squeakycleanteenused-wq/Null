import { wash } from '../logic'
import type { Props } from './types'

export default function Laundry({ state, update }: Props) {
  const dirtyItems = state.items.filter((i) => i.dirty > 0)
  const dirtyTotal = dirtyItems.reduce((n, i) => n + i.dirty, 0)

  return (
    <>
      <h1>Pesu</h1>
      {dirtyItems.length === 0 ? (
        <p className="card">Pesukorv on tühi. Kõik on puhas. 🎉</p>
      ) : (
        <>
          <ul className="list">
            {dirtyItems.map((i) => (
              <li key={i.id} className="card row">
                <div>
                  <strong>{i.name}</strong>
                  <div className="muted small">{i.dirty} pesu ootel, {i.clean} puhast</div>
                </div>
                <button className="btn small" onClick={() => update((s) => wash(s, i.id))}>Puhas</button>
              </li>
            ))}
          </ul>
          <button className="btn primary big" onClick={() => update((s) => wash(s))}>
            Pesin kõik ({dirtyTotal})
          </button>
        </>
      )}
      <h2>Puhtad varud</h2>
      <ul className="list">
        {state.items.map((i) => (
          <li key={i.id} className="card row">
            <span>{i.name}</span>
            <span className={i.clean < 1 ? 'bad' : 'muted'}>{i.clean} puhast</span>
          </li>
        ))}
      </ul>
    </>
  )
}
