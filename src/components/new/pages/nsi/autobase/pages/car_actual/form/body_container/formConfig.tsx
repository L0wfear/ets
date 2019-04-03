import * as React from 'react';
import memoizeOne from 'memoize-one';
import { get } from 'lodash';

import insurancePolicyListConfig from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data';

import roadAccidentListConfig from 'components/new/pages/nsi/autobase/pages/road_accident/_config-data';

import repairListConfig from 'components/new/pages/nsi/autobase/pages/repair/_config-data';

import techInspectionListConfig from 'components/new/pages/nsi/autobase/pages/tech_inspection/_config-data';

export type OneTabDataCommon = {
  tabKey: string;
  title: string;
};

export type OneTabDataParent = (
  OneTabDataCommon
  & {
    children: OneTabDataComponent[];
  }
);

export type OneTabDataComponent = (
  OneTabDataCommon
  & {
    component: any;
    path: string;
  }
);

export type OneTabData = (
  OneTabDataParent
  | OneTabDataComponent
);

export const mainInfo: OneTabData = {
  title: 'Общая информация',
  tabKey: 'mainInfo',
  component: 'div',
  path: 'id',
};

const registerInfo: OneTabData = {
  title: 'Информация о регистрации',
  tabKey: 'registerInfo',
  component: 'div',
  path: 'id',
};

const passportInfo: OneTabData = {
  title: 'Паспорт ТС',
  tabKey: 'passportInfo',
  component: 'div',
  path: 'id',
};

const main: OneTabData = {
  tabKey: 'main',
  title: 'Информация',
  children: [
    mainInfo,
    registerInfo,
    passportInfo,
  ],
};

const battaryInfo: OneTabData = {
  title: 'Аккумуляторы',
  tabKey: 'battaryInfo',
  component: 'div',
  path: 'id',
};

const tireInfo: OneTabData = {
  title: 'Шины',
  tabKey: 'tireInfo',
  component: 'div',
  path: 'id',
};

const insurancePolicy: OneTabData = {
  title: 'Страхование',
  tabKey: insurancePolicyListConfig.item,
  component: insurancePolicyListConfig.component,
  path: `${insurancePolicyListConfig.patrialEndPath}`,
};

const roadAccident: OneTabData = {
  title: 'ДТП',
  tabKey: roadAccidentListConfig.item,
  component: roadAccidentListConfig.component,
  path: roadAccidentListConfig.patrialEndPath,
};

const techMaintenance: OneTabData = {
  title: 'Тех. обслуживание',
  tabKey: 'techMaintenance',
  component: 'div',
  path: 'id',
};

const repair: OneTabData = {
  title: 'Ремонты ТС',
  tabKey: repairListConfig.item,
  component: repairListConfig.component,
  path: repairListConfig.patrialEndPath,
};

const tmAndR: OneTabData = {
  title: 'ТО и ремонты',
  tabKey: 'tmAndR',
  children: [
    techMaintenance,
    repair,
  ],
};

const techInspection: OneTabData = {
  title: 'Техосмотр',
  tabKey: techInspectionListConfig.item,
  component: techInspectionListConfig.component, // car_id
  path: techInspectionListConfig.patrialEndPath,
};

const carFormTabKey: OneTabData[] = [
  main,
  battaryInfo,
  tireInfo,
  insurancePolicy,
  roadAccident,
  tmAndR,
  techInspection,
];

export const componentsInArray = carFormTabKey.reduce(
  (newArr: OneTabDataComponent[], tabData) => {
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

export default carFormTabKey;
