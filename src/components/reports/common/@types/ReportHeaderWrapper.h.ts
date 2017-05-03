export interface IStateReportHeaderWrapper {
  [fieldName: string]: any;
}

export interface IPropsReportHeaderWrapper {
  handleChange(field: string, value: any): void;
}

export interface IPropsReportHeaderCommon {
  onClick(headerState: object): void;
  readOnly: boolean;
}
