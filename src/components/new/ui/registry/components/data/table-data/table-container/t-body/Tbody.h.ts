import { DispatchProp } from 'react-redux';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

export interface StatePropsTbody {
  Service: any;
  processedArray: OneRegistryData['list']['processed']['processedArray'];
  paginator: OneRegistryData['list']['paginator'];
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
}

export type DispatchPropsTbody = DispatchProp;

export interface OwnPropsTbody {
  registryKey: string;
  components?: any;
  handleClickOnRow: any;
  handleDoubleClickOnRow: any;
}

export type PropsTbody = (
  StatePropsTbody
  & DispatchPropsTbody
  & OwnPropsTbody
);

export interface StateTbody {
}
