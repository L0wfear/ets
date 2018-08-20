const DEVICE_PIXEL_RATIO = window.devicePixelRatio / 2;

const CACHE_ICON = {};

const makeCacheStyle = (cacheStyleName, { selected } ) => {
  return CACHE_ICON[cacheStyleName] = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6 / DEVICE_PIXEL_RATIO,
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.1)',
      }),
      fill: new ol.style.Fill({
        color:  selected ? 'yellow' : 'red',
      }),
    }),
    fill: new ol.style.Fill({
      color:  selected ? 'yellow' : 'red',
    }),
    zIndex: 9,
  });
}

export const getCasheStyleForGeoobject = (selected) => {
  const cacheStyleName = `${selected}`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
      { selected },
    );
  }

  return icon;
}