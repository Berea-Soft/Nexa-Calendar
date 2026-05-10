export class PluginManager {
  constructor() {
    this._plugins = new Map();
  }
  register(plugin, store) {
    if (this._plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }
    this._plugins.set(plugin.name, plugin);
    plugin.install(store);
  }
  unregister(name) {
    return this._plugins.delete(name);
  }
  getPlugin(name) {
    return this._plugins.get(name);
  }
  hasPlugin(name) {
    return this._plugins.has(name);
  }
  get all() {
    return Array.from(this._plugins.values());
  }
}
//# sourceMappingURL=plugin-manager.js.map
