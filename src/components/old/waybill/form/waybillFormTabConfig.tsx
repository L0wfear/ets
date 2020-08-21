// copy components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig.tsx

import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { isNullOrUndefined } from 'util';

export const TabBodyContainerStyled = styled(EtsBootstrap.Row)`
  border: 1px solid #ddd;
  border-top: none;
  /* border: 1px solid red; */
  box-shadow: rgba(0,0,0,0.1) 0px 1px 0px 0px, rgba(0,0,0,0.1) 0px 1px 15px 0px;
  margin-left: 15px;
  margin-right: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: 0px 0px 4px 4px;
`;

export type OneTabDataCommon = {
  tabKey: string;
  title: string;
  errorsFieldList?: Array<string>;
  showTabIntoNavFlagKey?: 'isGasKind' | 'isFuelKind' | 'isElectricityKind';
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

export const checkErrorsIntoTab = (errorsObj, errorsFieldList: Array<string>) => {
  const hasErrors = Object.entries(errorsObj).some(
    ([key, val]) => {
      
      if(errorsFieldList.includes(key) && Array.isArray(val)){
        return val.some(
          (el) => Object.values(el).some(
            (entryVal) => Boolean(entryVal) && !isNullOrUndefined(entryVal)
          )
        );
      }

      if( errorsFieldList.includes(key) && !isNullOrUndefined(val) && Boolean(val)) { // hasBag
        return true;
      }
      return false;
    }
  );
  return hasErrors;
};

export const fuelTab: OneTabData = { // Вкладка для топлива
  title: 'Топливо',
  tabKey: 'fuel',
  component: null,
  path: '', // выпилить, мы не будем мспользовать URl
  isRegistry: false,
  errorsFieldList: [
    'fuel_type',
    'fuel_end',
    'tax_consumption',
    'fuel_start',
    'fact_fuel_end',
    'fact_consumption',
    'fuel_given',
    'diff_consumption',
    'tax_data',
    'car_refill', // array of Objects, учесть
    'tax_data_rows', // array of Objects, учесть
  ],
  showTabIntoNavFlagKey: 'isFuelKind',
};

export const gasTab: OneTabData = { // Вкладка для газа
  title: 'Газ',
  tabKey: 'gas',
  component: null,
  path: '', // выпилить, мы не будем мспользовать URl
  isRegistry: false,
  errorsFieldList:[
    'gas_fuel_type',
    'gas_fuel_start',
    'gas_fuel_given',
    'gas_fuel_end',
    'gas_fact_fuel_end',
    'gas_tax_data',
    'gas_refill',
    'gas_tax_data_rows', // array of Objects, учесть
    'tax_consumption',
    'gas_fact_consumption',
    'gas_diff_consumption',
  ],
  showTabIntoNavFlagKey: 'isGasKind',
};
export const electricityTab: OneTabData = { // Вкладка для газа
  title: 'Электроэнергия',
  tabKey: 'electricity',
  component: null,
  path: '', // выпилить, мы не будем мспользовать URl
  isRegistry: false,
  errorsFieldList:[],
  showTabIntoNavFlagKey: 'isElectricityKind',
};

export const fuelKindFormTabKey: Array<OneTabData> = [
  fuelTab,
  gasTab,
  electricityTab,
];

export default fuelKindFormTabKey;
