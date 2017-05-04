export interface IReportProps {
  title: string;
  serviceName: string;
  serviceUrl: string;
  reportUrl: string;
  headerComponent: any;
  renderers?: {
    [field: string]: (rowMeta) => any;
  };
  schemaMakers?: {
    [field: string]: (schemaMeta: object, reportProps: object) => object;
  };
}
