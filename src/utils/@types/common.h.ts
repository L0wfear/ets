export type IExportableTableList = {
  export(payload: object, useRouteParams?: boolean): Promise<any>;
  exportByPostData(bodyPayload: any, urlPayload: object): Promise<any>;
};
