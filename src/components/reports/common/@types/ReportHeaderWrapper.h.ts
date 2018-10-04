import { IReportMeta } from 'components/reports/redux-main/modules/@types/report.h';
import IStringKeyHashTable = ETSCore.Types.IStringKeyHashTable;

export interface IStateReportHeaderWrapper extends IStringKeyHashTable<any> {}

// export interface IStateReportHeaderWrapper {
//   headerState: IHeaderState;
// }

export interface IPropsReportHeaderWrapper {
  handleChange(field: string, value: any): void;
}

export interface IPropsReportHeaderCommon {
  tableMeta: IReportMeta;
  onClick(headerState: object): void;
  queryState: IStringKeyHashTable<string>;
  readOnly?: boolean;
}
