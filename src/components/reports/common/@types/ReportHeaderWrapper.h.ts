export interface IHeaderState {
  [fieldName: string]: any;
}

export interface IStateReportHeaderWrapper {
  headerState: IHeaderState;
}

export interface IPropsReportHeaderWrapper {
  handleChange(field: string, value: any): void;
}

export interface IPropsReportHeaderCommon {
  onClick(headerState: object): void;
  readOnly: boolean;
}
