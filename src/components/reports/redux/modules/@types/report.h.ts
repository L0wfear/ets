interface IReportMetaFieldDetails {
  /**
   * Table header full name
   */
  name: string;
}

interface IReportMetaField {
  [headerName: string]: IReportMetaFieldDetails;
}

interface IReportMetaLevelDetails {
  level?: string;
  /**
   * Table row selector id
   */
  pk_field?: string;
}

interface IReportMetaLevels {
  current?: IReportMetaLevelDetails;
  higher?: IReportMetaLevelDetails;
  lower?: IReportMetaLevelDetails;
}

interface IReportMeta {
  fields?: IReportMetaField[];
  levels?: IReportMetaLevels;
}

export interface IReportStateProps {
  list: object[];
  meta: IReportMeta;
  tableMetaInfo: IReportMetaField[];
  reportMetaFetching: boolean;
  reportDataFetching: boolean;
}
