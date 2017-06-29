import React, { Component, PropTypes } from 'react';
import CarMarker from './markers/car/CarMarker.js';
import { PROJECTION, ArcGisLayer, projectToPixel } from './MskAdapter.js';
import { polyStyles } from 'constants/polygons.js';
import { pointStyles } from 'constants/points.js';
import { getVectorArrowStyle } from 'constants/vectors.js';
import { GeoJSON, defaultZoom } from 'utils/ol';
import _ from 'lodash';

let POLYS_LAYER = null;
// TODO move to settings
const SIDEBAR_WIDTH_PX = 500;
/**
 * Openlayers docs (latest version)
 * http://openlayers.org/en/latest/apidoc/
 * WebGL example
 * http://openlayers.org/en/master/examples/icon-sprite-webgl.html
 * current WebGL stats
 * http://webglstats.com/
 * Canvas example
 * https://gist.github.com/acanimal/b2f60367badb0b17a4d9
 * OpenLayers performance cases
 * http://trac.osgeo.org/openlayers/wiki/Future/OpenLayersWithCanvas
 * React with ol3
 * https://github.com/pka/ol3-react-example
 * local crs example http://stackoverflow.com/questions/20222885/custom-tiles-in-local-crs-without-projection
 * custom tiles example
 */
 // TODO сделать реализацию завязанной на рендеринг в рамках ЕТС карты
export default class OpenLayersMap extends Component {

  static get propTypes() {
    return {
      typesIndex: PropTypes.object,
      points: PropTypes.object,
      polys: PropTypes.object,
      showPolygons: PropTypes.bool,
      showTrack: PropTypes.bool,
      onFeatureClick: PropTypes.func,
    };
  }

  constructor(props, context) {
    super(props, context);
    const self = this;

    this.markers = {};
    this._handlers = null;
    // TODO убрать взаимодействие со сторами из этого компонента
    this._pointsStore = this.props.flux.getStore('points');
    this._geoObjectsStore = this.props.flux.getStore('geoObjects');

    this.viewportVisibleMarkers = {};

    const initialView = new ol.View({
      center: this.props.center,
      zoom: this.props.zoom,
      minZoom: 2,
      maxZoom: 13,
      projection: PROJECTION,
      extent: PROJECTION.getExtent(),
    });

    const renderFn = this.renderCanvas.bind(this);
    const canvasLayer = new ol.layer.Image({
      source: new ol.source.ImageCanvas({
        canvasFunction(extent, res, pixelRatio, size) {
          if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            self.canvas = this.canvas;
            self.context = this.canvas.getContext('2d');
          }
          this.canvas.setAttribute('width', size[0]);
          this.canvas.setAttribute('height', size[1]);

          return renderFn(this.canvas, extent, pixelRatio);
        },
        ratio: 1,
      }),
      zIndex: 9999,
    });
    this.canvasLayer = canvasLayer;

    const map = new ol.Map({
      view: initialView,
      controls: [defaultZoom],
      layers: [ArcGisLayer, canvasLayer],
      loadTilesWhileAnimating: true,
    });
    map.disableInteractions = this.disableInteractions.bind(this);
    map.enableInteractions = this.enableInteractions.bind(this);

    this.map = map;
    global.olmap = map;
    map.set('parent', this);
    this.map.projectToPixel = coordinates => projectToPixel(this.map, coordinates);

    this.state = {
      zoom: null,
    };
  }

  /**
   * initialization here
   */
  componentDidMount() {
    const map = this.map;

    map.setTarget(this._container);
    // Оставлю это здесь. так делать не надо, канвас начинает адово тупить
    // this.triggerRenderEventKey = map.on('postcompose', this.triggerRender.bind(this));
    // this.triggerRender();
    this.popup = new ol.Overlay.Popup();
    map.addOverlay(this.popup);

    this.enableInteractions();
  }

  componentWillReceiveProps(nextProps) {
    const hasPoints = nextProps.points !== undefined;
    const hasPolys = nextProps.polys !== undefined;
    const polysHasChanged = hasPolys && !_.isEqual(this.props.polys, nextProps.polys);
    const showPolygonsChanged = hasPolys && nextProps.showPolygons !== this.props.showPolygons;
    const selectedFeatureChanged = !_.isEqual(this.props.selectedFeature, nextProps.selectedFeature);

    if (hasPoints) {
      this.updatePoints(nextProps.points);
    }

    if (hasPolys && (polysHasChanged || showPolygonsChanged || selectedFeatureChanged)) {
      this.renderPolygons(nextProps.polys, nextProps.showPolygons);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.zoom !== nextState.zoom) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.disableInteractions();
  }

  onMouseMove(ev) {
    const map = this.map;
    const coordinate = ev.coordinate;
    const pixel = ev.pixel;
    let changeCursor = false;

    const markers = this.viewportVisibleMarkers;
    for (const key in markers) {
      const marker = markers[key];

      if (marker.contains(coordinate)) {
        changeCursor = true;
        break;
      }
    }

    if (this._pointsStore.hasMarkerSelected()) {
      const currentSelectedMarker = this._pointsStore.getSelectedMarker();
      if (currentSelectedMarker.hasTrackLoaded()) {
        const possibleTrackPoint = currentSelectedMarker.track.getPointAtCoordinate(coordinate);
        if (possibleTrackPoint) {
          changeCursor = true;
        }
      }
    }

    const hit = map.forEachFeatureAtPixel(pixel, () => true);

    const el = map.getViewport();
    el.style.cursor = changeCursor || hit ? 'pointer' : '';
  }

  async handleFeatureClick(track, possibleTrackPoint, event) {
    const pointCoords = possibleTrackPoint.coords_msk;
    let prevPoint = null;
    let nextPoint = null;
    track.points.forEach((point, i) => {
      if (point.coords === possibleTrackPoint.coords) {
        nextPoint = track.points[i + 1] ? track.points[i + 1] : null;
        prevPoint = track.points[i - 1] ? track.points[i - 1] : null;
      }
    });
    // console.log( 'trackpoint  found', possibleTrackPoint);
    const makePopupFn = await track.getTrackPointTooltip(this.props.flux, possibleTrackPoint, prevPoint, nextPoint, event);
    this.popup.show(pointCoords, makePopupFn());
  }

  onClick(ev) {
    const map = this.map;
    const pixel = ev.pixel; // координаты клика во viewport
    const coordinate = ev.coordinate;
    const store = this._pointsStore;
    let clickedMarker = null;

    // проверка – не кликнули на точку трэка?
    const currentSelectedPoint = this._pointsStore.getSelectedPoint();
    if (currentSelectedPoint) {
      const marker = currentSelectedPoint.marker;
      if (marker.hasTrackLoaded()) {
        const track = marker.track;
        const possibleTrackPoint = track.getPointAtCoordinate(coordinate);
        if (possibleTrackPoint !== null) {
          this.handleFeatureClick(track, possibleTrackPoint);
          return;
        }
      }
    }

    // по какому маркеру кликнули?
    const markers = this.viewportVisibleMarkers;
    for (const key in markers) {
      const marker = markers[key];

      if (marker.contains(coordinate)) {
        clickedMarker = marker;
        break;
      }
    }

    if (clickedMarker) {
      clickedMarker.onClick();
      store.handleSelectPoint(clickedMarker.point);
      this._geoObjectsStore.handleSelectFeature(null);
      // прячем попап трэка
      this.hidePopup();
    }

    if (typeof this.props.onFeatureClick === 'function') {
      map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        this.props.onFeatureClick(feature, ev, this);
      });
    }
  }

  hidePopup() {
    this.popup.hide();
  }

  renderPolygons(polys = {}, showPolygons) {
    const map = this.map;

    const vectorSource = new ol.source.Vector();
    // let styleFunction = polyStyles[polyState.SELECTABLE];

    if (showPolygons) {
      _.each(polys, (poly, key) => {
        const feature = new ol.Feature({
          geometry: GeoJSON.readGeometry(poly.shape),
          name: poly.name,
          id: key,
          state: poly.state,
          data: poly.data,
        });
        if (poly.shape && poly.shape.type === 'LineString') {
          feature.setStyle(getVectorArrowStyle(feature));
        } else if (poly.shape && poly.shape.type !== 'Point') {
          if (poly.selected) {
            feature.setStyle(polyStyles['geoobject-selected']);
          } else {
            feature.setStyle(polyStyles.geoobject);
          }
        } else { // Если точка
          if (poly.selected) {
            feature.setStyle(pointStyles['geoobject-selected']);
          } else {
            feature.setStyle(pointStyles.geoobject);
          }
        }

        vectorSource.addFeature(feature);
      });
    }

    !!POLYS_LAYER && map.removeLayer(POLYS_LAYER);

    const polysLayerObject = {
      source: vectorSource,
    };
    // if (styleFunction) {
    //   polysLayerObject.style = styleFunction;
    // }
    const polysLayer = new ol.layer.Vector(polysLayerObject);

    POLYS_LAYER = polysLayer;

    map.addLayer(polysLayer);
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
        if (this.props.showMarkers) {
          // TODO переключать отрисовку маленький/большой значок
          // в зависимости от количества маркеров на видимой части карты
          // будет некрасиво, если попадать точно в границу количества
          marker.render(options);
        }
      }
    }

    if (selectedMarker) {
      if (this.props.showTrack) {
        if (selectedMarker.hasTrackLoaded()) {
          selectedMarker.track.render();
        }
      }
      selectedMarker.render({ selected: true, ...options });

      if (pointsStore.state.trackingMode) { // следить за машиной
        const view = map.getView();
        const zoom = view.getZoom();
        const size = map.getSize();
        const pixel = [(size[0] - SIDEBAR_WIDTH_PX) / 2, size[1] / 2];

        view.centerOn(selectedMarker.coords, size, pixel);
        if (zoom < 12) {
          view.setZoom(12);
        }
        this.disableInteractions();
      } else {
        this.enableInteractions();
      }
    } else {
      this.enableInteractions();
    }

    // TODO remove this
    if (!selected) {
      this.hidePopup();
    }

    return canvas;
  }

  triggerRender() {
    this.canvasLayer.getSource().changed();
  }

  enableInteractions() {
    const map = this.map;
    const interactions = map.getInteractions();

    if (this._handlers === null) {
      this._handlers = {
        singleclick: map.on('singleclick', this.onClick.bind(this)),
        pointermove: map.on('pointermove', this.onMouseMove.bind(this)),
        moveend: map.on('moveend', this.onMoveEnd.bind(this)),
      };

      interactions.forEach((interaction) => {
        interaction.setActive(true);
      });
    }
  }

  /**
   * Вызывается при манипуляциях с картой, таких как перемещение видимой
   * области, зуммирование
   * @method
   */
  onMoveEnd() {
    const zoom = this.map.getView().getZoom();
    console.info(`Центр карты: [${this.map.getView().getCenter()}], зум: ${zoom}`);
    if (zoom !== this.state.zoom) {
      this.setState({ zoom });
    }
  }

  disableInteractions() {
    const map = this.map;
    const interactions = this.map.getInteractions();

    if (this._handlers !== null) {
      // ol.Observable.unByKey(this._handlers.singleclick);
      // ol.Observable.unByKey(this._handlers.pointermove);
      // ol.Observable.unByKey(this._handlers.moveend);
      for (const eventKey in this._handlers) {
        ol.Observable.unByKey(this._handlers[eventKey]);
      }
      this._handlers = null;

      interactions.forEach((interaction) => {
        interaction.setActive(false);
      });
    }
    if (this.triggerRenderEventKey) {
      ol.Observable.unByKey(this.triggerRenderEventKey);
    }
  }

  getMarkersInBounds(bounds) {
    const markersInBounds = [];
    const markers = this.markers;
    const keys = Object.keys(markers);

    function containsCoordinate(extent, coordinates) {
      const x = coordinates[0];
      const y = coordinates[1];
      return (extent[0] <= x && x <= extent[2]) && (extent[1] <= y && y <= extent[3]);
    }

    for (let i = 0, till = keys.length; i < till; i++) {
      const key = keys[i];
      const marker = markers[key];
      if (containsCoordinate(bounds, marker.coords) && marker.isVisible()) {
        markersInBounds.push(marker);
      }
    }

    return markersInBounds;
  }

  updatePoints(updatedPoints) {
    Object.keys(updatedPoints).forEach((key) => {
      const point = updatedPoints[key];
      const oldMarker = this.markers[key];
      if (oldMarker) {
        oldMarker.setPoint(point);
      } else {
        this.markers[key] = new CarMarker(point, this, {});
      }
    });
    this.triggerRender();
  }

  render() {
    return (
      <div key="olmap">
        <div ref={node => (this._container = node)} className="openlayers-container" />
      </div>
    );
  }

}
