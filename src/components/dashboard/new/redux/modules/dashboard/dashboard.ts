import { createPath } from 'redux/redux-utils';
import * as defAns from 'components/dashboard/new/redux/modules/dashboard/mosk/defAns';
const DASHBOARD = createPath('DASHBOARD');

export const DASHBOARD_CHANGE_CART_DATA = DASHBOARD`CHANGE_CART_DATA`;
export const DASHBOARD_CHANGE_IS_LOADING_IN_CART_DATA = DASHBOARD`CHANGE_IS_LOADING_IN_CART_DATA`;
export const DASHBOARD_SET_INFO_DATA = DASHBOARD`SET_INFO_DATA`;

const initialState: any = {
  current_missions: {
    isLoading: false,
    data: defAns.current_missions,
    infoData: null,
  },
  future_missions: {
    isLoading: false,
    data: defAns.future_missions,
  },
  odh_not_covered_by_missions_of_current_shift: {
    isLoading: false,
    data: defAns.odh_not_covered_by_missions_of_current_shift,
    infoData: null,
  },
  odh_not_covered_by_routes: {
    isLoading: false,
    data: defAns.odh_not_covered_by_routes,
    infoData: null,
  },
  odh_covered_by_routes: {
    isLoading: false,
    data: defAns.odh_covered_by_routes,
    infoData: null,
  },
  car_in_work_overall: {
    isLoading: false,
    data: defAns.car_in_work_overall,
    infoData: null, 
  },
  faxogramms: {
    isLoading: false,
    data: defAns.faxogramms,
    infoData: null, 
  },
  current_duty_missions: {
    isLoading: false,
    data: defAns.current_duty_missions,
    infoData: null,
  },
  waybill_draft: {
    isLoading: false,
    data: defAns.waybill_draft,
    infoData: null,
  },
  waybill_in_progress: {
    isLoading: false,
    data: defAns.waybill_in_progress,
    infoData: null,
  },
  waybill_completed: {
    isLoading: false,
    data: defAns.waybill_completed,
    infoData: null,
    activeIndex: 0,
  },
  waybill_closed: {
    isLoading: false,
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
          }
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
    default: {
      return state;
    }
  }
}