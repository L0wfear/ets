export type IExportableTableList = {
  exportByPostData(bodyPayload: any, urlPayload: object): Promise<any>;
};
