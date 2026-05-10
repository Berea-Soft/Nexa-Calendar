export class LocalEventSource {
  constructor(events, id) {
    this.id = id ?? 'local';
    this._events = events;
  }
  async fetch(_range) {
    return this._events;
  }
  setEvents(events) {
    this._events = events;
  }
}
export class JsonEventSource {
  constructor(url, id) {
    this.id = id ?? 'json';
    this._url = url;
  }
  async fetch(range) {
    const params = new URLSearchParams({
      start: range.start.toISOString(),
      end: range.end.toISOString(),
    });
    const res = await fetch(`${this._url}?${params}`);
    if (!res.ok) throw new Error(`Failed to fetch events from ${this._url}`);
    const data = await res.json();
    return data.map(d => ({
      ...d,
      id: d.id ?? crypto.randomUUID(),
      title: d.title ?? '(No title)',
      start: d.start,
    }));
  }
}
export class FunctionalEventSource {
  constructor(fetchFn, id) {
    this.id = id ?? 'fn';
    this._fetchFn = fetchFn;
  }
  async fetch(range) {
    return this._fetchFn(range);
  }
}
//# sourceMappingURL=event-sources.js.map
