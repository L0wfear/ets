import { InitialStateDashboard } from 'components/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';
import {
  CurrentMissionsItemsSubItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

export interface StatePropsListByTypeCurerntMission {
  title: InitialStateDashboard['current_missions']['data']['title'];
  items: InitialStateDashboard['current_missions']['data']['items'];
}

export interface DispatchPropsListByTypeCurerntMission {
}

export interface OwnPropsListByTypeCurerntMission {
  titleKey: 'title_centralized' | 'title_decentralized';
  itemsKey: 'items_centralized' | 'items_decentralized';
  handleClick: (lastSubItem: CurrentMissionsItemsSubItemsSubItemsType) => any;
}

export type PropsListByTypeCurerntMission = (
  StatePropsListByTypeCurerntMission
  & DispatchPropsListByTypeCurerntMission
  & OwnPropsListByTypeCurerntMission
);

export type StateListByTypeCurerntMission = {};
