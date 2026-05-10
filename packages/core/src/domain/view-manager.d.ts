import type { ViewType, IView } from '../types/view';
type ViewFactory = () => IView;
export declare class ViewManager {
  private _currentType;
  private _factories;
  private _instances;
  constructor();
  get currentType(): ViewType;
  register(type: ViewType, factory: ViewFactory): void;
  setView(type: ViewType): void;
  getView(type?: ViewType): IView;
}
export {};
