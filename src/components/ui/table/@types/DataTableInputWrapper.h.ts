import { IDataTableSchema, IDataTableSelectedRow } from 'components/ui/table/@types/schema.h';
import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export interface IPropsDataTableInputWrapper {
  disabled?: boolean;
  validationSchema?: IValidationSchema;
  tableSchema: IDataTableSchema;
  inputList: any[];
  onValidation?(options: IStateDataTableInputWrapper): void;
  onChange(value: any, isValidInput?: boolean): void;
  onItemChange?(index: number, key: string, value: any): void;
  onItemAdd?(): void;
  onItemRemove?(index?: number): void;
  onRowSelected(selectedRow: IDataTableSelectedRow): void;
  selectField: string;
}
export interface IStateDataTableInputWrapper {
  outputListErrors?: ETSCore.Types.IStringKeyHashTable<string>[];
  isValidInput?: boolean;
}

export type THOCPropsDataTableInput = IPropsDataTableInputWrapper & IStateDataTableInputWrapper;
