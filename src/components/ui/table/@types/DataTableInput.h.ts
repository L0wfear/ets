import { THOCPropsDataTableInput } from 'components/ui/table/@types/DataTableInputWrapper.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';

export interface IPropsDataTableInput extends THOCPropsDataTableInput {
  stackOrder?: boolean;
  renderers: any;
  addButtonLabel?: string;
  removeButtonLable?: string;
}

export interface IStateDataTableInput {
  selected: any;
}

export interface IPropsDataTableInputRenderer {
  index: number;
  value: string;
  outputListErrors: ETSCore.Types.IStringKeyHashTable<string>[];
  onChange(index: number, key: string, value: any): void;
}

export type TRendererFunction = (
  props: any,
  onListItemChange: (index: number, key: string, value: any) => void,
) => ISchemaRenderer;
