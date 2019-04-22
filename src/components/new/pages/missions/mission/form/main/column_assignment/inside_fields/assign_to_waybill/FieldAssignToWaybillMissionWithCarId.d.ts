import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import { DispatchProp } from 'react-redux';

export type StatePropsFieldAssignToWaybillMissionWithCarId = {
  carForMissionIndex: IStateMissions['missionData']['carsIndex'];
};

export type DispatchPropsPropsFieldAssignToWaybillMissionWithCarId = DispatchProp;
export type OwnPropsPropsFieldAssignToWaybillMissionWithCarId = {
  value: string;
  index: number;

  car_id: ValuesOf<Mission['car_ids']>;
  onChange: (index: number, value: string) => any;

  page: string;
};

export type PropsFieldAssignToWaybillMissionWithCarId = (
  StatePropsFieldAssignToWaybillMissionWithCarId
  & DispatchPropsPropsFieldAssignToWaybillMissionWithCarId
  & OwnPropsPropsFieldAssignToWaybillMissionWithCarId
);
