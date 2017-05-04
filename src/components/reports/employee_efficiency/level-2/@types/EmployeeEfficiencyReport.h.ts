import { IExportableTableList, IHistoryInjected } from 'utils/@types/common.h';

export interface IPropsEmployeeEfficiencyReport extends
  IExportableTableList, IHistoryInjected {
  employeeEfficiencyReport2L: object[];
}
