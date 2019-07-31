import { DispatchProp } from 'react-redux';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

export interface StatePropsTbody {
  showArray: OneRegistryData['list']['processed']['processedArray'];
  rowFields: OneRegistryData['list']['meta']['rowFields'];
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
}

export type DispatchPropsTbody = DispatchProp;

export interface OwnPropsTbody {
  registryKey: string;
}

export type PropsTbody = (
  StatePropsTbody
  & DispatchPropsTbody
  & OwnPropsTbody
);

export interface StateTbody {
}
