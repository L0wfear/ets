import {
  DashboardService,
} from 'api/Services';

import * as defAns from 'components/dashboard/redux-main/modules/dashboard/mosk/defAns';
import {
  DASHBOARD_RESET,
  DASHBOARD_CHANGE_CART_DATA,
  DASHBOARD_CHANGE_IS_LOADING_IN_CART_DATA,
  DASHBOARD_SET_INFO_DATA,
} from 'components/dashboard/redux-main/modules/dashboard/dashboard';

import { OdhNotCoveredByMissionsOfCurrentShiftInfoDataType } from 'components/dashboard/redux-main/modules/dashboard/@types/odh-not-covered-by-missions-of-current-shift.h';
import { OdhNotCoveredByRoutesInfoDataType } from 'components/dashboard/redux-main/modules/dashboard/@types/odh-not-covered-by-routes.h';
import { OdhCoveredByRoutesInfoDataType } from 'components/dashboard/redux-main/modules/dashboard/@types/odh-covered-by-routes.h';
import { CarInWorkOverallInfoDataType } from 'components/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';
import { FaxogrammsInfoDataType } from 'components/dashboard/redux-main/modules/dashboard/@types/faxogramms.h';
import { CurrentDutyMissionsItemsSubItemDatasType } from 'components/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';
import { WaybillDraftInfoDataType } from 'components/dashboard/redux-main/modules/dashboard/@types/waibill-draft.h';
import { WaybillInProgressInfoDataType} from 'components/dashboard/redux-main/modules/dashboard/@types/waibill-in-progress.h';
import { WaybillCompletedInfoDataType } from 'components/dashboard/redux-main/modules/dashboard/@types/waibill-completed.h';
import { WaybillClosedInfoDataType } from 'components/dashboard/redux-main/modules/dashboard/@types/waibill-closed.h';

import { loadMissionDataById } from 'redux-main/trash-actions/mission';
import { loadRouteDataById } from 'redux-main/trash-actions/route/route';

export const dashboardSetIsLoadingForCardData = (path) => ({
  type: DASHBOARD_CHANGE_IS_LOADING_IN_CART_DATA,
  payload: {
    path,
  },
});

export const dashBoardResetData: Function = () => ({
  type: DASHBOARD_RESET,
  payload: {},
});

export const dashboardLoadMissionDataForCurrentMission: (id?: number) => any = (id) => (dispatch) => {
  dispatch({
    type: DASHBOARD_SET_INFO_DATA,
    payload: {
      path: 'current_missions',
      infoData: null,
    },
  });

  if (id) {
    dispatch(
      loadMissionDataById(
        'none',
        id,
        {
          promise: true,
          page: 'dashboard',
        },
      ),
    ).then(({ payload: { mission_data } }) => (
      dispatch({
        type: DASHBOARD_SET_INFO_DATA,
        payload: {
          path: 'current_missions',
          infoData: mission_data,
        },
      })
    ));
  }
};

export const dashboardLoadRouteDataForCurrentDutyMissions: Function = (duty_mission_data?: CurrentDutyMissionsItemsSubItemDatasType, id?: number) => (dispatch) => {
  dispatch({
    type: DASHBOARD_SET_INFO_DATA,
    payload: {
      path: 'current_duty_missions',
      infoData: null,
    },
  });

  if (id) {
    dispatch(
      loadRouteDataById(
        'none',
        id,
        {
          promise: true,
          page: 'dashboard',
        },
      ),
    ).then(({ payload: { route_data } }) => (
      dispatch({
        type: DASHBOARD_SET_INFO_DATA,
        payload: {
          path: 'current_duty_missions',
          infoData: {
            duty_mission_data: {
              ...duty_mission_data,
            },
            ...route_data,
          },
        },
      })
    ));
  }
};

export const dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift = (infoData: OdhNotCoveredByMissionsOfCurrentShiftInfoDataType = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'odh_not_covered_by_missions_of_current_shift',
    infoData,
  },
});

export const dashboardSetInfoDataInOdhNotCoveredByRoutes = (infoData: OdhNotCoveredByRoutesInfoDataType = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'odh_not_covered_by_routes',
    infoData,
  },
});

export const dashboardSetInfoDataInOdhCoveredByRoutes = (infoData: OdhCoveredByRoutesInfoDataType = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'odh_covered_by_routes',
    infoData,
  },
});

export const dashboardSetInfoDataInCarInWorkOverall = (infoData: CarInWorkOverallInfoDataType = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'car_in_work_overall',
    infoData,
  },
});

export const dashboardSetInfoDataInFaxogramms = (infoData: FaxogrammsInfoDataType = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'faxogramms',
    infoData,
  },
});

export const dashboardSetInfoDataInWaybillDraft = (infoData: WaybillDraftInfoDataType = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'waybill_draft',
    infoData,
  },
});

export const dashboardSetInfoDataInWaybillInProgress = (infoData: WaybillInProgressInfoDataType = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'waybill_in_progress',
    infoData,
  },
});

export const dashboardSetInfoDataInWaybillCompleted = (infoData: WaybillCompletedInfoDataType = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'waybill_completed',
    infoData,
  },
});

export const dashboardSetInfoDataInWaybillClosed = (infoData: WaybillClosedInfoDataType = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'waybill_closed',
    infoData,
  },
});

export const dashboardLoadCardData = (path: string, payload = {}) => ({
  type: DASHBOARD_CHANGE_CART_DATA,
  payload: (defAns.backEndKeys[path] || path).split('/').reduce((ApiService, pathPart) => ApiService.path(pathPart), DashboardService)
    .get(payload)
    .catch(e => {
      console.warn(e);

      return {
        result: defAns[path.split('/').join('_')],
      };
    })
    .then(({ result }) => ({
      [path.split('/').join('_')]: result,
    }),
  ),
});

export const dashboardLoadCardDataByPath = (path, payload?) => (dispatch) => {
  dispatch(dashboardSetIsLoadingForCardData(path.split('/').join('_')));
  return dispatch(dashboardLoadCardData(path, payload));
};

export const dashboardLoadCurrentMissions = () => (
  dashboardLoadCardDataByPath('current_missions')
);

export const dashboardLoadFutureMissions = () => (
  dashboardLoadCardDataByPath('future_missions')
);

export const dashboardLoadOdhNotCoveredByMissionsOfCurrentShift = () => (
  dashboardLoadCardDataByPath('odh_not_covered_by_missions_of_current_shift')
);

export const dashboardLoadOdhNotCoveredByRoutes = () => (
  dashboardLoadCardDataByPath('odh_not_covered_by_routes')
);

export const dashboardLoadOdhCoveredByRoutes = () => (
  dashboardLoadCardDataByPath('odh_covered_by_routes')
);

export const dashboardLoadCarInWorkOverall = () => (
  dashboardLoadCardDataByPath('car_in_work_overall')
);

export const dashboardLoadOrders = () => (
  dashboardLoadCardDataByPath(
    'faxogramms',
    {
      status: 2,
    },
  )
);

export const dashboardLoadCurrentDutyMissions = () => (
  dashboardLoadCardDataByPath('current_duty_missions')
);

export const dashboardLoadWaybillDraft = () => (
  dashboardLoadCardDataByPath('waybill/draft')
);
export const dashboardLoadWaybillInProgress = () => (
  dashboardLoadCardDataByPath('waybill/in_progress')
);
export const dashboardLoadWaybillCompleted = () => (
  dashboardLoadCardDataByPath('waybill/completed')
);
export const dashboardLoadWaybillClosed = () => (
  dashboardLoadCardDataByPath('waybill/closed')
);

export const dashboardLoadAllWaybill = () => (dispatch) => {
  dispatch(dashboardLoadWaybillDraft());
  dispatch(dashboardLoadWaybillInProgress());
  dispatch(dashboardLoadWaybillCompleted());
  dispatch(dashboardLoadWaybillClosed());
};

export const dashboardLoadDependentDataByWaybillDraft: Function = () => (dispatch) => {
  dispatch(dashboardLoadWaybillDraft());
  dispatch(dashboardLoadFutureMissions());
  dispatch(dashboardLoadWaybillInProgress());
  dispatch(dashboardLoadCurrentMissions());
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift());
  dispatch(dashboardLoadOdhNotCoveredByRoutes());
  dispatch(dashboardLoadOdhCoveredByRoutes());
  dispatch(dashboardLoadCarInWorkOverall());
};

export const dashboardLoadDependentDataByWaybillInProgress = () => (dispatch) => {
  dispatch(dashboardLoadWaybillClosed());
  dispatch(dashboardLoadFutureMissions());
  dispatch(dashboardLoadCurrentMissions());
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift());
  dispatch(dashboardLoadOdhNotCoveredByRoutes());
  dispatch(dashboardLoadOdhCoveredByRoutes());
  dispatch(dashboardLoadCarInWorkOverall());
};

export const dashboardLoadDependentDataByWaybillCompleted = () => (dispatch) => {
  dispatch(dashboardLoadWaybillClosed());
  dispatch(dashboardLoadFutureMissions());
  dispatch(dashboardLoadCurrentMissions());
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift());
  dispatch(dashboardLoadOdhNotCoveredByRoutes());
  dispatch(dashboardLoadOdhCoveredByRoutes());
  dispatch(dashboardLoadCarInWorkOverall());
};

export const dashboardLoadDependentDataByNewMission: Function = () => (dispatch) => {
  dispatch(dashboardLoadWaybillDraft());
  dispatch(dashboardLoadFutureMissions());
  dispatch(dashboardLoadCurrentMissions());
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift());
  dispatch(dashboardLoadOdhNotCoveredByRoutes());
  dispatch(dashboardLoadOdhCoveredByRoutes());
  dispatch(dashboardLoadCarInWorkOverall());
};

export const dashboardLoadDependentDataByNewDutyMission: Function = () => (dispatch) => {
  dispatch(dashboardLoadCurrentDutyMissions());
  dispatch(dashboardLoadFutureMissions());
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift());
  dispatch(dashboardLoadOdhNotCoveredByRoutes());
  dispatch(dashboardLoadOdhCoveredByRoutes());
};
