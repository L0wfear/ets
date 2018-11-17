import { InitialStateDashboard } from 'components/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';
import {
  CurrentDutyMissionsItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

export interface StatePropsListByTypeCurrentDutyMission {
  title: InitialStateDashboard['current_duty_missions']['data']['title'];
  items: InitialStateDashboard['current_duty_missions']['data']['items'];
}

export type DispatchPropsListByTypeCurrentDutyMission {
};

export interface OwnPropsListByTypeCurrentDutyMission {
  titleKey: 'title_centralized' | 'title_decentralized';
  itemsKey: 'items_centralized' | 'items_decentralized';
  handleClick: (lastSubItem: CurrentDutyMissionsItemsSubItemsType) => any;
}

export type PropsListByTypeCurrentDutyMission = (
  StatePropsListByTypeCurrentDutyMission
  & DispatchPropsListByTypeCurrentDutyMission
  & OwnPropsListByTypeCurrentDutyMission
);

export type StateListByTypeCurrentDutyMission = {};
