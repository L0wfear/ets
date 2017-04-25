type FieldTypes =
  'multiselect' |
  'select' |
  'string' |
  'number';

interface IDataTableColFilter {
  type: FieldTypes;
}

interface IDataTableColSchema {
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
  type: string;
  /**
   * Table result filter type and other filter options
   */
  filter?: IDataTableColFilter;
  /**
   * CSS custom class for columns styling
   */
  cssClassName?: string;
}

export interface IDataTableSchema {
  cols: IDataTableColSchema[];
}
