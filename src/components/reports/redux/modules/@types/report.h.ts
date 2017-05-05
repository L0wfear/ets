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
}

export interface IReportMeta {
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

export type IGetTableMetaInfo = (serviceName: string) => (dispatch: any) => Promise<any>;
export type IGetReportData =
  (serviceName: string, getOpts?: object) => (dispatch: any) => Promise<IResponseData<any, IReportMeta>>;
export type ISetInitialState = () => object;
