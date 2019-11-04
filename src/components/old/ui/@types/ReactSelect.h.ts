export type IReactSelectOption = {
  label: number | string;
  value: number | string;
  [additionalFields: string]: any;
};

export type IPropsReactSelect = {
  options?: Array<IReactSelectOption>;
  value?: string;
  clearable?: boolean;
  onChange?(...any);
};
