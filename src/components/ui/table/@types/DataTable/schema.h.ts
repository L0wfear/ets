interface IDataTableSelectedRowPropsData {
  rowNumber: string;
}

interface IDataTableSelectedRowProps {
  data: IDataTableSelectedRowPropsData;
}

export interface IDataTableSelectedRow {
  props: IDataTableSelectedRowProps;
}

type FieldTypes =
  'multiselect' |
  'select' |
  'string' |
  'number';

interface IDataTableColFilter {
  type: FieldTypes;
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
}

export interface IDataTableSchema {
  cols: IDataTableColSchema[];
}
