import { createSelector } from 'reselect';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_REVERSE } from 'constants/geoobjects';
import { getPermissions } from 'redux/selectors/session';

import { getStatudSelectedCarId } from 'redux/selectors/carsPoints';
/* CarsLegend */
export const getToolbarFiltersCars = state => state.toolbar.filtersCars;

export const getByStatus = state => state.carsPoints.byStatus;
export const getByConnectionStatus = state => state.carsPoints.byConnectionStatus;
const checkOnActiveTypeFilter = ['showInMove', 'showInHalfStop', 'showInStop'];

export const getToolbarFiltersCarsWithActiveCheck = createSelector(
  getToolbarFiltersCars,
  filtres => Object.entries(filtres).reduce((newObj, [key, value]) => ({
      ...newObj,
    [key]: checkOnActiveTypeFilter.includes(key) ? (value && filtres.showActive) : value,
  }), {}),
);

export const getInMoveCarsCount = createSelector(
  getByStatus,
  byStatus => byStatus[1],
);

export const getIsShowInMoveValue = createSelector(
  getToolbarFiltersCars,
  filters => filters.showActive && filters.showInMove,
);

export const getInHalfStopCarsCount = createSelector(
  getByStatus,
  byStatus => byStatus[2],
);

export const getIsShowHalfStopValue = createSelector(
  getToolbarFiltersCars,
  filters => filters.showActive && filters.showInHalfStop,
);

export const getInStopCarsCount = createSelector(
  getByStatus,
  byStatus => byStatus[3],
);

export const getIsShowStopValue = createSelector(
  getToolbarFiltersCars,
  filters => filters.showActive && filters.showInStop,
);

export const getInNotConnectedCarsCount = createSelector(
  getByStatus,
  byStatus => byStatus[4],
);

export const getIsShowNotActiveValue = createSelector(
  getToolbarFiltersCars,
  filters => filters.showInNotConnected,
);

export const getActiveCarsCount = createSelector(
  getToolbarFiltersCars,
  getByStatus,
  getStatudSelectedCarId,
  (filters, byStatus, statusSelectedcar) => {
    let count = 0;

    if (filters.showActive) {
      if (filters.showInMove) {
        count += byStatus[1];
      } else if (statusSelectedcar === 1) {
        count++;
      }

      if (filters.showInHalfStop) {
        count += byStatus[2];
      } else if (statusSelectedcar === 2) {
        count++;
      }

      if (filters.showInStop) {
        count += byStatus[3];
      } else if (statusSelectedcar === 3) {
        count++;
      }
    } else if (statusSelectedcar) {
      count++;
    }

    return count;
  },
);

export const getIsShowActiveValue = createSelector(
  getToolbarFiltersCars,
  getByStatus,
  filters => filters.showActive,
);

/* TrackAndGeometryLengend */
export const getToolbarFiltersOthers = state => state.toolbar.filtersOthers;

export const getIsShowTrack = createSelector(
  getToolbarFiltersOthers,
  filters => filters.showTrack,
);

export const getIsShowGeometry = createSelector(
  getToolbarFiltersOthers,
  filters => filters.showGeometry,
);

/* CarsGosNumber */

export const getShowGovNumber = state => state.toolbar.showGovNumber;

// Глупо
// На случай расширения
export const getIsShowGovNumber = createSelector(
  getShowGovNumber,
  show => show,
);

/* GeoObjectLegend */
export const getToolbarFiltersGeoObjects = state => state.toolbar.filtersGeoObjects;

export const getIsShowAllGeometry = createSelector(
  getPermissions,
  getToolbarFiltersGeoObjects,
  (permissions, filtres) => {
    const permittedFiltres = Object.entries(filtres).reduce((newArr, [key, value]) => {
      if (permissions.includes(`${GEOOBJECTS_TYPES_REVERSE[key]}.list`)) {
        newArr.push(value);
      }

      return newArr;
    }, []);

    return !permittedFiltres.some(f => !f);
  },
);

export const getIsShowDtGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.dt],
);

export const getIsShowOdhGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.odh],
);

export const getIsShowSspGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.ssp],
);

export const getIsShowMspGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.msp],
);

export const getIsShowCarpoolGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.carpool],
);

export const getIsShowFuelingWaterGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.fueling_water],
);

export const getIsShowDangerZoneGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.danger_zone],
);

export const getIsShowPgmStoreGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.pgm_store],
);

export const getIsShowSnowStorageGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.snow_storage],
);

export const getIsShowBridgesGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.bridges],
);

export const getIsShowPedestrianTunnelsGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.pedestrian_tunnels],
);

export const getIsShowPedestrianTunnelExitsGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.pedestrian_tunnel_exits],
);

export const getIsShowFountainsGeometry = createSelector(
  getToolbarFiltersGeoObjects,
  filters => filters[GEOOBJECTS_TYPES.fountains],
);
