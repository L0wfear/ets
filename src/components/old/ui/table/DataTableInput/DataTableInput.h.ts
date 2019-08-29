import { TInjectedPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';
import { ISchemaRenderer, IDataTableSchema } from 'components/old/ui/table/@types/schema.h';

/**
 * Это пропсы оборачиваемого компонента, которые надо расшарить для обёртки.
 */
export interface ISharedPropsDataTableInput {
  inputList: any[];
  tableSchema: IDataTableSchema;
  isPermitted: boolean;
  renderers: any;
  disabled?: boolean;
  addButtonLabel?: string;
  removeButtonLable?: string;
  selectField?: string;
  batteryAvailableCarGetAndSetInStore?: any;
  tireAvailableCarGetAndSetInStore?: any;
  spareAvailableCarGetAndSetInStore?: any;
  typesListOpt?: any[];
  page: string;
  path: string;
  tableTitle?: string;
}

export interface IStateDataTableInput {
  selected: any;
}

export type IPropsDataTableInput = ISharedPropsDataTableInput & TInjectedPropsDataTableInputWrapper;

export interface IPropsDataTableInputRenderer {
  index: number;
  value: string | any;
  isPermitted: boolean;
  outputListErrors: ETSCore.Types.IStringKeyHashTable<string>[];
  onChange(index: number, key: string | object, value?: any): void;
  fieldKey?: string;
}

export type TRendererFunction = (
  props: any,
  onListItemChange: (index: number, key: string, value: any) => void,
) => ISchemaRenderer;
