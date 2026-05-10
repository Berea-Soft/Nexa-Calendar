export type ResourceId = string;

export interface IResource {
  id: ResourceId;
  title: string;
  parentId?: ResourceId;
  children?: IResource[];
  extendedProps?: Record<string, unknown>;
}

export type ResourceInput = {
  id: ResourceId;
  title: string;
  parentId?: ResourceId;
  children?: ResourceInput[];
  extendedProps?: Record<string, unknown>;
};
