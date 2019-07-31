import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

const FuelIconRefill = require('assets/icons/track/oil-01.png');
const FuelIconLeak = require('assets/icons/track/oil-02.png');

const DEVICE_PIXEL_RATIO = 2; // window.devicePixelRatio;

const CACHE_ICON: any = {};

const makeCacheStyle = (cacheStyleName, { event_type }) => {
  return CACHE_ICON[cacheStyleName] = new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      src: event_type === 'leak' ? FuelIconLeak : FuelIconRefill,
      scale: 0.2 * (2 / DEVICE_PIXEL_RATIO),
    }),
    zIndex: 9,
  });
};

export const getStyleForFuelEvent = (event_type) => {
  const cacheStyleName = `${event_type}`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
      { event_type },
    );
  }

  return icon;
};
