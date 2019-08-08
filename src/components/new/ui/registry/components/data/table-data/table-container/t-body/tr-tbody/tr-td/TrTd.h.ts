import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

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
