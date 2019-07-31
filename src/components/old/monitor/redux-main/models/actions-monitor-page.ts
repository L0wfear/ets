import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  MONITOR_PAGE_SET_CAR_ACTUAL_INDEX,
  MONITOR_PAGE_CHANGE_CARS_BY_STATUS,
  MONITOR_PAGE_TOGGLE_STATUS_SHOW,
  MONITOR_PAGE_RESER,
  MONITOR_PAGE_RESER_CAR_STATUS,
  MONITOR_PAGE_TOGGLE_STATUS_GEO,
  MONITOR_PAGE_TOGGLE_STATUS_GEOOBECT,
  MONITOR_PAGE_TOGGLE_STATUS_SHOW_GOV_NUMBER,
  MONITOR_PAGE_SET_GEOMETRY,
  MONITOR_PAGE_ADD_TO_SELECTED_GEOMETRY,
  MONITOR_PAGE_REMOVE_FROM_SELECTED_GEOMETRY,
  MONITOR_PAGE_REMOVE_ALL_FROM_SELECTED_GEOMETRY,
  MONITOR_PAGE_CHANGE_FILTERS,
  MONITOR_PAGE_MERGE_FILTERS_GPS_CODE_LIST,
  MONITOR_PAGE_TOGGLE_DRAW_ACTIVE,
  MONITOR_PAGE_FALSE_DRAW_ACTIVE,
  MONITOR_PAGE_CHANGE_FUEL_EVENTS_DATE,
  MONITOR_PAGE_CHANGE_FUEL_EVENTS_LEAK_OVERLAY_DATA,
  MONITOR_PAGE_TOGGLE_FUEL_EVENTS_LEAK_SHOW,
} from 'components/monitor/redux-main/models/monitor-page';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { ReduxState } from 'redux-main/@types/state';

export const monitorPageSetcarActualGpsNumberIndex = (carActualGpsNumberIndex) => ({
  type: MONITOR_PAGE_SET_CAR_ACTUAL_INDEX,
  payload: {
    carActualGpsNumberIndex,
  },
});

export const actionMonitorPageLoadCarActual = (): ThunkAction<Promise<any>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const result = await dispatch(
    autobaseActions.autobaseGetSetCar(
      {},
      { page: 'main', path: '' },
    ),
  );

  return result;
};

export const monitoPageChangeCarsByStatus = (carsByStatus) => ({
  type: MONITOR_PAGE_CHANGE_CARS_BY_STATUS,
  payload: {
    carsByStatus,
  },
});

export const monitorPageToggleStatusShow = (typeArr) => ({
  type: MONITOR_PAGE_TOGGLE_STATUS_SHOW,
  payload: {
    typeArr,
  },
});

export const monitorPageToggleStatusGeo = (typeArr) => ({
  type: MONITOR_PAGE_TOGGLE_STATUS_GEO,
  payload: {
    typeArr,
  },
});

export const monitorPageToggleStatusGeoobject = (typeArr) => ({
  type: MONITOR_PAGE_TOGGLE_STATUS_GEOOBECT,
  payload: {
    typeArr,
  },
});

export const resetMonitorPageState = () => ({
  type: MONITOR_PAGE_RESER,
  payload: {},
});

export const monitorPageResetCarStatus = () => ({
  type: MONITOR_PAGE_RESER_CAR_STATUS,
  payload: {},
});

export const monitorPageToggleStatusShowGovNumber = () => ({
  type: MONITOR_PAGE_TOGGLE_STATUS_SHOW_GOV_NUMBER,
  payload: {},
});

export const monitorPageSetGeometry = (payload = {}) => ({
  type: MONITOR_PAGE_SET_GEOMETRY,
  payload,
});

export const monitorPageAddToSelectedGeoobjects = (serverName, id, data) => ({
  type: MONITOR_PAGE_ADD_TO_SELECTED_GEOMETRY,
  payload: {
    serverName,
    id,
    data,
  },
});

export const monitorPageRemoveFromSelectedGeoobjects = (serverName, id = '') => ({
  type: MONITOR_PAGE_REMOVE_FROM_SELECTED_GEOMETRY,
  payload: {
    serverName,
    id,
  },
});

export const monitorPageRemoveAllFromSelectedGeoobjects: any = () => ({
  type: MONITOR_PAGE_REMOVE_ALL_FROM_SELECTED_GEOMETRY,
  payload: {},
});

export const monitorPageChangeFilter = (type, value) => ({ // добавление нового фильтра с буфером
  type: MONITOR_PAGE_CHANGE_FILTERS,
  payload: {
    type,
    value,
  },
});

export const monitorPageMergeFiltredCarGpsCode = (filtredCarGpsCode) => ({
  type: MONITOR_PAGE_MERGE_FILTERS_GPS_CODE_LIST,
  payload: {
    filtredCarGpsCode,
  },
});

export const monitorPageChangeFuelEventsDate = (type, field, date) => ({
  type: MONITOR_PAGE_CHANGE_FUEL_EVENTS_DATE,
  payload: {
    type,
    field,
    date,
  },
});
export const monitorPageSetFuelEventsLeakOverlayData = (overlayData = null) => ({
  type: MONITOR_PAGE_CHANGE_FUEL_EVENTS_LEAK_OVERLAY_DATA,
  payload: {
    overlayData,
  },
});
export const monitorPageToggleFuelEvetnsLeakShow = () => ({
  type: MONITOR_PAGE_TOGGLE_FUEL_EVENTS_LEAK_SHOW,
  payload: {},
});

/*  ________________ TOGGLE DRAW_ACTIVE_STATUS ________________ */
export const monitorPageToggleDrawActiveByKey = (drawKey) => ({
  type: MONITOR_PAGE_TOGGLE_DRAW_ACTIVE,
  payload: {
    drawKey,
  },
});
export const monitorPageToggleMeasureActive = () => (dispatch) => (
  dispatch(
    monitorPageToggleDrawActiveByKey('measureActive'),
  )
);
export const monitorPageTogglePolygonBufferActive = () => (dispatch) => (
  dispatch(
    monitorPageToggleDrawActiveByKey('polygonBuffer'),
  )
);

/*  ________________ FALSE DRAW_ACTIVE_STATUS ________________ */
export const monitorPageFalseDrawActiveByKey = (drawKey) => ({
  type: MONITOR_PAGE_FALSE_DRAW_ACTIVE,
  payload: {
    drawKey,
  },
});
export const monitorPageFalseMeasureActive = () => (dispatch) => (
  dispatch(
    monitorPageFalseDrawActiveByKey('measureActive'),
  )
);
export const monitorPageFalsePolygonBufferActive = () => (dispatch) => (
  dispatch(
    monitorPageFalseDrawActiveByKey('polygonBuffer'),
  )
);
