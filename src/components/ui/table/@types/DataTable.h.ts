import { IDataTableSchema, ISchemaRenderer } from './schema.h';

export interface IPropsDataTable<TResultObject> {
  title?: string;
  tableMeta?: IDataTableSchema;
  results: TResultObject[];
  renderers?: ISchemaRenderer;
  onRowSelected?(IDataTableSelectedRow): void;
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
}
