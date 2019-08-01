export interface IBaseForm<TFormState = any> {
  state: TFormState;
  onChange(...args: any[]);
  isPermitted?: boolean;
}
