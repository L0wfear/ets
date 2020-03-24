import { TInjectedPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';
import { ISchemaRenderer, IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

/**
 * Это пропсы оборачиваемого компонента, которые надо расшарить для обёртки.
 */
export type ISharedPropsDataTableInput = {
  inputList: Array<any>;
  tableSchema: IDataTableSchema;
  isPermitted: boolean;
  renderers: any;
  disabled?: boolean;
  addButtonLabel?: string;
  removeButtonLable?: string;
  selectField?: string;
  typesListOpt?: Array<any>;
  page: string;
  path: string;
  tableTitle?: string;
  hideButtons?: boolean;
};

export type IStateDataTableInput = {
  selected: any;
};

export type IPropsDataTableInput = ISharedPropsDataTableInput & TInjectedPropsDataTableInputWrapper;

export type IPropsDataTableInputRenderer = {
  index: number;
  value: string | any;
  isPermitted: boolean;
  outputListErrors: Array<ETSCore.Types.IStringKeyHashTable<string>>;
  onChange(index: number, key: string | object, value?: any): void;
  fieldKey?: string;
  inputList: Array<any>;

  validationSchema?: SchemaType<Record<string, any>, any>;
};

export type TRendererFunction = (
  props: any,
  onListItemChange: (index: number, key: string, value: any) => void,
) => ISchemaRenderer;
