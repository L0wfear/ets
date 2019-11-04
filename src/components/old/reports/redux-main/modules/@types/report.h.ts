import { IResponseData } from 'api/@types/rest.h';

type IReportMetaFieldDetails = {
  /**
   * Table header full name
   */
  name: string;
  filter_field?: string;
  is_row?: boolean;
};

export type IReportMetaField = {
  [headerName: string]: IReportMetaFieldDetails;
};

export type IReportTableMeta = {
  fields?: Array<IReportMetaField>;
};

type IReportMetaLevelDetails = {
  level?: string;
  // Table row selector id
  pk_field?: string;
  // New row selector ids
  filter?: Array<string>;
};

type IReportMetaLevels = {
  current?: IReportMetaLevelDetails;
  higher?: IReportMetaLevelDetails;
  lower?: IReportMetaLevelDetails;
  summary?: IReportMetaLevelDetails;
};

export type IReportMeta = {
  description?: string;
  fields?: Array<IReportMetaField>;
  levels?: IReportMetaLevels;
  name?: string;
  [field: string]: any;
};

type ISummaryTableData = {
  summaryList: Array<object>;
  summaryMeta: IReportMeta;
  summaryTableMetaInfo: Array<IReportMetaField>;
};

export type IReportStateProps = {
  data: any;
  list: Array<object>;
  meta: IReportMeta;
  tableMetaInfo: IReportTableMeta;

  prevList: Array<object>;
  prevMeta: IReportMeta;
  prevTableMetaInfo: IReportTableMeta;

  reportMetaFetching: boolean;
  reportDataFetching: boolean;
} & ISummaryTableData;

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
