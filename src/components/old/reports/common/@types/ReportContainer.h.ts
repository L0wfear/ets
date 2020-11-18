import { IExportableTableList } from 'utils/@types/common.h';
import { IDataTableSelectedRowPropsData } from 'components/old/ui/table/@types/schema.h';
import { IReportProps } from 'components/old/reports/@types/common.h';
import * as ReduxTypes from 'components/old/reports/redux-main/modules/@types/report.h';
import { RouteComponentProps } from 'react-router-dom';

export type IPropsReportContainer = {
  /**
   * AC. Gets report meta info and report data
   */
  setInitialState: ReduxTypes.ISetInitialState;
  setSummaryTableData: ReduxTypes.ISetSummaryTableDataState;
  getReportData(
    serviceName: string,
    getOpts?: object,
    reportType?: string,
    props?: any,
  ): ReduxTypes.ReportDataPromise;
  getTableMetaInfo(serviceName: string): Promise<any>;
  setAllData(data: any, func: any): any;
  setReportDataWithSummerData(payload: any): any;
  setDateRange?: any;
} & IExportableTableList & RouteComponentProps & IReportProps & ReduxTypes.IReportStateProps;

export type IStateReportContainer = {
  fetchedBySubmitButton: boolean;
  fetchedByMoveDownButton: boolean;
  selectedRow: IDataTableSelectedRowPropsData;
  exportFetching: boolean;
  filterValues: any;
  uniqName: string;
  aggrFields: Array<string>;
  savedFilterValues: any;
  localState: Record<string, any>;
};
