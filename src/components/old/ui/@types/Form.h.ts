export type IBaseForm<TFormState = any> = {
  state: TFormState;
  onChange(...args: Array<any>);
  isPermitted?: boolean;
};
