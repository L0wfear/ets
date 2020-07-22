import { IDataTableSelectedRow } from 'components/old/ui/table/@types/schema.h';
import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

/**
 * Пропсы, которые принимает компонент-обёртка.
 * Оборачиваемый компонент о них ничего не знает.
 */
export type IExternalPropsDataTableInputWrapper<F = any> = {
  stackOrder?: boolean;
  validationSchema?: SchemaType<F, any>;
  outerValidate?: boolean;
  errors?: Array<any>;
  onValidation?(options: IStateDataTableInputWrapper): void;
  onChange(value: any, isValidInput?: boolean): void;

  batteryAvailableCarList?: any;
  tireAvailableCarList?: any;
  spareAvailableCarList?: any;
  fuelCardsAvailableCarList?: any;
  isLoading?: boolean;
};

/**
 * Объединённые пропсы обёртки и оборачиваемого компонента.
 * Сделано так, чтобы не дублировать пропсы оборачиваемого компонента в обёртке.
 * Необходимо в том случае, если обёртка обращается к пропсам оборачиваемого компонента.
 */
export type TPropsDataTableInputWrapper = IExternalPropsDataTableInputWrapper & ISharedPropsDataTableInput;

export type IPropsDataTableInputWrapper = {
  onItemChange?(index: number, key: string, value: any): void;
  onItemAdd?(): void;
  onItemRemove?(index?: number): void;
  onRowSelected?(selectedRow: IDataTableSelectedRow): void;
};
export type IStateDataTableInputWrapper = {
  outputListErrors?: Array<any>;
  isValidInput?: boolean;
  selectedIndex?: number;
};

/**
 * Объединённые пропсы и стейт обёртки, которые прокидываются (!) в оборачиваемый компонент.
 * Все прокинутые пропсы желательно делать необязательными (?:),
 * иначе при использовании компонента без обёртки они будут требоваться, что не есть правильно.
 */
export type TInjectedPropsDataTableInputWrapper = IPropsDataTableInputWrapper & IStateDataTableInputWrapper;
