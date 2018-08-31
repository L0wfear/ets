import {
  DashboardService,
} from 'api/Services';

import * as defAns from 'components/dashboard/new/redux/modules/dashboard/mosk/defAns';
import {
  DASHBOARD_CHANGE_CART_DATA,
  DASHBOARD_CHANGE_IS_LOADING_IN_CART_DATA,
  DASHBOARD_SET_INFO_DATA,
} from 'components/dashboard/new/redux/modules/dashboard/dashboard';

export const dashboardSetIsLoadingForCardData = (path) => ({
  type: DASHBOARD_CHANGE_IS_LOADING_IN_CART_DATA,
  payload: {
    path,
  },
});
import { loadMissionDataById } from 'redux/trash-actions/mission';
import { loadRouteDataById } from 'redux/trash-actions/route/route';

export const dashboardLoadMissionDataForCurrentMission = (id?) => (dispatch) => {
  dispatch({
    type: DASHBOARD_SET_INFO_DATA,
    payload: {
      path: 'current_missions',
      infoData: null,
    }
  });

  if (id) {
    const loadMissionDataOption = loadMissionDataById(
      DASHBOARD_SET_INFO_DATA,
      id,
    );

    loadMissionDataOption.payload.then(({ mission_data }) => (
      dispatch({
        ...loadMissionDataOption,
        payload: {
          path: 'current_missions',
          infoData: mission_data,
        },
      })
    ));
  }
};

export const dashboardLoadRouteDataForCurrentDutyMissions = (duty_mission_data?, id?) => (dispatch) => {
  dispatch({
    type: DASHBOARD_SET_INFO_DATA,
    payload: {
      path: 'current_duty_missions',
      infoData: null,
    }
  });

  if (id) {
    const loadRouteDataOption = loadRouteDataById(
      DASHBOARD_SET_INFO_DATA,
      id,
    );

    loadRouteDataOption.payload.then(({ route_data }) => (
      dispatch({
        ...loadRouteDataOption,
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

export const dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift = (infoData = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'odh_not_covered_by_missions_of_current_shift',
    infoData,
  },
});

export const dashboardSetInfoDataInOdhNotCoveredByRoutes = (infoData = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'odh_not_covered_by_routes',
    infoData,
  },
});

export const dashboardSetInfoDataInOdhCoveredByRoutes = (infoData = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'odh_covered_by_routes',
    infoData,
  },
});

export const dashboardSetInfoDataInCarInWorkOverall = (infoData = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'car_in_work_overall',
    infoData,
  },
});

export const dashboardSetInfoDataInFaxogramms = (infoData = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'faxogramms',
    infoData,
  },
});

export const dashboardSetInfoDataInWaybillDraft = (infoData = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'waybill_draft',
    infoData,
  },
});

export const dashboardSetInfoDataInWaybillInProgress = (infoData = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'waybill_in_progress',
    infoData,
  },
});

export const dashboardSetInfoDataInWaybillCompleted = (infoData = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'waybill_completed',
    infoData,
  },
});

export const dashboardSetInfoDataInWaybillClosed = (infoData = null) => ({
  type: DASHBOARD_SET_INFO_DATA,
  payload: {
    path: 'waybill_closed',
    infoData,
  },
});


export const dashboardLoadCardData = (path, payload = {}) => ({
  type: DASHBOARD_CHANGE_CART_DATA,
  payload: path.split('/').reduce((ApiService, path) => ApiService.path(path), DashboardService)
    .get(payload)
    .catch(e => {
      console.warn(e);

      return {
        result: defAns[path.split('/').join('_')],
      };
    })
    .then(({ result }) => new Promise(res => (
      setTimeout(() => {
        res({
          [path.split('/').join('_')]: result,
        })
      }, 500)
    ))
  )
});

export const dashboardLoadCardDataByPath = (path) => (dispatch) => {
  dispatch(dashboardSetIsLoadingForCardData(path.split('/').join('_')))
  dispatch(dashboardLoadCardData(path));
}


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

export const dashboardLoadFaxogramms = () => (
  dashboardLoadCardDataByPath('faxogramms')
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

export const dashboardLoadDependentDataByWaybillDraft = () => (dispatch) => {
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

export const dashboardLoadDependentDataByNewMission = () => (dispatch) => {
  dispatch(dashboardLoadWaybillDraft());
  dispatch(dashboardLoadFutureMissions());
  dispatch(dashboardLoadCurrentMissions());
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift());
  dispatch(dashboardLoadOdhNotCoveredByRoutes());
  dispatch(dashboardLoadOdhCoveredByRoutes());
  dispatch(dashboardLoadCarInWorkOverall());
};

export const dashboardLoadDependentDataByNewDutyMission = () => (dispatch) => {
  dispatch(dashboardLoadCurrentDutyMissions());
  dispatch(dashboardLoadFutureMissions());
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift());
  dispatch(dashboardLoadOdhNotCoveredByRoutes());
  dispatch(dashboardLoadOdhCoveredByRoutes());
};