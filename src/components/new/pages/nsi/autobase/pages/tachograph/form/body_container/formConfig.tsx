import * as React from 'react';
import memoizeOne from 'memoize-one';
import { get } from 'lodash';

import infoTabConfig from 'components/new/pages/nsi/autobase/pages/tachograph/form/body_container/local_registry/info/_config-data';

import tachographDataReadingConfig from 'components/new/pages/nsi/autobase/pages/tachograph/form/body_container/local_registry/tachograph_data_reading/_config-data';
import tachographMetrologicalVerificationConfig from 'components/new/pages/nsi/autobase/pages/tachograph/form/body_container/local_registry/tachograph_metrological_verification/_config-data';
import tachographPeriodicVerificationConfig from 'components/new/pages/nsi/autobase/pages/tachograph/form/body_container/local_registry/tachograph_periodic_verification/_config-data';
import tachographSkziConfig from 'components/new/pages/nsi/autobase/pages/tachograph/form/body_container/local_registry/tachograph_replacement_skzi/_config-data';
import tachographRepairConfig from 'components/new/pages/nsi/autobase/pages/tachograph/form/body_container/local_registry/tachograph_repair/_config-data';

export type OneTabDataCommon = {
  tabKey: string;
  title: string;
};

export type OneTabDataParent = (
  OneTabDataCommon
  & {
    children: Array<OneTabDataComponent>;
  }
);

export type OneTabDataComponent = (
  OneTabDataCommon
  & {
    component: any;
    path: string;
    isRegistry: boolean;
  }
);

export type OneTabData = (
  OneTabDataParent
  | OneTabDataComponent
);

export const main: OneTabData = {
  title: 'Информация',
  tabKey: infoTabConfig.item,
  component: infoTabConfig.component,
  path: infoTabConfig.id,
  isRegistry: false,
};

export const tachographDataReadingInfo: OneTabData = {
  title: 'Считывание данных',
  tabKey: tachographDataReadingConfig.item,
  component: tachographDataReadingConfig.component,
  path: tachographDataReadingConfig.id,
  isRegistry: false,
};

export const tachographPeriodicVerificationtInfo: OneTabData = {
  title: 'Калибровка',
  tabKey: tachographPeriodicVerificationConfig.item,
  component: tachographPeriodicVerificationConfig.component,
  path: `/:${tachographPeriodicVerificationConfig.id}?`,
  isRegistry: true,
};

export const tachographMetrologicalVerification: OneTabData = {
  title: 'Метрологическая поверка',
  tabKey: tachographMetrologicalVerificationConfig.item,
  component: tachographMetrologicalVerificationConfig.component,
  path: `/:${tachographMetrologicalVerificationConfig.id}?`,
  isRegistry: true,
};

export const tachographSkzi: OneTabData = {
  title: 'Блок СКЗИ',
  tabKey: tachographSkziConfig.item,
  component: tachographSkziConfig.component,
  path: tachographSkziConfig.id,
  isRegistry: false,
};

export const tachographRepairInfo: OneTabData = {
  title: 'Ремонт',
  tabKey: tachographRepairConfig.item,
  component: tachographRepairConfig.component,
  path: `/:${tachographRepairConfig.id}?`,
  isRegistry: true,
};

const tachographFormTabKey: Array<OneTabData> = [
  main,
  tachographDataReadingInfo,
  tachographPeriodicVerificationtInfo,
  tachographMetrologicalVerification,
  tachographSkzi,
  tachographRepairInfo,
];

export const componentsInArray = tachographFormTabKey.reduce(
  (newArr: Array<OneTabDataComponent>, tabData) => {
    if ('children' in tabData) {
      tabData.children.forEach((tabDataChild) => {
        newArr.push(tabDataChild);
      });
    } else {
      newArr.push(tabData);
    }

    return newArr;
  },
  [],
);

export const findSelectedTabKeyComponent = memoizeOne(
  (tabKeyOwn: string): React.ElementType | false => {
    return get(componentsInArray.find(({ tabKey }) => tabKey === tabKeyOwn), 'component', false);
  },
);

export default tachographFormTabKey;
