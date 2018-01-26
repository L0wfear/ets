// тут задаются стили иконок пунктов слива топлива

import leakIconSmall from 'assets/icons/leaks/oil-02(small).png';

const leakImage = new Image();
leakImage.src = leakIconSmall;

export const leakIcon = {
  'geoobject': new ol.style.Style({
    image: new ol.style.Icon({
      src: leakImage.src,
      offset: [0, 0],
    }),
  }),
  'geoobject-selected': new ol.style.Style({
    image: new ol.style.Icon({
      src: leakImage.src,
      offset: [0, 0],
      opacity: 0.6,
    }),
  }),
};
