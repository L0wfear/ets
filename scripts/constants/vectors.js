export function createArrowStyle(start, end) {
  var dx = end[0] - start[0];
  var dy = end[1] - start[1];
  var rotation = Math.atan2(dy, dx);

  return new ol.style.Style({
    geometry: new ol.geom.Point(end),
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: 'red'}),
      points: 3,
      radius: 4,
      stroke: new ol.style.Stroke({
        color: 'red'
      }),
      rotateWithView: false,
      rotation: -rotation + (Math.PI / 2)
    }),
  });
};

export const vectorState = {
  SELECTABLE: 1,
  ENABLED: 2,
  IDLE: 3
};

export const vectorStyles = {
  [vectorState.ENABLED]: new ol.style.Style({
     fill: new ol.style.Fill({
          color: 'rgba(0,0,0,0.2)'
     }),
     stroke: new ol.style.Stroke({
          color: 'red',
          width: 2,
          //lineDash: [4],
     })
  }),
  [vectorState.IDLE]: new ol.style.Style({
     fill: new ol.style.Fill({
          color: 'rgba(0,0,0,0.2)'
     }),
     stroke: new ol.style.Stroke({
          color: 'blue',
          width: 2,
          lineDash: [2],
     })
  })
};

export function getVectorArrowStyle(feature) {
  let styles = [];
  //let styles = [vectorStyles[vectorState.ENABLED]];

  var geometry = feature.getGeometry();
  var  i = 0;
  geometry.forEachSegment((start, end) => {
    styles.push(new ol.style.Style({
       geometry: new ol.geom.LineString([start, end]),
       fill: new ol.style.Fill({
            color: 'rgba(0,0,0,0.2)'
       }),
       stroke: new ol.style.Stroke({
            color: 'red',
            width: 2,
       })
    }));
   styles.push(createArrowStyle(start, end));
  });

  return styles;
};

export function getVectorSource() { return new ol.source.Vector({wrapX: false}); }

export function getVectorLayer(source) {
  return new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    }),
    updateWhileAnimating: false,
    updateWhileInteracting: false
  });
}
