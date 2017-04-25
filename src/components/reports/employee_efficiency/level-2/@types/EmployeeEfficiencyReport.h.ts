import { IExportableTableList, IHistoryInjectable } from 'utils/@types/common.h';

export interface IPropsEmployeeEfficiencyReport extends
  IExportableTableList, IHistoryInjectable {
  employeeEfficiencyReport2L: object[];
}
