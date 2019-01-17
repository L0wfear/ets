import { MISSIONS_SET_DATA } from 'redux-main/reducers/modules/missions';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

export const missionsSetNewData = (newStateData: { [K in keyof IStateMissions]?: IStateMissions[K] }) => ({
  type: MISSIONS_SET_DATA,
  payload: newStateData,
});
