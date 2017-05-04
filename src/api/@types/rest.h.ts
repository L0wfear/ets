
export interface IResponseDataResult<RowType, MetaType> {
  meta?: MetaType;
  rows: RowType[];
  warnings?: any;
}

export interface IResponseData<RowType, MetaType> {
  result: IResponseDataResult<RowType, MetaType>;
}
