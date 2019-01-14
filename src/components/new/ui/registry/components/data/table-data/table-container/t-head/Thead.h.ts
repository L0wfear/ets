import { DispatchProp } from 'react-redux';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

export interface StatePropsThead {
  noEnumerated: OneRegistryData['list']['meta']['noEnumerated'];
  fieldsInDeepArr: OneRegistryData['list']['meta']['fieldsInDeepArr'];
}

export type DispatchPropsThead = DispatchProp;

export interface OwnPropsThead {
  registryKey: string;
}

export type PropsThead = (
  StatePropsThead
  & DispatchPropsThead
  & OwnPropsThead
);

export type StateThead = {};
