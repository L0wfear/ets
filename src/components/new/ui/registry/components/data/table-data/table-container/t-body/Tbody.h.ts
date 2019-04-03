import { DispatchProp } from 'react-redux';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

export interface StatePropsTbody {
  showArray: OneRegistryData['list']['processed']['processedArray'];
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
