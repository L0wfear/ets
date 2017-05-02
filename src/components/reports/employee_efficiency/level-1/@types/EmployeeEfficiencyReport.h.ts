import { IExportableTableList, IHistoryInjected } from 'utils/@types/common.h';

export interface IPropsEmployeeEfficiencyReport extends
  IExportableTableList, IHistoryInjected {
  brigadeAndEmployeeEfficiencyReport1L: object[];
}

export interface IStateEmployeeEfficiencyReport {
  date_start: string | Date;
  date_end: string | Date;
  [field: string]: any;
}
