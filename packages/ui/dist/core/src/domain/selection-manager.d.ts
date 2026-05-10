import { TimeGuard } from '@bereasoftware/time-guard';
import type { DateRange } from '../types/view';
export interface SelectionState {
    start: TimeGuard | null;
    end: TimeGuard | null;
    isSelected: boolean;
}
export type SelectionListener = (state: SelectionState) => void;
export type SelectionUnsubscribe = () => void;
export declare class SelectionManager {
    private _state;
    private _listeners;
    get state(): SelectionState;
    select(start: TimeGuard, end: TimeGuard): void;
    clear(): void;
    getRange(): DateRange | null;
    subscribe(listener: SelectionListener): SelectionUnsubscribe;
    private _notify;
}
