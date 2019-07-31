import { InitialStateDashboard } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { HandleThunkActionCreator } from 'react-redux';
import { actionMonitorPageLoadCarActual } from 'components/old/monitor/redux-main/models/actions-monitor-page';
import { dashboardSetInfoDataInCarInWorkOverall } from '../../../redux-main/modules/dashboard/actions-dashboard';

export type StatePropsCarInOveral = {
  items: InitialStateDashboard['car_in_work_overall']['data']['items'];
  points_ws: InitialStateSession['appConfig']['points_ws'];
  token: InitialStateSession['token'];
  carActualGpsNumberIndex: any;
};
export type DispatchPropsCarInOveral = {
  setInfoData: HandleThunkActionCreator<typeof dashboardSetInfoDataInCarInWorkOverall>;
  actionMonitorPageLoadCarActual: HandleThunkActionCreator<typeof actionMonitorPageLoadCarActual>;
};
export type OwnPropsCarInOveral = {};

export type PropsCarInWorkOverall = StatePropsCarInOveral &
  DispatchPropsCarInOveral &
  OwnPropsCarInOveral;

export type StateCarInWorkOverall = {
  ws: any;
  carsTrackState: any;
  countNotInTouch: number | {};
};
