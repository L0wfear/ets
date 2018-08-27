const ParkingIcon = require('components/map/new/layers/fuel-event/leak/oil-02.png');

const DEVICE_PIXEL_RATIO = 2; // window.devicePixelRatio;

const CACHE_ICON = {};

const makeCacheStyle = (cacheStyleName ) => {
  return CACHE_ICON[cacheStyleName] = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      src: ParkingIcon,
      scale: 0.2 * (2 / DEVICE_PIXEL_RATIO),
    }),
    zIndex: 9,
  });
}

export const getStyleForFuelEventLeak = () => {
  const cacheStyleName = `fuelEvents/leak`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
    );
  }

  return icon;
}