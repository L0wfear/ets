// copy components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig.tsx
// key === 'fuelKind'
// import * as React from 'react';
// import memoizeOne from 'memoize-one';
// import { get } from 'lodash';
import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const TabBodyContainerStyled = styled(EtsBootstrap.Row)`
  border: 1px solid #ddd;
  border-top: none;
  /* border: 1px solid red; */

  margin-left: 15px;
  margin-right: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: 0px 0px 4px 4px;
`;

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

export const fuelTab: OneTabData = { // Вкладка для топлива
  title: 'Топливо',
  tabKey: 'fuel',
  component: null,
  path: '', // выпилить, мы не будем мспользовать URl
  isRegistry: false,
};

export const gasTab: OneTabData = { // Вкладка для газа
  title: 'Газ',
  tabKey: 'gas',
  component: null,
  path: '', // выпилить, мы не будем мспользовать URl
  isRegistry: false,
};
export const electricityTab: OneTabData = { // Вкладка для газа
  title: 'Электроэнергия',
  tabKey: 'electricity',
  component: null,
  path: '', // выпилить, мы не будем мспользовать URl
  isRegistry: false,
};

const fuelKindFormTabKey: Array<OneTabData> = [
  fuelTab,
  gasTab,
  electricityTab,
];

export default fuelKindFormTabKey;
