import React from 'react';
import { connect } from 'react-redux';
import { GeoJSON, getPointStyle, getPolyStyle } from 'utils/ol';
import { polyState, polyStyles } from 'constants/polygons.js';
import { getVectorArrowStyle } from 'constants/vectors.js';
import FluxComponent from 'flummox/component';
import _ from 'lodash';
import Map from './Map.jsx';
import CarMarker from './markers/car/CarMarker.js';
import LegendWrapper from './LegendWrapper.jsx';

let POLYS_LAYER = null;

// TODO синхронизировать с Map, чтобы один класс мог поддерживать все геометрии
@connect(
  state => state.types
)
export default class HybridMap extends Map {
  constructor(props, context) {
    super(props, context);

    this.state = {
      zoom: null,
    };
  }

  updatePoints(updatedPoints) {
    const keys = Object.keys(updatedPoints);

    for (let i = 0, till = keys.length; i < till; i++) {
      const key = keys[i];
      const point = updatedPoints[key];

      if (point.timestamp === 1420074000000) {
        continue;
      }

      if (!point.car) continue;
      if (point.car.gov_number !== this.props.car_gov_number) continue;

      const oldPoint = this.markers[key];
      if (oldPoint) {
        oldPoint.setPoint(point);
      } else {
        this.markers[key] = new CarMarker(point, this, {
          maxSpeed: this.props.maxSpeed,
        });
      }
    }
    this.props.flux.getStore('points').handleUpdateTrack([]);
    this.triggerRender();
  }

  componentDidMount() {
    super.componentDidMount();

    this.renderPolygons(this.props.polys, true);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);

    if (nextProps.selectedPoly !== undefined && !_.isEqual(this.props.selectedPoly, nextProps.selectedPoly)) {
      this.renderSelectedPoly(nextProps.selectedPoly, nextProps.showSelectedElement);
    }

    if (nextProps.selectedPoly !== undefined && nextProps.showSelectedElement !== this.props.showSelectedElement) {
      this.renderSelectedPoly(nextProps.selectedPoly, nextProps.showSelectedElement);
    }
  }

  renderPolygons(polys = {}, showPolygons) {
    const map = this.map;

    const vectorSource = new ol.source.Vector();
    let styleFunction = polyStyles[polyState.SELECTABLE];

    if (showPolygons) {
      _.each(polys, (poly, key) => {
        const feature = new ol.Feature({
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
            _.each(this.props.selectedObjects, (o) => {
              if (o.coordinates.x_msk === poly.shape.coordinates[0] && o.coordinates.y_msk === poly.shape.coordinates[1]) {
                succeed = true;
              }
            });
            if (succeed) {
              feature.setStyle(getPointStyle('green'));
            } else {
              feature.setStyle(getPointStyle('red'));
            }
          } else {
            styleFunction = null;
          }
        }

        vectorSource.addFeature(feature);
      });
    }

    !!POLYS_LAYER && map.removeLayer(POLYS_LAYER);

    const polysLayerObject = {
      source: vectorSource,
    };
    if (styleFunction) {
      polysLayerObject.style = styleFunction;
    }
    const polysLayer = new ol.layer.Vector(polysLayerObject);

    POLYS_LAYER = polysLayer;

    map.addLayer(polysLayer);
    if (this.props.routeCenter) {
      const extent = polysLayer.getSource().getExtent();
      extent[0] !== Infinity && map.getView().fit(extent, map.getSize());
    }
  }

  renderSelectedPoly(selectedPoly, showSelectedElement) {
    const vectorSource = new ol.source.Vector();
    const { map } = this;

    if (!showSelectedElement) {
      return !!this.selectedPolysLayer && map.removeLayer(this.selectedPolysLayer);
    }

    const feature = new ol.Feature({
      geometry: GeoJSON.readGeometry(selectedPoly.shape),
      name: selectedPoly.name,
    });

    vectorSource.addFeature(feature);

    const extent = feature.getGeometry().getExtent();
    extent[0] !== Infinity && map.getView().fit(extent, map.getSize());
    map.getView().setZoom(7);

    !!this.selectedPolysLayer && map.removeLayer(this.selectedPolysLayer);

    this.selectedPolysLayer = new ol.layer.Vector({
      source: vectorSource,
      style: getPolyStyle('#e67e22'),
    });

    map.addLayer(this.selectedPolysLayer);
  }

  renderCanvas(canvas, extent) {
    const map = this.map;
    const pointsStore = this._pointsStore;

    const selected = pointsStore.getSelectedPoint();

    const selectedMarker = pointsStore.getSelectedMarker();

    const optimizedMarkers = this.getMarkersInBounds(extent);
    this.viewportVisibleMarkers = optimizedMarkers;

    const options = {
      showPlates: this.props.showPlates,
    };

    const keys = Object.keys(optimizedMarkers);
    for (let i = 0, till = keys.length; i < till; i++) {
      const key = keys[i];
      const marker = optimizedMarkers[key];
      const id = marker.point.id;

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
      selectedMarker.render({ selected: true, ...options });
    }

    return canvas;
  }

  async onClick(ev) {
    const coordinate = ev.coordinate;

    const currentSelectedPoint = this._pointsStore.getSelectedPoint();
    if (currentSelectedPoint) {
      const marker = currentSelectedPoint.marker;
      if (marker.hasTrackLoaded()) {
        const track = marker.track;
        const possibleTrackPoint = track.getPointAtCoordinate(coordinate);
        if (possibleTrackPoint !== null) {
          const pointCoords = possibleTrackPoint.coords_msk;
          let prevPoint = null;
          let nextPoint = null;
          track.points.forEach((point, i) => {
            if (point.coords === possibleTrackPoint.coords) {
              nextPoint = track.points[i + 1] ? track.points[i + 1] : null;
              prevPoint = track.points[i - 1] ? track.points[i - 1] : null;
            }
          });
          const makePopupFn = await track.getTrackPointTooltip(this.props.flux, possibleTrackPoint, prevPoint, nextPoint);
          this.popup.show(pointCoords, makePopupFn());
          return;
        }
      }
    }
  }

  render() {
    return (
      <div ref={node => (this._container = node)} className="openlayers-container">
        <FluxComponent connectToStores={['settings']}>
          <LegendWrapper
            controls={['track', 'route', 'element']}
            zoom={this.state.zoom}
            marker={() => this._pointsStore.getSelectedMarker()}
          />
        </FluxComponent>
      </div>
    );
  }

}
