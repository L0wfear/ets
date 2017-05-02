export interface IReportProps {
  title: string;
  serviceName: string;
  reportUrl: string;
  headerComponent: any;
  renderers?: {
    [field: string]: (rowMeta) => any;
  };
  schemaRenderers?: {
    [field: string]: (schemaMeta: object, reportProps: object) => object;
  };
}
