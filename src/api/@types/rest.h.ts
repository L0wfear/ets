export type IResponseRowObject<IdType> = {
  id: IdType;
};

export type IResponseDataResult<RowType, MetaType> = {
  meta?: MetaType;
  rows: Array<RowType>;
  warnings?: Array<any>;
  errors?: Array<any>;
};

export type IResponseData<RowType, MetaType> = {
  result: IResponseDataResult<RowType, MetaType>;
};

export type INamedObject = {
  id: number;
  name: string;
};
