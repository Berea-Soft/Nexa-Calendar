export class EventSorter {
  sort(events, config) {
    const configs = Array.isArray(config) ? config : config ? [config] : [];
    if (configs.length === 0) {
      return this._defaultSort(events);
    }
    return this._sortBy(events, configs);
  }
  sortByDisplayPriority(events) {
    return [...events].sort((a, b) => {
      if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
      if (a.display === 'background' && b.display !== 'background') return 1;
      if (b.display === 'background' && a.display !== 'background') return -1;
      return a.start.valueOf() - b.start.valueOf();
    });
  }
  _defaultSort(events) {
    return [...events].sort((a, b) => {
      const diff = a.start.valueOf() - b.start.valueOf();
      if (diff !== 0) return diff;
      if (a.end && b.end) return a.end.valueOf() - b.end.valueOf();
      if (a.end) return 1;
      if (b.end) return -1;
      return a.title.localeCompare(b.title);
    });
  }
  _sortBy(events, configs) {
    return [...events].sort((a, b) => {
      for (const { key, direction } of configs) {
        const aVal = a[key];
        const bVal = b[key];
        let cmp = 0;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          cmp = aVal.localeCompare(bVal);
        } else if (aVal instanceof Object && 'valueOf' in aVal) {
          cmp = aVal.valueOf() - bVal.valueOf();
        } else {
          cmp = Number(aVal) - Number(bVal);
        }
        if (cmp !== 0) return direction === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }
}
//# sourceMappingURL=event-sorter.js.map
