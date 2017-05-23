import { IResponseData } from 'api/@types/rest.h';

interface IReportMetaFieldDetails {
  /**
   * Table header full name
   */
  name: string;
}



interface IReportMetaField {
  [headerName: string]: IReportMetaFieldDetails;
}

export interface IReportTableMeta {
  fields?: IReportMetaField[];
}

interface IReportMetaLevelDetails {
  level?: string;
  // Table row selector id
  pk_field?: string;
  // New row selector ids
  filter?: string[];
}

interface IReportMetaLevels {
  current?: IReportMetaLevelDetails;
  higher?: IReportMetaLevelDetails;
  lower?: IReportMetaLevelDetails;
  summary?: IReportMetaLevelDetails;
}

export interface IReportMeta {
  fields?: IReportMetaField[];
  levels?: IReportMetaLevels;
}

export interface IReportStateProps {
  list: object[];
  meta: IReportMeta;
  summaryList: object[];
  summaryMeta: IReportMeta;
  tableMetaInfo: IReportTableMeta;
  summaryTableMetaInfo: IReportMetaField[];
  reportMetaFetching: boolean;
  reportDataFetching: boolean;
}

export type ReportDataPromise = Promise<IResponseData<any, IReportMeta>>;

export type IGetTableMetaInfo = (serviceName: string) => (dispatch: any) => Promise<any>;
export type IGetReportData = (
  serviceName: string,
  getOpts?: object,
  reportType?: string,
) => (dispatch: any) => ReportDataPromise;

export type ISetInitialState = () => object;
