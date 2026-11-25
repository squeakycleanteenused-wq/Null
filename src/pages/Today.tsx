import { missingClean, streak, todayStr, undoWear, uniformItems, wear, wornToday } from '../logic'
import type { Props } from './types'

export default function Today({ state, update, goTo }: Props & { goTo: (t: 'laundry' | 'wardrobe') => void }) {
  const entry = wornToday(state)
  const shownId = entry?.uniformId ?? state.activeUniformId
  const uniform = state.uniforms.find((u) => u.id === shownId) ?? state.uniforms[0]
  const days = streak(state)
  const dateLabel = new Date().toLocaleDateString('et-EE', { weekday: 'long', day: 'numeric', month: 'long' })

  if (!uniform) {
    return (
      <>
        <h1>Täna</h1>
        <p>Sul pole veel vormi. Loo see garderoobi lehel.</p>
        <button className="btn primary" onClick={() => goTo('wardrobe')}>Loo vorm</button>
      </>
    )
  }

  const items = uniformItems(state, uniform)
  const missing = missingClean(state, uniform)

  return (
    <>
      <p className="muted cap">{dateLabel}</p>
      <h1>{entry ? 'Täna on otsustatud ✓' : 'Täna kannad'}</h1>

      {state.uniforms.length > 1 && !entry && (
        <div className="seg" role="group" aria-label="Vali vorm">
          {state.uniforms.map((u) => (
            <button
              key={u.id}
              className={u.id === uniform.id ? 'on' : ''}
              onClick={() => update((s) => ({ ...s, activeUniformId: u.id }))}
            >
              {u.name}
            </button>
          ))}
        </div>
      )}

      <section className="card hero">
        <h2>{uniform.name}</h2>
        <ul className="outfit">
          {items.map((i) => (
            <li key={i.id}>
              <strong>{i.name}</strong>
              <span className={i.clean < 1 ? 'bad' : 'muted'}>
                {i.clean < 1 ? 'puhast pole' : `${i.clean} puhast`}
              </span>
            </li>
          ))}
        </ul>

        {entry ? (
          <button className="btn" onClick={() => update((s) => undoWear(s, todayStr()))}>
            Võta tagasi
          </button>
        ) : missing.length > 0 ? (
          <>
            <p className="bad">Puhast pole: {missing.map((m) => m.name).join(', ')}. Pese või kontrolli kogust garderoobis.</p>
            <button className="btn primary big" onClick={() => goTo('laundry')}>Mine pesu juurde</button>
          </>
        ) : (
          <button className="btn primary big" onClick={() => update((s) => wear(s, uniform.id))}>
            Panin selga
          </button>
        )}
      </section>

      <p className="streak">
        {days > 0
          ? `${days} ${days === 1 ? 'päev' : 'päeva'} järjest ilma riiete üle mõtlemata.`
          : 'Märgi täna esimene päev, et streak algaks.'}
      </p>
    </>
  )
}
