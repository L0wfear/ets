
export const polyState = {
  SELECTABLE: 1,
  ENABLED: 2,
  IDLE: 3
}

export const polyStyles = {
	[polyState.SELECTABLE]: new ol.style.Style({
       fill: new ol.style.Fill({
            color: 'rgba(0,0,0,0.2)'
       }),
       stroke: new ol.style.Stroke({
            color: 'grey',
            width: 1
       })
    }),
	[polyState.ENABLED]: new ol.style.Style({
       fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.5)'
       }),
       stroke: new ol.style.Stroke({
            color: 'red',
            width: 1
       })
    }),
	[polyState.IDLE]: new ol.style.Style({
       fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.5)'
       }),
       stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
       })
    })
};
