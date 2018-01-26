// тут задаются стили иконок пунктов слива топлива

import leakIconSmall from 'assets/icons/track/oil-02.png';

export const leakIcon = {
  'geoobject': new ol.style.Style({
    image: new ol.style.Icon({
      src: leakIconSmall,
      offset: [0, 0],
      scale: 0.2,
    }),
  }),
  'geoobject-selected': new ol.style.Style({
    image: new ol.style.Icon({
      src: leakIconSmall,
      offset: [0, 0],
      opacity: 0.6,
      scale: 0.2,
    }),
  }),
};
