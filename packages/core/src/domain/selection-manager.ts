import { TimeGuard } from '@bereasoftware/time-guard'
import type { DateRange } from '../types/view'

export interface SelectionState {
  start: TimeGuard | null
  end: TimeGuard | null
  isSelected: boolean
}

export type SelectionListener = (state: SelectionState) => void
export type SelectionUnsubscribe = () => void

export class SelectionManager {
  private _state: SelectionState = { start: null, end: null, isSelected: false }
  private _listeners = new Set<SelectionListener>()

  get state(): SelectionState {
    return this._state
  }

  select(start: TimeGuard, end: TimeGuard): void {
    this._state = { start, end, isSelected: true }
    this._notify()
  }

  clear(): void {
    this._state = { start: null, end: null, isSelected: false }
    this._notify()
  }

  getRange(): DateRange | null {
    if (!this._state.start || !this._state.end) return null
    return {
      start: this._state.start,
      end: this._state.end,
    }
  }

  subscribe(listener: SelectionListener): SelectionUnsubscribe {
    this._listeners.add(listener)
    return () => this._listeners.delete(listener)
  }

  private _notify(): void {
    this._listeners.forEach(l => l(this._state))
  }
}
