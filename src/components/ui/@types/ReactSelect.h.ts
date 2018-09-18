export interface IReactSelectOption {
  label: number | string;
  value: number | string;
  [additionalFields: string]: any;
}

export interface IPropsReactSelect {
  options?: IReactSelectOption[];
  value?: string;
  clearable?: boolean;
  onChange?(...any);
}
