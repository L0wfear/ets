import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { BASE_GEOOBJECTS_LIST } from 'constants/geoobjects-new';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

const CACHE_ICON: Record<string, Style> = {};
const DEVICE_PIXEL_RATIO = 2 / 2;

const ICONS: {[K in keyof typeof BASE_GEOOBJECTS_LIST]?: string} = {
  carpool: require('assets/icons/geoobjects/carpool.svg'),
  pgm_store: require('assets/icons/geoobjects/pgm_store.svg'),
  snow_storage: require('assets/icons/geoobjects/snow_storage.svg'),
  fueling_water: require('assets/icons/geoobjects/fueling_water.svg'),
  msp: require('assets/icons/geoobjects/msp.svg'),
  ssp: require('assets/icons/geoobjects/ssp.svg'),
};

const makeCacheStyle = (cacheStyleName, { selected, color, geoobj } ) => {
  const style = geoobj in ICONS 
    ? {
      image: new Icon({
        anchor: [0.5, 0.5],
        src: ICONS[geoobj] ? ICONS[geoobj] : ICONS.carpool,
        scale: 1.5,
      }),
    }
    : {
      image: new Circle({
        radius: 6 / DEVICE_PIXEL_RATIO,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.1)',
        }),
        fill: new Fill({
          color:  selected ? 'yellow' : color || UiConstants.colorError,
        }),
      }),
      fill: new Fill({
        color:  selected ? 'yellow' : color || UiConstants.colorError,
      }),
      zIndex: 9,
    };
  return CACHE_ICON[cacheStyleName] = new Style(style);
};

export const getCasheStyleForGeoobject = (selected, color = '', geoobj: string) => {
  const cacheStyleName = `${selected}/${color}/${geoobj}`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
      { selected, color, geoobj },
    );
  }
  console.info(icon);
  return icon;
};
