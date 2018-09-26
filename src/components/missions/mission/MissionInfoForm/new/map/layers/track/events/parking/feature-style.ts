import * as ol from 'openlayers';
const ParkingIcon = require('assets/icons/track/parking.svg');

const DEVICE_PIXEL_RATIO = 2; // window.devicePixelRatio;

type TYPE_CACHE_ICON = {
  [key: string]: any;
};

const CACHE_ICON: TYPE_CACHE_ICON = {};

const makeCacheStyle = (cacheStyleName ) => {
  return CACHE_ICON[cacheStyleName] = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      src: ParkingIcon,
      scale: 0.06 * (2 / DEVICE_PIXEL_RATIO),
    }),
    zIndex: 9,
  });
}

export const getStyleForParking = () => {
  const cacheStyleName = `parking`;
  const cache_style = CACHE_ICON[cacheStyleName];
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
    );
  }

  return icon;
}