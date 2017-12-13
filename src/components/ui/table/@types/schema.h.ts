import { IReactSelectOption } from 'components/ui/@types/EtsSelect.h';

export interface IDataTableSelectedRowPropsData {
  [fieldName: string]: any;
  rowNumber: number;
}

interface IDataTableSelectedRowProps<TRowData> {
  data: any;
  rowData: TRowData;
}

export interface IDataTableSelectedRow<TRowData = IDataTableSelectedRowPropsData> {
  props: IDataTableSelectedRowProps<TRowData>;
}

type FieldTypes =
  'multiselect' |
  'select' |
  'string' |
  'date' |
  'datetime' |
  'advanced-number'|
  'advanced-string' |
  'number';

export type ILabelFunction = (data: number|string) => string;

interface IDataTableColFilter {
  type: FieldTypes;
  options?: IReactSelectOption[];
  labelFunction?: ILabelFunction;
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
  filter?: IDataTableColFilter | boolean;
  /**
   * CSS custom class for columns styling
   */
  cssClassName?: string;
  /**
   * Custom table header component
   */
  customHeaderComponent?: JSX.Element;
}

export interface IDataTableSchema {
  cols: IDataTableColSchema[];
}

export interface IExtractedDataTableSchema {
  [columnName: string]: IDataTableColSchema;
}

export interface ISchemaRenderer<TRowData = IDataTableSelectedRowPropsData> {
  [field: string]: (rowMeta: IDataTableSelectedRowProps<TRowData>) => JSX.Element;
}

export interface ISchemaMaker  {
  [field: string]: (schemaMeta: IDataTableColSchema, someProps?: object) => IDataTableColSchema;
}
