import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const TabBodyContainerStyled = styled(EtsBootstrap.Row as any)<{ showComponent?: boolean; }>`
  border: 1px solid #ddd;
  border-top: none;
  /* border: 1px solid red; */
  box-shadow: rgba(0,0,0,0.1) 0px 1px 0px 0px, rgba(0,0,0,0.1) 0px 1px 15px 0px;
  margin-left: 0px;
  margin-right: 0px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: 0px 0px 4px 4px;
  display: ${({ showComponent }) => showComponent ? 'block' : 'none'};
`;

export type OneTabDataCommon = {
  tabKey: string;
  title: string;
  errorsFieldList?: Array<string>;
  showTabIntoNavFlagKey?: 'isVehicle' | 'isRefill';
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

export const vehicleTab: OneTabData = { // Вкладка - Привязанные транспортные средства
  title: 'Привязка ТС',
  tabKey: 'vehicle',
  component: null,
  path: '', // выпилить, мы не будем использовать URl
  isRegistry: false,
  errorsFieldList: [
    'fuel_card_on_cars'
  ],
  showTabIntoNavFlagKey: 'isVehicle',
};

export const refillTab: OneTabData = { // Вкладка - Заправки
  title: 'Заправки',
  tabKey: 'refill',
  component: null,
  path: '', // выпилить, мы не будем использовать URl
  isRegistry: false,
  errorsFieldList:[
  ],
  showTabIntoNavFlagKey: 'isRefill',
};

export const fuelCardsFormTabKey: Array<OneTabData> = [
  vehicleTab,
  refillTab,
];

export default fuelCardsFormTabKey;
