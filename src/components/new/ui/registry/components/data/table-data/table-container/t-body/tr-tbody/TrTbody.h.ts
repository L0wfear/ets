import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';

export interface StatePropsTrTbody {
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  selectedUniqKey: OneRegistryData['list']['data']['uniqKey'] | null;
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  rowFields: OneRegistryData['list']['meta']['rowFields'];
  permissions: OneRegistryData['list']['permissions']['read'][];
  userData: InitialStateSession['userData'];
  buttons: OneRegistryData['header']['buttons'];
}

export type DipatchPropsTrTbody = {
  registryHandleClickOnRow: any;
};

export interface OwnPropsTrTbody {
  registryKey: string;
  rowData: object;
  components?: any;
  indexRow: number;
  handleClickOnRow: any;
  handleDoubleClickOnRow: any;
}

export type PropsTrTbody = (
  StatePropsTrTbody
  & DipatchPropsTrTbody
  & OwnPropsTrTbody
  & {
    isPermitted: boolean;
  }
) & WithSearchProps;

export type StateTrTbody = {
};
