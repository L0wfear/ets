import { IResponseData } from 'api/@types/rest.h';

interface IReportMetaFieldDetails {
  /**
   * Table header full name
   */
  name: string;
  filter_field?: string;
  is_row?: boolean;
}

export interface IReportMetaField {
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
  description?: string;
  fields?: IReportMetaField[];
  levels?: IReportMetaLevels;
  name?: string;
  [field: string]: any;
}

interface ISummaryTableData {
  summaryList: object[];
  summaryMeta: IReportMeta;
  summaryTableMetaInfo: IReportMetaField[];
}

export interface IReportStateProps extends ISummaryTableData {
  data: any;
  list: object[];
  meta: IReportMeta;
  tableMetaInfo: IReportTableMeta;

  prevList: object[];
  prevMeta: IReportMeta;
  prevTableMetaInfo: IReportTableMeta;

  reportMetaFetching: boolean;
  reportDataFetching: boolean;
}

export type ReportDataPromise = Promise<IResponseData<any, IReportMeta>>;

export type IGetTableMetaInfo = (serviceName: string) => (dispatch: any) => Promise<any>;
export type IGetReportData = (
  serviceName: string,
  getOpts?: object,
  reportType?: string,
  props?: any,
) => (dispatch: any) => ReportDataPromise;

export type ISetInitialState = () => object;
export type ISetSummaryTableDataState = (tableData: ISummaryTableData) => object;
