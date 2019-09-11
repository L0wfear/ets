import { ConfigType } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

export type StatePropsDefaultWaybill = {
  items: any[];
};

export type DispatchPropsDefaultWaybill = {
  setInfoData: (infoData: any) => any;
};

export type TypeConfigWithDefaultWaybill = ConfigType & {
  setInfoData: any;
  setInfoDataPropsMake: any;
  ListComponent: any;
};

export type PropsDefaultWaybill = StatePropsDefaultWaybill
  & DispatchPropsDefaultWaybill;
