import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type StatePropsTireTab = {
  actualTiresOnCarList: IStateAutobase['actualTiresOnCarList'];
};
export type DispatchPropsTireTab = {
  actualTiresOnCarGetAndSetInStore: any;
};
export type OwnPropsTireTab = {
  car_id: number;
  page: string;
  path?: string;
};
export type PropsTireTab = (
  StatePropsTireTab
  & DispatchPropsTireTab
  & OwnPropsTireTab
);
