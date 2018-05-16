import { createSelector } from 'reselect';
import { GEOOBJECTS_TYPES } from 'constants/geoobjects.js';

import {
  getIsShowGeometry,
  getIsShowDtGeometry,
  getIsShowOdhGeometry,
  getIsShowSspGeometry,
  getIsShowMspGeometry,
  getIsShowCarpoolGeometry,
  getIsShowFuelingWaterGeometry,
  getIsShowDangerZoneGeometry,
  getIsShowPgmStoreGeometry,
  getIsShowSnowStorageGeometry,
  getIsShowBridgesGeometry,
  getIsShowPedestrianTunnelsGeometry,
  getIsShowPedestrianTunnelExitsGeometry,
  getIsShowFountainsGeometry,
} from 'redux/selectors/toolbar';

const emptyArr = [];
// const emptyObj = {};

export const getDtData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.dt];
export const getOdhData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.odh];
export const getSspData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.ssp];
export const getMspData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.msp];
export const getCarpoolData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.carpool];
export const getFuelingWaterData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.fueling_water];
export const getDangerZoneData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.danger_zone];
export const getPgmStoreData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.pgm_store];
export const getSnowStorageData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.snow_storage];
export const getBridgesData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.bridges];
export const getPedestrianTunnelsData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.pedestrian_tunnels];
export const getPedestrianTunnelExitsData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.pedestrian_tunnel_exits];
export const getFountainsData = state => state.geoObjects.geoData[GEOOBJECTS_TYPES.fountains];
export const getSelectedGeometry = state => state.geoObjects.selected;

export const getSelectedType = createSelector(
  getSelectedGeometry,
  getIsShowGeometry,
  (selected, showByCheckbox) => selected && showByCheckbox ? selected.type : '',
);

export const getDtGeoObjects = createSelector(
  getIsShowDtGeometry,
  getIsShowGeometry,
  getDtData,
  (show, showByCheckbox, dt) => show && showByCheckbox ? dt : emptyArr,
);

export const getOdhGeoObjects = createSelector(
  getIsShowOdhGeometry,
  getIsShowGeometry,
  getOdhData,
  (show, showByCheckbox, odh) => show && showByCheckbox ? odh : emptyArr,
);

export const getSspGeoObjects = createSelector(
  getIsShowSspGeometry,
  getIsShowGeometry,
  getSspData,
  (show, showByCheckbox, ssp) => show && showByCheckbox ? ssp : emptyArr,
);

export const getMspGeoObjects = createSelector(
  getIsShowMspGeometry,
  getIsShowGeometry,
  getMspData,
  (show, showByCheckbox, msp) => show && showByCheckbox ? msp : emptyArr,
);

export const getCarpoolGeoObjects = createSelector(
  getIsShowCarpoolGeometry,
  getIsShowGeometry,
  getCarpoolData,
  (show, showByCheckbox, carpool) => show && showByCheckbox ? carpool : emptyArr,
);

export const getFuelingWaterGeoObjects = createSelector(
  getIsShowFuelingWaterGeometry,
  getIsShowGeometry,
  getFuelingWaterData,
  (show, showByCheckbox, fueling_water) => show && showByCheckbox ? fueling_water : emptyArr,
);

export const getDangerZoneGeoObjects = createSelector(
  getIsShowDangerZoneGeometry,
  getIsShowGeometry,
  getDangerZoneData,
  (show, showByCheckbox, danger_zone) => show && showByCheckbox ? danger_zone : emptyArr,
);

export const getPgmStoreGeoObjects = createSelector(
  getIsShowPgmStoreGeometry,
  getIsShowGeometry,
  getPgmStoreData,
  (show, showByCheckbox, pgm_store) => show && showByCheckbox ? pgm_store : emptyArr,
);

export const getSnowStorageGeoObjects = createSelector(
  getIsShowSnowStorageGeometry,
  getIsShowGeometry,
  getSnowStorageData,
  (show, showByCheckbox, snow_storage) => show && showByCheckbox ? snow_storage : emptyArr,
);

export const getBridgesGeoObjects = createSelector(
  getIsShowBridgesGeometry,
  getIsShowGeometry,
  getBridgesData,
  (show, showByCheckbox, bridges) => show && showByCheckbox ? bridges : emptyArr,
);

export const getPedestrianTunnelsGeoObjects = createSelector(
  getIsShowPedestrianTunnelsGeometry,
  getIsShowGeometry,
  getPedestrianTunnelsData,
  (show, showByCheckbox, pedestrian_tunnels) => show && showByCheckbox ? pedestrian_tunnels : emptyArr,
);

export const getPedestrianTunnelExitsGeoObjects = createSelector(
  getIsShowPedestrianTunnelExitsGeometry,
  getIsShowGeometry,
  getPedestrianTunnelExitsData,
  (show, showByCheckbox, pedestrian_tunnel_exits) => show && showByCheckbox ? pedestrian_tunnel_exits : emptyArr,
);

export const getFountainsGeoObjects = createSelector(
  getIsShowFountainsGeometry,
  getIsShowGeometry,
  getFountainsData,
  (show, showByCheckbox, fountains) => show && showByCheckbox ? fountains : emptyArr,
);
