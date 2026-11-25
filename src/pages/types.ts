import type { State } from '../logic'
export type Props = { state: State; update: (fn: (s: State) => State) => void }
