import { IHistoryInjected } from 'utils/@types/common.h';
import { IReportProps } from 'components/reports/@types/common.h';
import { IReportStateProps } from 'components/reports/redux/modules/@types/report.h';

export interface IPropsReportContainer extends
  IHistoryInjected,
  IReportProps,
  IReportStateProps {
  /**
   * AC. Gets report meta info and report data
   */
  setInitialState(): void;
  getInitialReport(serviceName: string, getOpts: object): Promise<void>;
  getReportData(serviceName: string, getOpts: object): Promise<void>;
  getTableMetaInfo(serviceName: string): Promise<void>;
}

export interface IStateReportContainer {

}
