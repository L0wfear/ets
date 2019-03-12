import {
  CarInWorkOverallInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';
import { InitialStateDashboard } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type StatePropsCarInOveral = {
  items: InitialStateDashboard['car_in_work_overall']['data']['items'];
  points_ws: InitialStateSession['appConfig']['points_ws'];
  token: InitialStateSession['token'];
  carActualGpsNumberIndex: any;
};
export type DispatchPropsCarInOveral = {
  setInfoData: (infoData: CarInWorkOverallInfoDataType) => any;
  loadCarActualIndex: any;
};
export type OwnPropsCarInOveral = {
};

export type PropsCarInWorkOverall = (
  StatePropsCarInOveral
  & DispatchPropsCarInOveral
  & OwnPropsCarInOveral
);

export type StateCarInWorkOverall = {
  ws: any;
  carsTrackState: any;
  countNotInTouch: number | {};
};
