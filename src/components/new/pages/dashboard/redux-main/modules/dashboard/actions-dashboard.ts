import {
  DashboardService,
} from 'api/Services';

import * as defAns from 'components/new/pages/dashboard/redux-main/modules/dashboard/mosk/defAns';
import {
  DASHBOARD_RESET,
  DASHBOARD_CHANGE_CART_DATA,
  DASHBOARD_CHANGE_IS_LOADING_IN_CART_DATA,
  DASHBOARD_SET_INFO_DATA,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/dashboard';

import { OdhNotCoveredByMissionsOfCurrentShiftInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-not-covered-by-missions-of-current-shift.h';
import { OdhNotCoveredByRoutesInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-not-covered-by-routes.h';
import { OdhCoveredByRoutesInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-covered-by-routes.h';
import { CarInWorkOverallInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';
import { FaxogrammsInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/faxogramms.h';
import { CurrentDutyMissionsItemsSubItemDatasType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';
import { WaybillDraftInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-draft.h';
import { WaybillInProgressInfoDataType} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-in-progress.h';
import { WaybillCompletedInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-completed.h';
import { WaybillClosedInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-closed.h';

import routesActions from 'redux-main/reducers/modules/routes/actions';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionLoadMissionData } from 'redux-main/reducers/modules/missions/mission/actions';
import { get } from 'lodash';
import { ConfigType } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.tsx';

export const dashboardSetIsLoadingForCardData = (path) => ({
  type: DASHBOARD_CHANGE_IS_LOADING_IN_CART_DATA,
  payload: {
    path,
  },
});

export const dashBoardResetData: any = () => ({
  type: DASHBOARD_RESET,
  payload: {},
});

export const dashboardLoadMissionDataForCurrentMission = (id: number): EtsAction<void> => async (dispatch) => {
  dispatch({
    type: DASHBOARD_SET_INFO_DATA,
    payload: {
      path: 'current_missions',
      infoData: null,
    },
  });

  if (id) {
    try {
      const mission_data = await dispatch(
        actionLoadMissionData(
          id,
          {
            page: 'dashboard',
          },
        ),
      );
      dispatch({
        type: DASHBOARD_SET_INFO_DATA,
        payload: {
          path: 'current_missions',
          infoData: mission_data,
        },
      });
    } catch {
      //
    }
  }
};

export const dashboardLoadRouteDataForCurrentDutyMissions = (duty_mission_data?: CurrentDutyMissionsItemsSubItemDatasType, id?: number): EtsAction<void> => async (dispatch) => {
  dispatch({
    type: DASHBOARD_SET_INFO_DATA,
    payload: {
      path: 'current_duty_missions',
      infoData: null,
    },
  });

  if (id) {
    try {
      const route_data = await dispatch(
        routesActions.actionLoadRouteById(
          id,
          {
            page: 'dashboard',
          },
        ),
      );

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
      });
    } catch {
      //
    }
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

export const dashboardSetInfoDataInCarInWorkOverall = (infoData: CarInWorkOverallInfoDataType = null): EtsAction<any> => (dispatch) => dispatch({
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

export const dashboardLoadCardData = (path: string, payloadAction: ConfigType['payloadAction']) => {
  const dashboardServiceWithParams = (
      defAns.backEndKeys[path] || path
    )
    .split('/')
    .reduce((ApiService, pathPart) => ApiService.path(pathPart), DashboardService);

  const payload = dashboardServiceWithParams
    .get(get(payloadAction, 'payload', {}))
    .catch((e) => {
      // tslint:disable-next-line
      console.warn(e);
      return {
        result: defAns[path.split('/').join('_')],
      };
    })
    .then((res) => {
      const result = get(res, 'result');
      if (result) {
        return ({
          [path.split('/').join('_')]: result,
        });
      } else {
        return {
          result: defAns[path.split('/').join('_')],
        };
      }
    });

  return ({
    type: DASHBOARD_CHANGE_CART_DATA,
    payload,
  });
};

export const dashboardLoadCardDataByPath = (path, payloadAction?: ConfigType['payloadAction']) => (dispatch) => {
  dispatch(dashboardSetIsLoadingForCardData(path.split('/').join('_')));
  return dispatch(dashboardLoadCardData(path, payloadAction));
};

export const dashboardLoadCurrentMissions: any = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('current_missions', payloadAction)
);

export const dashboardLoadFutureMissions = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('future_missions', payloadAction)
);

export const dashboardLoadOdhNotCoveredByMissionsOfCurrentShift = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('odh_not_covered_by_missions_of_current_shift', payloadAction)
);

export const dashboardLoadOdhNotCoveredByRoutes: any = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('odh_not_covered_by_routes', payloadAction)
);

export const dashboardLoadOdhCoveredByRoutes = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('odh_covered_by_routes', payloadAction)
);

export const dashboardLoadCarInWorkOverall = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('car_in_work_overall', payloadAction)
);

export const dashboardLoadOrders = () => (
  dashboardLoadCardDataByPath(
    'faxogramms',
    {
      payload: {
        status: 2,
      },
    },
  )
);

export const dashboardLoadCurrentDutyMissions: any = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('current_duty_missions', payloadAction)
);

export const dashboardLoadWaybillDraft = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('waybill/draft', payloadAction)
);
export const dashboardLoadWaybillInProgress = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('waybill/in_progress', payloadAction)
);
export const dashboardLoadWaybillCompleted = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('waybill/completed', payloadAction)
);
export const dashboardLoadWaybillClosed = (payloadAction?: ConfigType['payloadAction']) => (
  dashboardLoadCardDataByPath('waybill/closed', payloadAction)
);

export const dashboardLoadAllWaybill = (payloadAction?: ConfigType['payloadAction']) => (dispatch) => {
  dispatch(dashboardLoadWaybillDraft(payloadAction));
  dispatch(dashboardLoadWaybillInProgress(payloadAction));
  dispatch(dashboardLoadWaybillCompleted(payloadAction));
  dispatch(dashboardLoadWaybillClosed(payloadAction));
};

export const dashboardLoadDependentDataByWaybillDraft: any = (payloadAction?: ConfigType['payloadAction']) => (dispatch) => {
  dispatch(dashboardLoadWaybillDraft(payloadAction));
  dispatch(dashboardLoadFutureMissions(payloadAction));
  dispatch(dashboardLoadWaybillInProgress(payloadAction));
  dispatch(dashboardLoadCurrentMissions(payloadAction));
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift(payloadAction));
  dispatch(dashboardLoadOdhNotCoveredByRoutes(payloadAction));
  dispatch(dashboardLoadOdhCoveredByRoutes(payloadAction));
  dispatch(dashboardLoadCarInWorkOverall(payloadAction));
};

export const dashboardLoadDependentDataByWaybillInProgress: any = (payloadAction?: ConfigType['payloadAction']) => (dispatch) => {
  dispatch(dashboardLoadWaybillClosed(payloadAction));
  dispatch(dashboardLoadFutureMissions(payloadAction));
  dispatch(dashboardLoadCurrentMissions(payloadAction));
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift(payloadAction));
  dispatch(dashboardLoadOdhNotCoveredByRoutes(payloadAction));
  dispatch(dashboardLoadOdhCoveredByRoutes(payloadAction));
  dispatch(dashboardLoadCarInWorkOverall(payloadAction));
};

export const dashboardLoadDependentDataByWaybillCompleted: any = (payloadAction?: ConfigType['payloadAction']) => (dispatch) => {
  dispatch(dashboardLoadWaybillCompleted(payloadAction));
  dispatch(dashboardLoadWaybillClosed(payloadAction));
  dispatch(dashboardLoadFutureMissions(payloadAction));
  dispatch(dashboardLoadCurrentMissions(payloadAction));
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift(payloadAction));
  dispatch(dashboardLoadOdhNotCoveredByRoutes(payloadAction));
  dispatch(dashboardLoadOdhCoveredByRoutes(payloadAction));
  dispatch(dashboardLoadCarInWorkOverall(payloadAction));
};

export const dashboardLoadDependentDataByNewMission: any = (payloadAction?: ConfigType['payloadAction']) => (dispatch) => {
  dispatch(dashboardLoadWaybillDraft(payloadAction));
  dispatch(dashboardLoadFutureMissions(payloadAction));
  dispatch(dashboardLoadCurrentMissions(payloadAction));
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift(payloadAction));
  dispatch(dashboardLoadOdhNotCoveredByRoutes(payloadAction));
  dispatch(dashboardLoadOdhCoveredByRoutes(payloadAction));
  dispatch(dashboardLoadCarInWorkOverall(payloadAction));
};

export const dashboardLoadDependentDataByNewDutyMission: any = (payloadAction?: ConfigType['payloadAction']) => (dispatch) => {
  dispatch(dashboardLoadCurrentDutyMissions(payloadAction));
  dispatch(dashboardLoadFutureMissions(payloadAction));
  dispatch(dashboardLoadOdhNotCoveredByMissionsOfCurrentShift(payloadAction));
  dispatch(dashboardLoadOdhNotCoveredByRoutes(payloadAction));
  dispatch(dashboardLoadOdhCoveredByRoutes(payloadAction));
};

export const dashboardLoadDependentDataByCloseMission: any = (payloadAction?: ConfigType['payloadAction']) => (dispatch) => {
  dispatch(dashboardLoadWaybillInProgress(payloadAction));
  dispatch(dashboardLoadWaybillCompleted(payloadAction));
};
