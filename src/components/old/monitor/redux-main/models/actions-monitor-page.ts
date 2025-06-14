import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import {
  MONITOR_PAGE_SET_CAR_ACTUAL_INDEX,
  MONITOR_PAGE_CHANGE_CARS_BY_STATUS,
  MONITOR_PAGE_TOGGLE_STATUS_SHOW,
  MONITOR_PAGE_RESER,
  MONITOR_PAGE_RESER_CAR_STATUS,
  MONITOR_PAGE_TOGGLE_STATUS_GEO,
  MONITOR_PAGE_TOGGLE_STATUS_GEOOBECT,
  MONITOR_PAGE_TOGGLE_STATUS_SHOW_GOV_NUMBER,
  MONITOR_PAGE_TOGGLE_STATUS_SHOW_TRACK_POINTS,
  MONITOR_PAGE_TOGGLE_STATUS_SHOW_TRACK,
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
  MONITOR_PAGE_SET_COMPANY,
  MONITOR_PAGE_CHANGE_GEOOBJECTS_FILTER,
  MONITOR_PAGE_SET_CARS_FOR_EXCLUDE,
  MONITOR_PAGE_SET_GEOOBJS_FILTER_BY_ELEM,
} from 'components/old/monitor/redux-main/models/monitor-page';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { Company } from 'redux-main/reducers/modules/company/@types';
import { autobaseGetSetCar } from 'redux-main/reducers/modules/autobase/car/actions';
import { promiseGetCarExclude } from 'redux-main/reducers/modules/autobase/car/promise';
import { CarExcludeOptions } from 'redux-main/reducers/modules/autobase/car/@types';
import { promiseGetGeoobjsFilterByElem } from 'redux-main/reducers/modules/geoobject/promises';
import { GeoobjsFilterByElemOptions } from 'redux-main/reducers/modules/geoobject/@types/geoobject.h';
import { GeoobjsFilterByElem } from './monitor-page.h';

export const actionSetCompanyIndex = (companiesIndex: Record<Company['id'], Company>) => ({
  type: MONITOR_PAGE_SET_COMPANY,
  payload: {
    companiesIndex,
  },
});

export const monitorPageSetcarActualGpsNumberIndex = (
  carActualGpsNumberIndex: Record<Car['gps_code'], Car>,
  carActualGpsCount: number,
  carActualList: Array<Car>,
) => ({
  type: MONITOR_PAGE_SET_CAR_ACTUAL_INDEX,
  payload: {
    carActualGpsNumberIndex,
    carActualGpsCount,
    carActualList,
  },
});

export const actionMonitorPageLoadCarActual = (): EtsAction<EtsActionReturnType<typeof autobaseGetSetCar>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetCar(
      {},
      { page: 'main', path: '' },
    ),
  );

  return result;
};

export const monitorPageChangeCarsByStatus = (carsByStatus, carActualNotInMap: Array<Car>): EtsAction<void> => (dispatch, getState) => {
  const carsByStatusOld = getMonitorPageState(getState()).carsByStatus;

  const hasDiff = Object.entries(carsByStatusOld).some(
    ([key, count]) => carsByStatus[key] !== count,
  );

  if (hasDiff) {
    dispatch({
      type: MONITOR_PAGE_CHANGE_CARS_BY_STATUS,
      payload: {
        carsByStatus,
        carActualNotInMap,
      },
    });
  }
};

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

export const monitorPageToggleStatusShowTrackPoints = () => ({
  type: MONITOR_PAGE_TOGGLE_STATUS_SHOW_TRACK_POINTS,
  payload: {},
});

export const monitorPageToggleStatusShowTrack = () => ({
  type: MONITOR_PAGE_TOGGLE_STATUS_SHOW_TRACK,
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

export const monitorPageChangeGeoobjectsFilter = (value) => ({
  type: MONITOR_PAGE_CHANGE_GEOOBJECTS_FILTER,
  payload: {
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

export const monitorPageSetCarsForExclude = (payload: Array<number>) => ({
  type: MONITOR_PAGE_SET_CARS_FOR_EXCLUDE,
  payload,
});

export const monitorPageSetGeoobjsFilterByElem = (payload: GeoobjsFilterByElem) => ({
  type: MONITOR_PAGE_SET_GEOOBJS_FILTER_BY_ELEM,
  payload,
});

export const getAndSetInStoreCarsForExclude = (
  options: CarExcludeOptions
) => async (dispatch) => {
  const result = await promiseGetCarExclude(options);
  dispatch(monitorPageSetCarsForExclude(result));
};

export const getAndSetInStoreGeoobjsFilterByElem = (
  options: GeoobjsFilterByElemOptions
) => async (dispatch) => {
  const result = await promiseGetGeoobjsFilterByElem(options);
  dispatch(monitorPageSetGeoobjsFilterByElem({[options.municipal_facility_id]: result}));
};
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
