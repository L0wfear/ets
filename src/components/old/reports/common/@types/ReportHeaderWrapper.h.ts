import { IReportMeta } from 'components/old/reports/redux-main/modules/@types/report.h';
import IStringKeyHashTable = ETSCore.Types.IStringKeyHashTable;
import { IStateReportContainer } from 'components/old/reports/common/@types/ReportContainer.h';

export type IStateReportHeaderWrapper = {} & IStringKeyHashTable<any>;

// export interface IStateReportHeaderWrapper {
//   headerState: IHeaderState;
// }

export type IPropsReportHeaderWrapper = {
  handleChange(field: string, value: any): void;
};

export type IPropsReportHeaderCommon = {
  tableMeta: IReportMeta;
  onClick(headerState: object): void;
  queryState: IStringKeyHashTable<string>;
  readOnly?: boolean;

  localState: IStateReportContainer['localState'];
  setLocalState: (obj: Partial<IStateReportContainer['localState']>) => any;
};
