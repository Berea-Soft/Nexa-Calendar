import type { ICalendarPlugin } from '../types/plugin'
import { CalendarStore } from '../domain/store'

export class PluginManager {
  private _plugins: Map<string, ICalendarPlugin> = new Map()

  register(plugin: ICalendarPlugin, store: CalendarStore): void {
    if (this._plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`)
    }
    this._plugins.set(plugin.name, plugin)
    plugin.install(store)
  }

  unregister(name: string): boolean {
    return this._plugins.delete(name)
  }

  getPlugin(name: string): ICalendarPlugin | undefined {
    return this._plugins.get(name)
  }

  hasPlugin(name: string): boolean {
    return this._plugins.has(name)
  }

  get all(): ICalendarPlugin[] {
    return Array.from(this._plugins.values())
  }
}
