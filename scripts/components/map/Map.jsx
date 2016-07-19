import React, { Component, PropTypes } from 'react';
import CarMarker from './markers/car/CarMarker.js';
import { PROJECTION, ArcGisLayer, projectToPixel } from './MskAdapter.js';
import LegendWrapper from './LegendWrapper.jsx';
import FluxComponent from 'flummox/component';
import { polyState, polyStyles, pointStyles, getPointStyle } from 'constants/polygons.js';
import { vectorStyles, vectorState, getVectorArrowStyle, getVectorLayer, getVectorSource } from 'constants/vectors.js';
import { GeoJSON } from 'utils/ol';

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
export default class OpenLayersMap extends Component {

  static propTypes = {
    points: PropTypes.object,
    polys: PropTypes.object,
    showPolygons: PropTypes.bool,
    showTrack: PropTypes.bool,
    onFeatureClick: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
    let self = this;

    this.markers = {}; // container for markers on map
    this._handlers = null; // container for map event handlers
    // TODO убрать взаимодействие со сторами из этого компонента
    this._pointsStore = this.props.flux.getStore('points');
    this._geoObjectsStore = this.props.flux.getStore('geoObjects');

    this.viewportVisibleMarkers = {};

    let initialView = new ol.View({
      center: this.props.center,
      zoom: this.props.zoom,
      minZoom: 2,
      maxZoom: 13,
      projection: PROJECTION,
      extent: PROJECTION.getExtent()
    });

    let renderFn = this.renderCanvas.bind(this);
    let canvasLayer = this.canvasLayer = new ol.layer.Image({
      source: new ol.source.ImageCanvas({
        canvasFunction: function draw(extent, res, pixelRatio, size, proj) {
          if (!this.canvas) {
            self.canvas = this.canvas = document.createElement('canvas');
            self.context = this.canvas.getContext('2d');
          }
          this.canvas.setAttribute('width', size[0]);
          this.canvas.setAttribute('height', size[1]);

          return renderFn(this.canvas, extent, pixelRatio);
        },
        ratio: 1
      }),
      zIndex: 9999
    });

    // canvasLayer.setZIndex(9999);

    let controls = []
    controls.push(new ol.control.Zoom({
      duration: 400,
      className: 'ol-zoom',
      delta: 1
    }))

    let map = new ol.Map({
      view: initialView,
      renderer: ['canvas','dom'],
      controls: controls,
      layers: [ArcGisLayer, canvasLayer]
    });

    this.map = map;
    this.map.projectToPixel = (coordinates) => projectToPixel(this.map, coordinates);

    this.state = {
      zoom: null
    };
  }

  /**
   * initialization here
   */
  componentDidMount() {

    let map = this.map;
    let container = this.refs.container;

    map.setTarget(container);
    map.on('postcompose', this.triggerRender.bind(this));

    this.popup = new ol.Overlay.Popup();
    map.addOverlay(this.popup);

    this.enableInteractions();
  }

  triggerRender() {
    this.canvasLayer.getSource().changed();
  }

  onMouseMove(ev) {

    let map = this.map;
    let coordinate = ev.coordinate;
    let pixel = ev.pixel;
    let changeCursor = false;

    let markers = this.viewportVisibleMarkers;
    for (let key in markers) {
      let marker = markers[key];

      if (marker.contains(coordinate)) {
        changeCursor = true;
        break;
      }
    }

    if (this._pointsStore.hasMarkerSelected()) {
      let currentSelectedMarker = this._pointsStore.getSelectedMarker();
      if (currentSelectedMarker.hasTrackLoaded()) {
        let possibleTrackPoint = currentSelectedMarker.track.getPointAtCoordinate(coordinate);
        if (possibleTrackPoint) {
          changeCursor = true;
        }
      }
    }

    let hit = map.forEachFeatureAtPixel(pixel, (feature, layer) => true);

    let el = map.getViewport();
    el.style.cursor = changeCursor || hit ? 'pointer' : '';
  }


  async onClick(ev) {

    let map = this.map;
    let pixel = ev.pixel; // координаты клика во viewport
    let coordinate = ev.coordinate;
    let store = this._pointsStore;
    let clickedMarker = null;
    let cancelSelection = false;

    // проверка – не кликнули на точку трэка?
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
          //console.log( 'trackpoint  found', possibleTrackPoint);
          let makePopupFn = await track.getTrackPointTooltip(possibleTrackPoint, prevPoint, nextPoint);
          this.popup.show(pointCoords, makePopupFn());
          return;
        }
      }
    }

    // по какому маркеру кликнули?
    let markers = this.viewportVisibleMarkers;
    for (let key in markers) {
      let marker = markers[key];

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

    map.forEachFeatureAtPixel(pixel, (feature, layer) =>  {
      this.props.onFeatureClick(feature, ev, this);
    });
  }

  hidePopup() {
    this.popup.hide()
  }

  renderPolygons(polys = {}, showPolygons) {
    let map = this.map;

    let vectorSource = new ol.source.Vector();
    // let styleFunction = polyStyles[polyState.SELECTABLE];

    if (showPolygons) {
      _.each(polys, (poly, key) => {
        let feature = new ol.Feature({
          geometry: GeoJSON.readGeometry(poly.shape),
          name: poly.name,
          id: key,
          state: poly.state,
          data: poly.data
        });
        if (poly.shape && poly.shape.type === 'LineString') {
          feature.setStyle(getVectorArrowStyle(feature));
        } else if (poly.shape && poly.shape.type !== 'Point') {
          if (poly.selected) {
            feature.setStyle(polyStyles['geoobject-selected']);
          } else {
            feature.setStyle(polyStyles['geoobject']);
          }
        } else { // Если точка
          if (poly.selected) {
            feature.setStyle(pointStyles['geoobject-selected']);
          } else {
            feature.setStyle(pointStyles['geoobject']);
          }
        }

        vectorSource.addFeature(feature);
      });
    }

    !!POLYS_LAYER && map.removeLayer(POLYS_LAYER);

    let polysLayerObject = {
      source: vectorSource,
    };
    // if (styleFunction) {
    //   polysLayerObject.style = styleFunction;
    // }
    let polysLayer = new ol.layer.Vector(polysLayerObject);

    POLYS_LAYER = polysLayer;

    map.addLayer(polysLayer);
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
      selectedMarker.render({selected: true, ...options});

      if (pointsStore.state.trackingMode) { // следить за машиной
        let view = map.getView();
        let zoom = view.getZoom();
        let size = map.getSize();
        let pixel = [(size[0] - SIDEBAR_WIDTH_PX) / 2, size[1] / 2];

        view.centerOn(selectedMarker.coords, size, pixel)
        if (zoom < 12) {
          view.setZoom(12)
        }
        this.disableInteractions();
      } else {
        this.enableInteractions()
      }

    } else {
      this.enableInteractions()
    }

    // TODO remove this
    if (!selected) {
      this.hidePopup()
    }

    return canvas;
  }

  enableInteractions() {
    let map = this.map;
    let interactions = map.getInteractions();

    if (this._handlers === null) {
      this._handlers = {
        singleclick: map.on('singleclick', this.onClick.bind(this)),
        pointermove: map.on('pointermove', this.onMouseMove.bind(this)),
        moveend: map.on('moveend', this.onMoveEnd.bind(this))
      };

      interactions.forEach((interaction)=> {
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
    let zoom = this.map.getView().getZoom();
    if (zoom !== this.state.zoom) {
      this.setState({zoom});
    }
  }

  disableInteractions() {
    let map = this.map;
    let interactions = this.map.getInteractions();

    if (this._handlers !== null) {
      map.unByKey(this._handlers.singleclick);
      map.unByKey(this._handlers.pointermove);
      map.unByKey(this._handlers.moveend);
      this._handlers = null;

      interactions.forEach((interaction)=> {
        interaction.setActive(false)
      });
    }
  }

  getMarkersInBounds(bounds) {

    let markersInBounds = [];
    let markers = this.markers;
    let keys = Object.keys(markers);

    function containsCoordinate(extent, coordinates) {
      const x = coordinates[0];
      const y = coordinates[1];
      return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
    }

    for (let i = 0, till = keys.length; i < till; i++) {
      let key = keys[i];
      let marker = markers[key];

      if (containsCoordinate(bounds, marker.coords) && marker.isVisible()) {
        markersInBounds.push(marker);
      }
    }

    return markersInBounds;
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

  updatePoints(updatedPoints) {
    let keys = Object.keys(updatedPoints);

    for (let i = 0, till = keys.length; i < till; i++) {

      let key = keys[i];
      let point = updatedPoints[key];

      // TODO это че такое
      if (point.timestamp === 1420074000000) {
        continue;
      }

      let oldMarker = this.markers[key];
      if (oldMarker) {
        oldMarker.setPoint(point)
      } else {
        this.markers[key] = new CarMarker(point, this);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Делаем ререндер компонента только в случае изменения зума для передачи в легенду
    if (this.state.zoom !== nextState.zoom) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div>
        <div ref="container" className="openlayers-container"></div>
      </div>
    );
  }

}
