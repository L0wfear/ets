const DEVICE_PIXEL_RATIO = 2 / 2; //window.devicePixelRatio / 2;

import { TRACK_COLORS } from 'constants/track.js';

const CACHE_ICON = {};

const makeCacheStyle = (cacheStyleName, { greenSpeed, SHOW_TRACK, equipmentChecked } ) => {
  console.log('makeCacheStyle equipmentChecked is -->>', equipmentChecked);

  if (!SHOW_TRACK) {
    return CACHE_ICON[cacheStyleName] = new ol.style.Style({});
  }
  console.log('makeCacheStyle equipmentChecked222 is -->>', equipmentChecked);
  return CACHE_ICON[cacheStyleName] = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5 / DEVICE_PIXEL_RATIO,
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.1)',
      }),
      fill: new ol.style.Fill({
        color:  greenSpeed ? TRACK_COLORS.green : TRACK_COLORS.red,
      }),
    }),
    stroke: new ol.style.Stroke({
      color: greenSpeed ? TRACK_COLORS.green : TRACK_COLORS.red,
      width: !equipmentChecked ? 7 / DEVICE_PIXEL_RATIO : 20,
    }),
    zIndex: 9,
  });
}

export const getStyleForTrackLine = (greenSpeed, SHOW_TRACK, equipmentChecked = false) => {
  let cacheStyleName = !SHOW_TRACK ? 'SHOW_TRACK':`${greenSpeed}`;
  cacheStyleName = equipmentChecked ? cacheStyleName + 'equipmentChecked' : cacheStyleName;
  
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;
  // console.log('getStyleForTrackLine CACHE_ICON', CACHE_ICON);
  equipmentChecked ? icon = CACHE_ICON[cacheStyleName] : cacheStyleName;
  // console.log('getStyleForTrackLine CACHE_ICON', CACHE_ICON);
  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
      { greenSpeed, SHOW_TRACK, equipmentChecked },
    );
  }
  
  return icon;
}