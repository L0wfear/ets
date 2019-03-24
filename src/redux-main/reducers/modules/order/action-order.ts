import { createPath } from 'redux-main/redux-utils';
import { cloneDeep } from 'lodash';
import {
  OrderService,
} from 'api/Services';
import { createValidDateTime } from 'utils/dates';
import { typeTemplate } from 'components/directories/order/forms/utils/constant';
import { parseFilterObject } from 'actions/MissionsActions';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { getOrderState } from 'redux-main/reducers/selectors';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

import dutyMissionActions from 'redux-main/reducers/modules/missions/duty_mission/actions';
import { promiseLoadOrderById } from './order_promise';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

const ORDER = createPath('ORDER');

export const GET_ORDERS = ORDER`GET_ORDERS`;

export const SET_ORDERS = ORDER`SET_ORDERS`;
export const SET_SELECTED_ELEMENT_ORDER = ORDER`SET_SELECTED_ELEMENT_ORDER`;
export const SET_SELECTED_ELEMENT_ASSIGNMENT = ORDER`SET_SELECTED_ELEMENT_ASSIGNMENT`;
export const SET_ORDER_HISTORY = ORDER`SET_ORDER_HISTORY`;
export const SET_MISSION_DATA = ORDER`SET_MISSION_DATA`;
export const SET_EMPTY_MISSION_DATA = ORDER`SET_EMPTY_MISSION_DATA`;
export const SET_DUTY_MISSION_DATA = ORDER`SET_DUTY_MISSION_DATA`;
export const SET_EMPTY_DUTY_MISSION_DATA = ORDER`SET_EMPTY_DUTY_MISSION_DATA`;
export const SET_EMPTY_MISSION_TEMPLATE_DATA = ORDER`SET_EMPTY_MISSION_TEMPLATE_DATA`;
export const SET_MISSION_TEMPLATE_DATA = ORDER`SET_MISSION_TEMPLATE_DATA`;

export const RESET_ORDER = ORDER`RESET_ORDER`;

export const setOrders = (OrdersList, pageOptions, total_count) => ({
  type: SET_ORDERS,
  payload: {
    OrdersList,
    pageOptions,
    total_count,
  },
});

export const setSelectedElementAssignment = (selectedElementAssignment) => ({
  type: SET_SELECTED_ELEMENT_ASSIGNMENT,
  payload: {
    selectedElementAssignment,
  },
});

export const setSelectedElementOrder = (selectedElementOrder) => ({
  type: SET_SELECTED_ELEMENT_ORDER,
  payload: {
    selectedElementOrder,
  },
});

export const resetOrder = () => ({
  type: RESET_ORDER,
  payload: {},
});

export const setOrderHistory = (HistoryOrderDataList) => ({
  type: SET_ORDER_HISTORY,
  payload: {
    HistoryOrderDataList,
  },
});

export const setMissionData = () => (dispatch, getState) => {
  const partialMission: Partial<Mission> = {};
  partialMission.mission_source_id = getSomeUniqState(getState()).missionSource.order_mission_source_id;
  const {
    selectedElementOrder: selectedOrder,
    selectedElementAssignment: selectedAssignment,
  } = getOrderState(getState());

  partialMission.faxogramm_id = selectedOrder.id;  // legacy
  partialMission.order_id = selectedOrder.id;
  partialMission.norm_id = selectedAssignment.norm_id;
  partialMission.norm_ids = [selectedAssignment.norm_id];
  partialMission.date_start = selectedAssignment.date_from || selectedOrder.order_date;
  partialMission.date_end = selectedAssignment.date_to || selectedOrder.order_date_to;
  partialMission.technical_operation_id = selectedAssignment.id;
  partialMission.technical_operation_name = selectedAssignment.tk_operation_name;
  partialMission.municipal_facility_id = selectedAssignment.municipal_facility_id;
  partialMission.municipal_facility_name = selectedAssignment.elem;
  partialMission.order_operation_id = selectedAssignment.order_operation_id;
  partialMission.order_number = selectedOrder.order_number;
  partialMission.order_status = selectedOrder.status;

  dispatch(
    dutyMissionActions.actionSetDependenceOrderDataForDutyMission(
      selectedOrder,
      selectedAssignment,
    ),
  );

  dispatch({
    type: SET_MISSION_DATA,
    payload: {
      partialMission,
    },
  });
};

export const setEmptyMissionData = () => ({
  type: SET_EMPTY_MISSION_DATA,
  payload: {},
});

export const setDutyMissionData = (): ThunkAction<any, ReduxState, {}, AnyAction> => (dispatch, getState) => {
  const partialDutyMission: Partial<DutyMission> = {};
  partialDutyMission.mission_source_id = getSomeUniqState(getState()).missionSource.order_mission_source_id;
  const {
    selectedElementOrder: selectedOrder,
    selectedElementAssignment: selectedAssignment,
  } = getOrderState(getState());

  partialDutyMission.faxogramm_id = selectedOrder.id;  // legacy
  partialDutyMission.norm_id = selectedAssignment.norm_id;
  partialDutyMission.plan_date_start = selectedAssignment.date_from || selectedOrder.order_date;
  partialDutyMission.plan_date_end = selectedAssignment.date_to || selectedOrder.order_date_to;
  partialDutyMission.technical_operation_id = selectedAssignment.id;
  partialDutyMission.technical_operation_name = selectedAssignment.tk_operation_name;
  partialDutyMission.municipal_facility_id = selectedAssignment.municipal_facility_id;
  partialDutyMission.municipal_facility_name = selectedAssignment.elem;
  partialDutyMission.order_operation_id = selectedAssignment.order_operation_id;
  partialDutyMission.order_number = selectedOrder.order_number;
  partialDutyMission.order_status = selectedOrder.status;

  dispatch(
    dutyMissionActions.actionSetDependenceOrderDataForDutyMission(
      selectedOrder,
      selectedAssignment,
    ),
  );

  dispatch({
    type: SET_DUTY_MISSION_DATA,
    payload: {
      partialDutyMission,
    },
  });
};

export const setEmptyDutyMissionData = () => ({
  type: SET_EMPTY_DUTY_MISSION_DATA,
  payload: {},
});

export const setMInMissionTemplateData = ({ mission_source_id }) => ({
  type: SET_MISSION_TEMPLATE_DATA,
  payload: {
    mission_source_id,
    typeClick: typeTemplate.missionTemplate,
  },
});

export const setDMInMissionTemplateData = ({ mission_source_id }) => ({
  type: SET_MISSION_TEMPLATE_DATA,
  payload: {
    mission_source_id,
    typeClick: typeTemplate.missionDutyTemplate,
  },
});

export const setEmptyDutyMissionTemplateData = () => ({
  type: SET_EMPTY_MISSION_TEMPLATE_DATA,
  payload: {},
});

export const getOrders: any = ({ limit, offset, sort_by, filter, date_start, date_end, haveMax }) => (dispatch, getState) => {
  const { pageOptions: { ...pageOptionsStore } } = getState().order;
  const pageOptions = {
    date_start: createValidDateTime(date_start ? date_start : pageOptionsStore.date_start),
    date_end: createValidDateTime(date_end ? date_end : pageOptionsStore.date_end),
    limit: limit || pageOptionsStore.limit,
    offset: !isNaN(Number(offset)) ? offset : pageOptionsStore.offset,
    sort_by: sort_by || pageOptionsStore.sort_by,
    filter: filter || pageOptionsStore.filter,
  };

  const filterValues = JSON.stringify(parseFilterObject(cloneDeep(pageOptions.filter)));

  return OrderService.get({
    ...pageOptions,
    filter: filterValues,
  }).then(({ result: OrdersList, total_count }) => {
    if (OrdersList.length === 0 && total_count !== 0) {
      return getOrders({
        ...pageOptions,
        filter: filterValues,
        offset: (Math.ceil(total_count / pageOptions.limit) - 1) * pageOptions.limit,
        haveMax: haveMax || pageOptionsStore.haveMax,
      })(dispatch, getState);
    }

    return dispatch(
      setOrders(
        OrdersList,
        {
          ...pageOptions,
          haveMax: haveMax || pageOptionsStore.haveMax,
        },
        total_count,
      ),
    );
  });
};

export const getOrderHistory = ({ id }) => (dispatch) => (
  OrderService.path(`${id}/history/`).get()
    .then(({ result: { rows: HistoryOrderDataList } }) => (
      dispatch(
        setOrderHistory(HistoryOrderDataList),
      )
    ))
);

/**
 * @todo переписать
 */
export const actionLoadOrderById = (id: number, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadOrderById(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
