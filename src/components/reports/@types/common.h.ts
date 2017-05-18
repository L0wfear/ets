interface ISchemaRenderer {
  [field: string]: (rowMeta) => any;
}

export interface IReportProps {
  title: string;
  serviceName: string;
  serviceUrl: string;
  reportUrl: string;
  enumerated?: boolean;
  enableSort?: boolean;
  headerComponent: any;
  renderers?: ISchemaRenderer;
  summaryRenderes?: ISchemaRenderer;
  schemaMakers?: {
    [field: string]: (schemaMeta: object, reportProps: object) => object;
  };
  headerStateMaker?(state: any): any;
}
