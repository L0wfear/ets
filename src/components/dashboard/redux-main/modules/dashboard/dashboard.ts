import { createPath } from 'redux-main/redux-utils';
import * as defAns from 'components/dashboard/redux-main/modules/dashboard/mosk/defAns';

const DASHBOARD = createPath('DASHBOARD');

export const DASHBOARD_RESET = DASHBOARD`RESET`;
export const DASHBOARD_CHANGE_CART_DATA = DASHBOARD`CHANGE_CART_DATA`;
export const DASHBOARD_CHANGE_IS_LOADING_IN_CART_DATA = DASHBOARD`CHANGE_IS_LOADING_IN_CART_DATA`;
export const DASHBOARD_SET_INFO_DATA = DASHBOARD`SET_INFO_DATA`;

import { InitialStateDashboard } from 'components/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';

const initialState: InitialStateDashboard = {
  current_missions: {
    isLoading: false,
    dateLoad: null,
    data: defAns.current_missions,
    infoData: null,
  },
  future_missions: {
    isLoading: false,
    dateLoad: null,
    data: defAns.future_missions,
    infoData: null,
  },
  odh_not_covered_by_missions_of_current_shift: {
    isLoading: false,
    dateLoad: null,
    data: defAns.odh_not_covered_by_missions_of_current_shift,
    infoData: null,
  },
  odh_not_covered_by_routes: {
    isLoading: false,
    dateLoad: null,
    data: defAns.odh_not_covered_by_routes,
    infoData: null,
  },
  odh_covered_by_routes: {
    isLoading: false,
    dateLoad: null,
    data: defAns.odh_covered_by_routes,
    infoData: null,
  },
  car_in_work_overall: {
    isLoading: false,
    dateLoad: null,
    data: defAns.car_in_work_overall,
    infoData: null,
  },
  faxogramms: {
    isLoading: false,
    dateLoad: null,
    data: defAns.faxogramms,
    infoData: null,
  },
  current_duty_missions: {
    isLoading: false,
    dateLoad: null,
    data: defAns.current_duty_missions,
    infoData: null,
  },
  waybill_draft: {
    isLoading: false,
    dateLoad: null,
    data: defAns.waybill_draft,
    infoData: null,
  },
  waybill_in_progress: {
    isLoading: false,
    dateLoad: null,
    data: defAns.waybill_in_progress,
    infoData: null,
  },
  waybill_completed: {
    isLoading: false,
    dateLoad: null,
    data: defAns.waybill_completed,
    infoData: null,
  },
  waybill_closed: {
    isLoading: false,
    dateLoad: null,
    data: defAns.waybill_closed,
    infoData: null,
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case DASHBOARD_CHANGE_CART_DATA: {
      return {
        ...state,
        ...Object.entries(payload).reduce((newObj, [key, data]) => ({
          ...newObj,
          [key]: {
            ...state[key],
            isLoading: false,
            data,
            dateLoad: new Date(),
          },
        }), {}),
      };
    }
    case DASHBOARD_CHANGE_IS_LOADING_IN_CART_DATA: {
      return {
        ...state,
        [payload.path]: {
          ...state[payload.path],
          isLoading: true,
        },
      };
    }
    case DASHBOARD_SET_INFO_DATA: {
      return {
        ...state,
        ...Object.entries(state).reduce((newObj, [key, data]) => {
          if (data.infoData) {
            newObj[key] = {
              ...data,
              infoData: null,
            };
          }
          return newObj;
        }, {}),
        [payload.path]: {
          ...state[payload.path],
          infoData: payload.infoData,
          ...payload.other,
        },
      };
    }
    case DASHBOARD_RESET: {
      return {
        ...initialState,
      };
    }
    default: {
      return state;
    }
  }
};
