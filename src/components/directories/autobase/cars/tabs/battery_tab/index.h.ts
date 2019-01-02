import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type StatePropsBatteryTab = {
  actualBatteriesOnCarList: IStateAutobase['actualBatteriesOnCarList'];
};
export type DispatchPropsBatteryTab = {
  actualBatteriesOnCarGetAndSetInStore: any;
};
export type OwnPropsBatteryTab = {
  car_id: number;
  page: string;
  path?: string;
};
export type PropsBatteryTab = (
  StatePropsBatteryTab
  & DispatchPropsBatteryTab
  & OwnPropsBatteryTab
);
