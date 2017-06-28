export interface IReactSelectOption {
  label: number | string;
  value: number | string;
}

export interface IPropsEtsSelect {
  options?: IReactSelectOption[];
  value?: string;
  clearable?: boolean;
  onChange?(...any);
}
