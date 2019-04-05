import * as React from 'react';
import memoizeOne from 'memoize-one';
import { get } from 'lodash';

import infoTabConfig from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/_config-data';

import actualBatteriesOnCarListConfig from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_batteries_on_car/_config-data';
import actualTiresOnCarListConfig from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_tires_on_car/_config-data';
import insurancePolicyListConfig from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data';
import roadAccidentListConfig from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/_config-data';
import techMaintenanceListConfig from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/_config-data';
import repairListConfig from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/repair/_config-data';
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
    isRegistry: boolean;
  }
);

export type OneTabData = (
  OneTabDataParent
  | OneTabDataComponent
);

export const mainInfo: OneTabData = {
  title: 'Общая информация',
  tabKey: infoTabConfig.item,
  component: infoTabConfig.component,
  path: infoTabConfig.patrialEndPath,
  isRegistry: false,
};

const registerInfo: OneTabData = {
  title: 'Информация о регистрации',
  tabKey: 'registerInfo',
  component: 'div',
  path: 'id',
  isRegistry: false,
};

const passportInfo: OneTabData = {
  title: 'Паспорт ТС',
  tabKey: 'passportInfo',
  component: 'div',
  path: 'id',
  isRegistry: false,
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
  tabKey: actualBatteriesOnCarListConfig.item,
  component: actualBatteriesOnCarListConfig.component,
  path: actualBatteriesOnCarListConfig.patrialEndPath,
  isRegistry: true,
};

const tireInfo: OneTabData = {
  title: 'Шины',
  tabKey: actualTiresOnCarListConfig.item,
  component: actualTiresOnCarListConfig.component,
  path: actualTiresOnCarListConfig.patrialEndPath,
  isRegistry: true,
};

const insurancePolicy: OneTabData = {
  title: 'Страхование',
  tabKey: insurancePolicyListConfig.item,
  component: insurancePolicyListConfig.component,
  path: insurancePolicyListConfig.patrialEndPath,
  isRegistry: true,
};

const roadAccident: OneTabData = {
  title: 'ДТП',
  tabKey: roadAccidentListConfig.item,
  component: roadAccidentListConfig.component,
  path: roadAccidentListConfig.patrialEndPath,
  isRegistry: true,
};

const techMaintenance: OneTabData = {
  title: 'Тех. обслуживание',
  tabKey: techMaintenanceListConfig.item,
  component: techMaintenanceListConfig.component,
  path: techMaintenanceListConfig.patrialEndPath,
  isRegistry: true,
};

const repair: OneTabData = {
  title: 'Ремонты ТС',
  tabKey: repairListConfig.item,
  component: repairListConfig.component,
  path: repairListConfig.patrialEndPath,
  isRegistry: true,
};

const tmAndR: OneTabData = {
  title: 'ТО и ремонты',
  tabKey: 'tmAndR',
  children: [
    techMaintenance,
    repair,
  ],
  isRegistry: true,
};

const techInspection: OneTabData = {
  title: 'Техосмотр',
  tabKey: techInspectionListConfig.item,
  component: techInspectionListConfig.component, // car_id
  path: techInspectionListConfig.patrialEndPath,
  isRegistry: true,
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
