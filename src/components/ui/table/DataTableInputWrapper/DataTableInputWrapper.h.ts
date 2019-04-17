import { IDataTableSelectedRow } from 'components/ui/table/@types/schema.h';
import { IValidationSchema } from 'components/ui/form/@types/validation.h';
import { ISharedPropsDataTableInput } from 'components/ui/table/DataTableInput/DataTableInput.h';

/**
 * Пропсы, которые принимает компонент-обёртка.
 * Оборачиваемый компонент о них ничего не знает.
 */
export interface IExternalPropsDataTableInputWrapper {
  stackOrder?: boolean;
  validationSchema?: IValidationSchema;
  onValidation?(options: IStateDataTableInputWrapper): void;
  onChange(value: any, isValidInput?: boolean): void;
}

/**
 * Объединённые пропсы обёртки и оборачиваемого компонента.
 * Сделано так, чтобы не дублировать пропсы оборачиваемого компонента в обёртке.
 * Необходимо в том случае, если обёртка обращается к пропсам оборачиваемого компонента.
 */
export type TPropsDataTableInputWrapper = IExternalPropsDataTableInputWrapper & ISharedPropsDataTableInput;

export interface IPropsDataTableInputWrapper {
  onItemChange?(index: number, key: string, value: any): void;
  onItemAdd?(): void;
  onItemRemove?(index?: number): void;
  onRowSelected?(selectedRow: IDataTableSelectedRow): void;
}
export interface IStateDataTableInputWrapper {
  outputListErrors?: ETSCore.Types.IStringKeyHashTable<string>[];
  isValidInput?: boolean;
  selectedIndex?: number;
}

/**
 * Объединённые пропсы и стейт обёртки, которые прокидываются (!) в оборачиваемый компонент.
 * Все прокинутые пропсы желательно делать необязательными (?:),
 * иначе при использовании компонента без обёртки они будут требоваться, что не есть правильно.
 */
export type TInjectedPropsDataTableInputWrapper = IPropsDataTableInputWrapper & IStateDataTableInputWrapper;
