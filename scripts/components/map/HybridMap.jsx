import React from 'react';
import Map from './Map.jsx';
import CarMarker from './markers/car/CarMarker.js';
import LegendWrapper from './LegendWrapper.jsx';
import { GeoJSON } from 'utils/ol';
import Div from 'components/ui/Div.jsx';
import { Glyphicon, Button } from 'react-bootstrap';
import { polyState, polyStyles, pointStyles, getPointStyle } from 'constants/polygons.js';
import { vectorStyles, vectorState, getVectorArrowStyle, getVectorLayer, getVectorSource } from 'constants/vectors.js';
import FluxComponent from 'flummox/component';
import _ from 'lodash';

let POLYS_LAYER = null;
// TODO синхронизировать с Map, чтобы один класс мог поддерживать все геометрии
export default class HybridMap extends Map {
  constructor(props) {
    super(props);
    this.zoomedPolyName = null;
    this.state = {
      zoom: null
    };
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

    this.renderPolygons(this.props.polys, true);
  }

  renderPolygons(polys = {}, showRoute) {
    let map = this.map;

    let vectorSource = new ol.source.Vector();
    let styleFunction = polyStyles[polyState.SELECTABLE];

    if (showRoute) {
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
            feature.setStyle(polyStyles[poly.state]);
        } else { // Если точка
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

  renderSelectedPoly(selectedPoly, showSelectedElement) {

    let vectorSource = new ol.source.Vector();
    let { map } = this;

    if (!showSelectedElement) {
      return !!this.polysLayer && map.removeLayer(this.polysLayer);
    }

    let feature = new ol.Feature({
      geometry: GeoJSON.readGeometry(selectedPoly.shape),
      name: selectedPoly.name
    });
    feature.setStyle(polyStyles['info']);

    vectorSource.addFeature(feature);

    if (this.zoomedPolyName !== selectedPoly.name) {
      map.getView().fit(feature.getGeometry().getExtent(), map.getSize());
      map.getView().setZoom(7);
      this.zoomedPolyName = selectedPoly.name;
    }

    !!this.polysLayer && map.removeLayer(this.polysLayer);

    this.polysLayer = new ol.layer.Vector({
      source: vectorSource
    });

    map.addLayer(this.polysLayer);
  }

  renderCanvas(canvas, extent) {
    let map = this.map;
    let pointsStore = this._pointsStore;

    let selected = pointsStore.getSelectedPoint();

    let selectedMarker = pointsStore.getSelectedMarker();

    let optimizedMarkers = this.getMarkersInBounds(extent);
    this.viewportVisibleMarkers = optimizedMarkers;

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
      if (this.props.showTrack) {
        if (selectedMarker.hasTrackLoaded()) {
          selectedMarker.track.render(this.props.maxSpeed);
        }
      }
      selectedMarker.render({selected: true, ...options});
    }

    return canvas;
  }

  async onClick(ev) {
    let map = this.map;
    let pixel = ev.pixel; // координаты клика во viewport
    let coordinate = ev.coordinate;
    let store = this._pointsStore;
    let clickedMarker = null;
    let cancelSelection = false;

    let currentSelectedPoint = this._pointsStore.getSelectedPoint();
    if (currentSelectedPoint) {
      let marker = currentSelectedPoint.marker;
      if (marker.hasTrackLoaded()) {
        let track = marker.track;
        let possibleTrackPoint = track.getPointAtCoordinate(coordinate);
        if (possibleTrackPoint !== null) {
          let pointCoords = possibleTrackPoint.coords_msk;
          let prevPoint, nextPoint = null;
          track.points.forEach((point, i) => {
            if (point.coords === possibleTrackPoint.coords) {
                nextPoint = track.points[i+1] ? track.points[i+1] : null;
                prevPoint = track.points[i-1] ? track.points[i-1] : null;
            };
          });
          let makePopupFn = await track.getTrackPointTooltip(possibleTrackPoint, prevPoint, nextPoint);
          this.popup.show(pointCoords, makePopupFn());
          return;
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);

    if (nextProps.polys !== undefined && !_.isEqual(this.props.polys, nextProps.polys)) {
      this.renderPolygons(nextProps.polys, nextProps.showRoute);
    }

    if (nextProps.polys !== undefined && nextProps.showRoute !== this.props.showRoute) {
      this.renderPolygons(nextProps.polys, nextProps.showRoute);
    }

    if (nextProps.selectedPoly !== undefined && !_.isEqual(this.props.selectedPoly, nextProps.selectedPoly)) {
      this.renderSelectedPoly(nextProps.selectedPoly, nextProps.showSelectedElement);
    }

    if (nextProps.selectedPoly !== undefined && nextProps.showSelectedElement !== this.props.showSelectedElement) {
      this.renderSelectedPoly(nextProps.selectedPoly, nextProps.showSelectedElement);
    }
  }

  render() {

    return (
      <div>
        <div ref="container" className="openlayers-container">

          <FluxComponent connectToStores={['settings']}>
            <LegendWrapper zoom={this.state.zoom} marker={() => this._pointsStore.getSelectedMarker()}/>
          </FluxComponent>

        </div>
      </div>
    )
  }

}
