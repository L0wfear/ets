import { IReactSelectOption } from 'components/old/ui/@types/ReactSelect.h';

export type IDataTableSelectedRowPropsData = {
  [fieldName: string]: any;
  rowNumber?: number;
};

type IDataTableSelectedRowProps<TRowData> = {
  data: any;
  rowData: TRowData;
};

export type IDataTableSelectedRow<
  TRowData = IDataTableSelectedRowPropsData
> = {
  props: IDataTableSelectedRowProps<TRowData>;
};

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

export type IDataTableColFilter = {
  type: FieldTypes;
  options?: Array<IReactSelectOption>;
  labelFunction?: ILabelFunction;
  byKey?: string;
  byLabel?: string;
  filterFunction?: ITypeCustomFilterFunc;
  notUse?: boolean;
};

type IDataTableColNotUseFilter = {
  notUse?: boolean;
  [key: string]: any;
};

export type IDataTableColSchema = {
  /**
   * Field name for data binding
   */
  name: string;
  /**
   * Table field and form field displaying names
   */
  displayName?: React.ReactNode;
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
};

export type IDataTableSchema = {
  cols: Array<IDataTableColSchema>;
};

export type IExtractedDataTableSchema = {
  [columnName: string]: IDataTableColSchema;
};

export type ISchemaRenderer<TRowData = IDataTableSelectedRowPropsData> = {
  [field: string]: (rowMeta: IDataTableSelectedRowProps<TRowData>, props: any) => any;
};

export type ISchemaMaker = {
  [field: string]: (
    schemaMeta: IDataTableColSchema,
    someProps?: object,
  ) => IDataTableColSchema;
};
