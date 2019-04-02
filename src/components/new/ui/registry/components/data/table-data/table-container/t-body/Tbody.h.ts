import { DispatchProp } from 'react-redux';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export interface StatePropsTbody {
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
) & WithSearchProps;

export interface StateTbody {
}
