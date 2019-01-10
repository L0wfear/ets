import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export interface StatePropsTrTbody {
  selectedUniqKey: OneRegistryData['list']['data']['uniqKey'] | null;
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  rowFields: OneRegistryData['list']['meta']['rowFields'];
  permissions: OneRegistryData['list']['permissions']['read'];
  userData: InitialStateSession['userData'];
}

export type DipatchPropsTrTbody = {
  registryHandleClickOnRow: any;
  registryHandleDoubleClickOnRow: any;
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
);

export type StateTrTbody = {
};
