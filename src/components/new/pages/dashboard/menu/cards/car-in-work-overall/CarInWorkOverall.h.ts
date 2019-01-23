import {
  CarInWorkOverallInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';
import { InitialStateDashboard } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';

export type StatePropsCarInOveral = {
  items: InitialStateDashboard['car_in_work_overall']['data']['items'];
};
export type DispatchPropsCarInOveral = {
  setInfoData: (infoData: CarInWorkOverallInfoDataType) => any;
};
export type OwnPropsCarInOveral = {
};

export type PropsCarInWorkOverall = (
  StatePropsCarInOveral
  & DispatchPropsCarInOveral
  & OwnPropsCarInOveral
);

export type StateCarInWorkOverall = {
};
