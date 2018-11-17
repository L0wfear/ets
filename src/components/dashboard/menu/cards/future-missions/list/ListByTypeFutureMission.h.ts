import { InitialStateDashboard } from 'components/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';

export interface StatePropsFutureMissionsList {
  title: InitialStateDashboard['future_missions']['data']['title_centralized'] | InitialStateDashboard['future_missions']['data']['title_decentralized'];
  items: InitialStateDashboard['future_missions']['data']['items_centralized'] | InitialStateDashboard['future_missions']['data']['items_decentralized'];
}

export interface DispatchPropsFutureMissionsList {
}

export interface OwnPropsFutureMissionsList {
  titleKey: 'title_centralized' | 'title_decentralized';
  itemsKey: 'items_centralized' | 'items_decentralized';
  handleClick: (id: number) => any;
}

export type PropsListByTypeMission = (
  StatePropsFutureMissionsList
  & DispatchPropsFutureMissionsList
  & OwnPropsFutureMissionsList
);

export interface StateListByTypeMission {
}
