import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DispatchProp } from 'react-redux';

export type StatePropsTechMaintTab = {
  techMaintExtra: IStateAutobase['techMaintExtra'];
};
export type DispatchPropsTechMaintTab = DispatchProp;
export type OwnPropsTechMaintTab = {
  type: boolean;
  car_id: number;
  car_model_id: number;
  gov_number: string;
};

export type PropsTechMaintTab = (
  StatePropsTechMaintTab
  & DispatchPropsTechMaintTab
  & OwnPropsTechMaintTab
);
