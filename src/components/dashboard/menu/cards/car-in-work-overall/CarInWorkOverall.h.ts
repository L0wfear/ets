import {
  CarInWorkOverallInfoDataType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';
import { InitialStateDashboard } from 'components/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';

export type StatePropsCarInOveral = {
  items: InitialStateDashboard['car_in_work_overall']['data']['items'];
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
