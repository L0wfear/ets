export interface IExportableTableList {
  export(payload: object, useRouteParams?: boolean): Promise<any>;
  exportByPostData(bodyPayload: object, urlPayload: object): Promise<any>;
}

export interface IHistoryQuery {
  [field: string]: string;
}

export interface IHistoryLocation {
  query: IHistoryQuery;
}

export interface IHistoryInjected {
  location: IHistoryLocation;
  history: any;
}

export interface IComponentEventHandler {
  onChange?(e: any): void;
  onClick?(e: any): void;
}
