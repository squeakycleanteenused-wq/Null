import { useCallback, useEffect, useState } from 'react'
import { emptyState, parseState, type State } from './logic'

const KEY = 'kapsel-state-v1'

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    return (raw && parseState(raw)) || emptyState()
  } catch {
    return emptyState()
  }
}

/** Andmed elavad ainult selles seadmes (localStorage). Kontot pole vaja. */
export function useStore() {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* privaatne režiim vms: äpp töötab edasi, lihtsalt ei salvesta */
    }
  }, [state])

  const update = useCallback((fn: (s: State) => State) => setState(fn), [])
  return { state, update, replace: setState }
}
