import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { HandleThunkActionCreator } from 'react-redux';
import { registrySelectRow } from 'components/new/ui/registry/module/actions-registy';

export interface StatePropsTrTbody {
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  selectedUniqKey: OneRegistryData['list']['data']['uniqKey'] | null;
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  rowFields: OneRegistryData['list']['meta']['rowFields'];
  permissions: OneRegistryData['list']['permissions']['read'][];
  userData: InitialStateSession['userData'];
  buttons: OneRegistryData['header']['buttons'];
  row_double_click: OneRegistryData['list']['meta']['row_double_click'];

  checkData: any;
}

export type DipatchPropsTrTbody = {
  registrySelectRow: HandleThunkActionCreator<typeof registrySelectRow>;
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
