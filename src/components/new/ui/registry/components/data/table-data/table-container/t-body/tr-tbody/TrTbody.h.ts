import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export interface StatePropsTrTbody {
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  selectedUniqKey: OneRegistryData['list']['data']['uniqKey'] | null;
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
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
  rowData: any;
  indexRow: number;
}

export type PropsTrTbody = (
  StatePropsTrTbody
  & DipatchPropsTrTbody
  & OwnPropsTrTbody
  & {
    isPermitted: boolean;
  } & WithSearchProps
);

export type StateTrTbody = {
};
