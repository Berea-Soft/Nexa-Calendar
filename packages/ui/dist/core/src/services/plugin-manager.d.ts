import type { ICalendarPlugin } from '../types/plugin';
import { CalendarStore } from '../domain/store';
export declare class PluginManager {
    private _plugins;
    register(plugin: ICalendarPlugin, store: CalendarStore): void;
    unregister(name: string): boolean;
    getPlugin(name: string): ICalendarPlugin | undefined;
    hasPlugin(name: string): boolean;
    get all(): ICalendarPlugin[];
}
