// тут задаются стили иконок пунктов слива топлива
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
