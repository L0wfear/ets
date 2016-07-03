
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
    }),
  'info': new ol.style.Style({
         fill: new ol.style.Fill({
              color: '#e67e22'
         }),
         stroke: new ol.style.Stroke({
              color: '#e67e22',
              width: 1
         })
      }),
  'green': new ol.style.Style({
         fill: new ol.style.Fill({
              color: 'green'
         }),
         stroke: new ol.style.Stroke({
              color: 'green',
              width: 1
         })
      })
};

export const pointStyles = {
  'success': new ol.style.Style({
     //geometry: new ol.geom.Point([start, end]),
     fill: new ol.style.Fill({
          color: 'rgba(0,0,0,0.2)'
     }),
     stroke: new ol.style.Stroke({
          color: 'green',
          width: 2,
     })
  }),
  'fail': new ol.style.Style({
     //geometry: new ol.geom.LineString([start, end]),
     fill: new ol.style.Fill({
          color: 'rgba(0,0,0,0.2)'
     }),
     stroke: new ol.style.Stroke({
          color: 'red',
          width: 2,
     })
  })
}

export function getPointStyle(status) {
  let color = status === 'success' ? 'green' : 'red';

  return new ol.style.Style({
      image: new ol.style.Circle({
         fill: new ol.style.Fill({
              color,
         }),
         stroke: new ol.style.Stroke({
              color,
              width: 2,
         }),
        radius: 5
      }),
  })
}
