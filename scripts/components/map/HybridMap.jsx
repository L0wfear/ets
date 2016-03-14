import React from 'react';
import Map from './Map.jsx';
import CarMarker from '../markers/car/Marker.js';
import { projectToPixel } from './MskAdapter.js';
import { getTrack } from '../../adapter.js';
import { getStartOfToday, makeDate, makeTime } from '../../utils/dates.js';
import { swapCoords, roundCoordinates } from '../../utils/geo.js';
import { TRACK_COLORS, TRACK_LINE_OPACITY, TRACK_LINE_WIDTH, TRACK_POINT_RADIUS, SHOW_ONLY_POINTS_WITH_SPEED_CHANGES } from '../../constants/track.js';


import { polyState, polyStyles, pointStyles, getPointStyle } from '../../constants/polygons.js';
import { vectorStyles, vectorState, getVectorArrowStyle, getVectorLayer, getVectorSource } from '../../constants/vectors.js';


let POLYS_LAYER = null;
global.ol = ol;

export default class HybridMap extends Map {
  constructor(props) {
    super(props);
    this.zoomedPolyName = null;
  }

  updatePoints(updatedPoints) {

    let keys = Object.keys(updatedPoints);

    for (let i = 0, till = keys.length; i < till; i++) {

      let key = keys[i];
      let point = updatedPoints[key];

      if (point.timestamp === 1420074000000) {
        continue;
      }

      if (!point.car) continue;
      if (point.car.gov_number !== this.props.car_gov_number) continue;

      let oldPoint = this.markers[key];
      if (oldPoint) {
        oldPoint.setPoint(point)
      } else {
        this.markers[key] = new CarMarker(point, this);
      }
    }
  }

  componentDidMount() {
    super.componentDidMount();

    this.renderPolygons(this.props.polys, this.props.selectedPoly);
  }

  renderPolygons(polys = {}, selectedPoly) {
    let map = this.map;

    let GeoJSON = new ol.format.GeoJSON();
    let vectorSource = new ol.source.Vector();
    let styleFunction = polyStyles[polyState.SELECTABLE];

    _.each(polys, (poly, key) => {
      let feature = new ol.Feature({
        geometry: GeoJSON.readGeometry(poly.shape),
        name: poly.name,
        id: key,
        state: poly.state,
      });
      if (poly.shape && poly.shape.type === 'LineString') {
        feature.setStyle(getVectorArrowStyle(feature));
      } else if (poly.shape && poly.shape.type !== 'Point') {
        // console.log(poly.isInfo)
        // if (poly.isInfo) {
        //   feature.setStyle(polyStyles['info']);
        // } else {
          feature.setStyle(polyStyles[poly.state]);
        //}
      } else {
        if (this.props.selectedObjects) {
          let succeed = false;
          _.each(this.props.selectedObjects, o => {
            if (o.coordinates.x_msk === poly.shape.coordinates[0] && o.coordinates.y_msk === poly.shape.coordinates[1]) {
              succeed = true;
            }
          })
          if (succeed) {
            feature.setStyle(getPointStyle('success'));
          } else {
            feature.setStyle(getPointStyle('fail'));
          }
        } else {
          styleFunction = null;
        }
      }

      vectorSource.addFeature(feature);
    });

    if (selectedPoly) {
      let feature = new ol.Feature({
        geometry: GeoJSON.readGeometry(selectedPoly.shape),
        name: selectedPoly.name,
        id: 1,
        state: selectedPoly.state,
      });
      feature.setStyle(polyStyles['info']);
      vectorSource.addFeature(feature);
      if (this.zoomedPolyName !== selectedPoly.name) {
        map.getView().fit(feature.getGeometry().getExtent(), map.getSize());
        map.getView().setZoom(7);
        this.zoomedPolyName = selectedPoly.name;
      }
    }

    !!POLYS_LAYER && map.removeLayer(POLYS_LAYER);

    let polysLayerObject = {
      source: vectorSource,
    };
    if (styleFunction) {
      polysLayerObject.style = styleFunction;
    }
    let polysLayer = new ol.layer.Vector(polysLayerObject);

    POLYS_LAYER = polysLayer;

    map.addLayer(polysLayer);
  }

  renderCanvas(canvas, extent) {

    // canvas example
    // https://gist.github.com/acanimal/b2f60367badb0b17a4d9

    let map = this.map;
    let pointsStore = this._pointsStore;

    let selected = pointsStore.getSelectedPoint();

    let selectedMarker = pointsStore.getSelectedMarker();

    let optimizedMarkers = this.viewportVisibleMarkers = this.getMarkersInBounds(extent);

    const options = {
      showPlates: this.props.showPlates
    };

    let keys = Object.keys(optimizedMarkers);
    for (let i = 0, till = keys.length; i < till; i++) {
      let key = keys[i];
      let marker = optimizedMarkers[key];
      let id = marker.point.id;

      if (selected === null || id !== selected.id) {
        marker.render(options);
      }
    }

    if (selectedMarker) {
      if (selectedMarker.hasTrackLoaded()) {
        selectedMarker.track.render();
      }
      selectedMarker.render({selected: true, ...options});
    }

    return canvas;
  }

  onMouseMove() {

  }

  onClick() {

  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.polys !== undefined) {
      this.renderPolygons(nextProps.polys, nextProps.selectedPoly);
    }
  }

}
