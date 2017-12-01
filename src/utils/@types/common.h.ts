export interface IExportableTableList {
  export(payload: object, useRouteParams?: boolean): Promise<any>;
}

export interface IHistoryLocation {
  search: string;
}

export interface IHistoryInjected {
  location: IHistoryLocation;
  history: any;
}

export interface IComponentEventHandler {
  onChange?(e: any): void;
  onClick?(e: any): void;
}
