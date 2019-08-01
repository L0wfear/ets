import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { HandleThunkActionCreator } from 'react-redux';
import { registryCheckLine } from 'components/new/ui/registry/module/actions-registy';

export interface StatePropsTrTdEnumerated {
  paginator: OneRegistryData['list']['paginator'];
}

export interface DispatchPropsTrTdEnumerated {}
export interface OwnPropsTrTdEnumerated {
  registryKey: string;
  indexRow: number;
}

export type PropsTrTdEnumerated = (
  StatePropsTrTdEnumerated
  & DispatchPropsTrTdEnumerated
  & OwnPropsTrTdEnumerated
);

export type StateTrTdEnumerated = {
};

export interface StatePropsTrTdCheckbox {
  isChecked: boolean;
}

export type DispatchPropsTrTdCheckbox = {
  registryCheckLine: HandleThunkActionCreator<typeof registryCheckLine>;
};

export interface OwnPropsTrTdCheckbox {
  registryKey: string;
  rowData: any;
}

export type PropsTrTdCheckbox = (
  StatePropsTrTdCheckbox
  & DispatchPropsTrTdCheckbox
  & OwnPropsTrTdCheckbox
);

export type StateTrTdCheckbox = {
};
