import { IExportableTableList } from 'utils/@types/common.h';
import { IDataTableSelectedRowPropsData } from 'components/ui/table/@types/schema.h';
import { IReportProps } from 'components/reports/@types/common.h';
import * as ReduxTypes from 'components/reports/redux-main/modules/@types/report.h';
import { RouteComponentProps } from 'react-router-dom';

export interface IPropsReportContainer
  extends IExportableTableList,
    RouteComponentProps,
    IReportProps,
    ReduxTypes.IReportStateProps {
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
}

export interface IStateReportContainer {
  filterResetting: boolean;
  fetchedBySubmitButton: boolean;
  fetchedByMoveDownButton: boolean;
  selectedRow: IDataTableSelectedRowPropsData;
  exportFetching: boolean;
  filterValues: any;
  uniqName: string;
}
