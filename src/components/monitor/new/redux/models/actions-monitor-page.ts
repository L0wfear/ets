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
  MONITOR_PAGE_TOGGLE_MEASURE_ACTIVE,
} from 'components/monitor/new/redux/models/monitor-page';

export const monitorPageSetcarActualGpsNumberIndex = (carActualGpsNumberIndex) => ({
  type: MONITOR_PAGE_SET_CAR_ACTUAL_INDEX,
  payload: {
    carActualGpsNumberIndex,
  },
});

export const monitoPageChangeCarsByStatus = (changedCarsByStatus) => ({
  type: MONITOR_PAGE_CHANGE_CARS_BY_STATUS,
  payload: {
    changedCarsByStatus,
  },
});

export const monitorPageToggleStatusShow = typeArr => ({
  type: MONITOR_PAGE_TOGGLE_STATUS_SHOW,
  payload: {
    typeArr,
  },
});

export const monitorPageToggleStatusGeo = typeArr => ({
  type: MONITOR_PAGE_TOGGLE_STATUS_GEO,
  payload: {
    typeArr,
  },
});

export const monitorPageToggleStatusGeoobject = typeArr => ({
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

export const monitorPageRemoveAllFromSelectedGeoobjects = () => ({
  type: MONITOR_PAGE_REMOVE_ALL_FROM_SELECTED_GEOMETRY,
  payload: {},
});

export const monitorPageChangeFilter = (type, value) => ({
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

export const monitorPageToggleMeasureActive = () => ({
  type: MONITOR_PAGE_TOGGLE_MEASURE_ACTIVE,
  payload: {},
});
