import { IReactSelectOption } from 'components/ui/@types/ReactSelect.h';

export interface IDataTableSelectedRowPropsData {
  [fieldName: string]: any;
  rowNumber?: number;
}

interface IDataTableSelectedRowProps<TRowData> {
  data: any;
  rowData: TRowData;
}

export interface IDataTableSelectedRow<
  TRowData = IDataTableSelectedRowPropsData
> {
  props: IDataTableSelectedRowProps<TRowData>;
}

type FieldTypes =
  | 'multiselect'
  | 'multiselect-boolean'
  | 'select'
  | 'string'
  | 'date'
  | 'datetime'
  | 'advanced-number'
  | 'advanced-string'
  | 'advanced-date'
  | 'number'
  | 'customFilter';

export type ILabelFunction = (data: number | string) => string;

type ITypeCustomFilterFunc = (value: any, lineData: any) => boolean;

export interface IDataTableColFilter {
  type: FieldTypes;
  options?: IReactSelectOption[];
  labelFunction?: ILabelFunction;
  byKey?: string;
  byLabel?: string;
  filterFunction?: ITypeCustomFilterFunc;
  notUse?: boolean;
}

interface IDataTableColNotUseFilter {
  notUse?: boolean;
  [key: string]: any;
}

export interface IDataTableColSchema {
  /**
   * Field name for data binding
   */
  name: string;
  /**
   * Table field and form field displaying names
   */
  displayName?: string;
  /**
   * Show/hide table column
   */
  display?: boolean;
  /**
   * Field display type
   */
  type?: string;
  /**
   * Table result filter type and other filter options
   */
  filter?: IDataTableColFilter | boolean | IDataTableColNotUseFilter;
  /**
   * CSS custom class for columns styling
   */
  cssClassName?: string;
  /**
   * Custom table header component
   */
  customHeaderComponent?: JSX.Element;
  render?: any;
  orderNum?: any;
  sortByKey?: string;
  sort?: {
    serverFieldName: string;
  };
}

export interface IDataTableSchema {
  cols: IDataTableColSchema[];
}

export interface IExtractedDataTableSchema {
  [columnName: string]: IDataTableColSchema;
}

export interface ISchemaRenderer<TRowData = IDataTableSelectedRowPropsData> {
  [field: string]: (rowMeta: IDataTableSelectedRowProps<TRowData>) => any;
}

export interface ISchemaMaker {
  [field: string]: (
    schemaMeta: IDataTableColSchema,
    someProps?: object,
  ) => IDataTableColSchema;
}
