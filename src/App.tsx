import { useState } from 'react'
import { useStore } from './store'
import { sampleState } from './logic'
import Today from './pages/Today'
import Wardrobe from './pages/Wardrobe'
import Laundry from './pages/Laundry'
import Shopping from './pages/Shopping'
import Shop from './pages/Shop'

type Tab = 'today' | 'wardrobe' | 'laundry' | 'shopping' | 'shop'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'today', label: 'Täna', icon: '☀️' },
  { id: 'wardrobe', label: 'Garderoob', icon: '👕' },
  { id: 'laundry', label: 'Pesu', icon: '🧺' },
  { id: 'shopping', label: 'Nimekiri', icon: '📝' },
  { id: 'shop', label: 'Pood', icon: '🛍️' },
]

export default function App() {
  const { state, update, replace } = useStore()
  const [tab, setTab] = useState<Tab>('today')

  if (!state.started) {
    return (
      <main className="page welcome">
        <h1>Kapsli garderoob</h1>
        <p className="lead">Üks vorm. Null hommikust otsustamist.</p>
        <p>Vali paar riidetükki, mida kannad iga päev, ja äpp hoolitseb ülejäänu eest: mida selga panna, millal pesta ja mida osta.</p>
        <button className="btn primary big" onClick={() => replace(sampleState())}>
          Alusta näidisvormiga
        </button>
        <button
          className="btn big"
          onClick={() => {
            update((s) => ({ ...s, started: true }))
            setTab('wardrobe')
          }}
        >
          Alusta tühjalt
        </button>
        <p className="muted small">Andmed jäävad ainult sinu seadmesse. Kontot pole vaja.</p>
      </main>
    )
  }

  return (
    <>
      <main className="page">
        {tab === 'today' && <Today state={state} update={update} goTo={setTab} />}
        {tab === 'wardrobe' && <Wardrobe state={state} update={update} replace={replace} />}
        {tab === 'laundry' && <Laundry state={state} update={update} />}
        {tab === 'shopping' && <Shopping state={state} update={update} />}
        {tab === 'shop' && <Shop state={state} update={update} />}
      </main>
      <nav className="tabs" aria-label="Peamenüü">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)} aria-current={tab === t.id}>
            <span aria-hidden>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </>
  )
}
