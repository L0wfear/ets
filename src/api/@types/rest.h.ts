
export interface IResponseDataResult<RowType, MetaType> {
  meta?: MetaType;
  rows: RowType[];
  warnings?: any[];
  errors?: any[];
}

export interface IResponseData<RowType, MetaType> {
  result: IResponseDataResult<RowType, MetaType>;
}
