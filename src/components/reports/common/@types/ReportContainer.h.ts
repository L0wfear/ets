import { IHistoryInjected, IExportableTableList } from 'utils/@types/common.h';
import { IReportProps } from 'components/reports/@types/common.h';
import { IResponseData } from 'api/@types/rest.h';
import * as ReduxTypes from 'components/reports/redux/modules/@types/report.h';

export interface IPropsReportContainer extends
  IExportableTableList,
  IHistoryInjected,
  IReportProps,
  ReduxTypes.IReportStateProps {
  /**
   * AC. Gets report meta info and report data
   */
  setInitialState: ReduxTypes.ISetInitialState;
  getReportData(serviceName: string, getOpts?: object): Promise<IResponseData<any, ReduxTypes.IReportMeta>>;
  getTableMetaInfo(serviceName: string): Promise<any>;
}

export interface IStateReportContainer {
  filterResetting: boolean;
}
