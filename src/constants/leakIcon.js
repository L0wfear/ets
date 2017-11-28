// тут задаются стили кружочков при отображении геообъектов на карте
export const leakIcon = {
  'geoobject': new ol.style.Style({
    image: new ol.style.Icon({
      src: 'src/assets/icons/leaks/oil-02(small).png',
      offset: [0, 0],
    }),
  }),
  'geoobject-selected': new ol.style.Style({
    image: new ol.style.Icon({
      src: 'src/assets/icons/leaks/oil-02(small).png',
      offset: [0, 0],
      opacity: 0.6,
    }),
  }),
};
