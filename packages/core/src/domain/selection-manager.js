export class SelectionManager {
    constructor() {
        this._state = { start: null, end: null, isSelected: false };
        this._listeners = new Set();
    }
    get state() {
        return this._state;
    }
    select(start, end) {
        this._state = { start, end, isSelected: true };
        this._notify();
    }
    clear() {
        this._state = { start: null, end: null, isSelected: false };
        this._notify();
    }
    getRange() {
        if (!this._state.start || !this._state.end)
            return null;
        return {
            start: this._state.start,
            end: this._state.end,
        };
    }
    subscribe(listener) {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }
    _notify() {
        this._listeners.forEach(l => l(this._state));
    }
}
//# sourceMappingURL=selection-manager.js.map