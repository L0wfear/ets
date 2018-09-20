import { IDataTableSchema, ISchemaRenderer } from './schema.h';

type IFilterValue = string | number | string[] | number[];

export interface IFilterValues {
  [key: string]: IFilterValue;
}

export interface IPropsDataTable<TResultObject> {
  results: TResultObject[];
  title?: string;
  tableMeta?: IDataTableSchema;
  renderers?: ISchemaRenderer;
  onRowSelected?(IDataTableSelectedRow): any;
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
  externalFilter?: (...arg: any[]) => any;
  externalChangeSort?: (...arg: any[]) => any;
  initialSortAscending?: boolean;
  filterValues?: any;
  haveMax?: boolean;
  checked?: any;
  normInitialData?: boolean;
  highlightClassMapper?: (rowData: any) => void | string;
}
