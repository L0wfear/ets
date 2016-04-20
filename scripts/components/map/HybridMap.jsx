import React from 'react';
import Map from './Map.jsx';
import CarMarker from '../markers/car/CarMarker.js';
import { projectToPixel } from './MskAdapter.js';
import { getTrack } from '../../adapter.js';
import { getStartOfToday, makeDate, makeTime } from 'utils/dates';
import { swapCoords, roundCoordinates } from 'utils/geo';
import { TRACK_COLORS } from '../../constants/track.js';
import Div from '../ui/Div.jsx';
import { Glyphicon, Button } from 'react-bootstrap';
import { polyState, polyStyles, pointStyles, getPointStyle } from '../../constants/polygons.js';
import { vectorStyles, vectorState, getVectorArrowStyle, getVectorLayer, getVectorSource } from '../../constants/vectors.js';
import cx from 'classnames';
import FluxComponent from 'flummox/component';
import _ from 'lodash';


let POLYS_LAYER = null;
let GeoJSON = new ol.format.GeoJSON();
global.ol = ol;

let ControlComponent = (props) =>
  <span className={cx({'half-visible': !props.active})}>
    {props.control.color ? <button className={'status-filter-icon'} onClick={props.onClick} style={{ backgroundColor: props.control.color}}></button> : null}
    {props.control.title}
  </span>
;


class LegendWrapper extends React.Component {

  getControls() {
    let controls = [
      {
        title: 'Трек',
        color: this.props.zoom > 8 ? TRACK_COLORS.green : TRACK_COLORS.blue,
        type: 'track'
      },
      {
        title: 'Маршрут',
        color: TRACK_COLORS.red,
        type: 'route'
      },
      {
        title: 'Выбранный элемент',
        color: "#e67e22",
        type: 'element'
      }
    ];
    return controls;
  }

  isComponentActive(type) {
    if ((type === 'track' && this.props.showTrack) ||
        (type === 'route' && this.props.showRoute) ||
        (type === 'element' && this.props.showSelectedElement)) {
          return true;
        }
    return false;
  }

  toggleSettingsControl(type) {
    const { flux } = this.props;
    const settingsActions = flux.getActions('settings');
    switch (type) {
      case 'track':
        settingsActions.setShowTrack(!this.props.showTrack);
        break;
      case 'route':
        settingsActions.setShowRoute(!this.props.showRoute);
        break;
      case 'element':
        settingsActions.setShowSelectedElement(!this.props.showSelectedElement);
        break;
    }
  }

  render() {

    let items = this.getControls()
      .map((control, i) => {
        return (
          <li key={i} className="control-element">
            <ControlComponent active={this.isComponentActive(control.type)}
                              control={control}
                              onClick={this.toggleSettingsControl.bind(this, control.type)}/>
          </li>
        );
      });

    return (
      <div className="legend-wrapper app-toolbar-fill controls-legend-wrapper">
        <ul style={{paddingLeft: 0}}>
          {items}
        </ul>
      </div>
    );
  }
}

export default class HybridMap extends Map {
  constructor(props) {
    super(props);
    this.zoomedPolyName = null;
    this.state = {
      zoom: null
    }
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

    // canvas example
    // https://gist.github.com/acanimal/b2f60367badb0b17a4d9
    // тут рендерятся маркеры и трек

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
      if (this.props.showTrack) {
        if (selectedMarker.hasTrackLoaded()) {
          selectedMarker.track.render();
        }
      }
      selectedMarker.render({selected: true, ...options});
    }

    return canvas;
  }

  onMouseMove() {
    let zoom = this.map.getView().getZoom();
    if (zoom !== this.state.zoom)
    this.setState({zoom});
  }

  onClick() {

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
    const trackButtonTitle = this.props.showTrack ? 'Отключить трек' : 'Включить трек';
    const trackButtonIcon = this.props.showTrack ? 'ban-circle' : 'ok-circle';

    return (
      <div>
        <div ref="container" style={{opacity: 1}} className="openlayers-container">

          <FluxComponent connectToStores={['settings']}>
            <LegendWrapper zoom={this.state.zoom}/>
          </FluxComponent>

        </div>
      </div>
    )
  }

}
