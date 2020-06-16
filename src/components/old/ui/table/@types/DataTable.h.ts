import { IDataTableSchema, ISchemaRenderer } from 'components/old/ui/table/@types/schema.h';

type IFilterValue = string | number | Array<string> | Array<number>;

export type IFilterValues = {
  [key: string]: IFilterValue;
};

export type IPropsDataTable<TResultObject> = {
  results: Array<TResultObject>;
  title?: string;
  tableMeta?: IDataTableSchema;
  renderers?: ISchemaRenderer;
  onRowSelected?(IDataTableSelectedRow, number): any;
  onRowChecked?(any): any;
  onAllRowsChecked?(any): any;
  enumerated?: boolean;
  enableSort?: boolean;
  initialSort?: boolean | string;
  noFilter?: boolean;
  usePagination?: boolean;
  selectField?: string;
  selected?: TResultObject;
  noHeader?: boolean;
  preventNoDataMessage?: boolean;
  className?: string;
  filterValue?: IFilterValues;
  multiSelection?: boolean;
  serverPagination?: boolean;
  externalFilter?: any;
  externalChangeSort?: any;
  initialSortAscending?: boolean;
  filterValues?: any;
  haveMax?: boolean;
  checked?: any;
  normInitialData?: boolean;
  highlightClassMapper?: any;
  customId?: number;
  withPerPageSelector?: boolean;
};
