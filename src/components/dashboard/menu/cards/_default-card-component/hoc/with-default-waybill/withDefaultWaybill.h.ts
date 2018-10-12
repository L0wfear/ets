import { ConfigType } from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

export type StatePropsDefaultWaybill = {
  items: any[];
};

export type DispatchPropsDefaultWaybill = {
  setInfoData: (infoData: any) => any;
};

export type TypeConfigWithDefaultWaybill = ConfigType & {
  setInfoData: Function;
  setInfoDataPropsMake: Function;
  ListComponent: any;
};

export type PropsDefaultWaybill = StatePropsDefaultWaybill
  & DispatchPropsDefaultWaybill;
};
