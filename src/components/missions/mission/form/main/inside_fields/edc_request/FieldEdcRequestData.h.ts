import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

export type StatePropsFieldEdcRequestData = {
};
export type DispatchPropsFieldEdcRequestData = {
};

export type OwnPropsFieldEdcRequestData = {
  request_id: Mission['request_id'];
  edcRequest: IStateMissions['missionData']['edcRequest'];
};

export type PropsFieldEdcRequestData = (
  StatePropsFieldEdcRequestData
  & DispatchPropsFieldEdcRequestData
  & OwnPropsFieldEdcRequestData
);
