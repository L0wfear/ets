// import ol from 'imports?define=>false!openlayers';
import React, { Component } from 'react';
import CarMarker from '../markers/car/Marker.js';
import { PROJECTION, ArcGisLayer } from './MskAdapter.js';


// todo move to settings
const SIDEBAR_WIDTH_PX = 500;

// WebGL example
// http://openlayers.org/en/master/examples/icon-sprite-webgl.html
//
// current WebGL stats
// http://webglstats.com/
//
// OpenLayers performance cases
// http://trac.osgeo.org/openlayers/wiki/Future/OpenLayersWithCanvas

global.ol = ol;

// https://github.com/pka/ol3-react-example
// local crs example http://stackoverflow.com/questions/20222885/custom-tiles-in-local-crs-without-projection
// custom tiles example
export default class OpenLayersMap extends Component {

  constructor(props, context) {
    super(props, context);
    let self = this;

    this.markers = {};
    this._pointsStore = this.props.flux.getStore('points');
    this.viewportVisibleMarkers = {};

    this.tracks = {};
    this.interactions = new ol.interaction.defaults();

    let initialView = new ol.View({
      center: this.props.center,
      zoom: this.props.zoom,
      minZoom: 2,
      maxZoom: 13,
      projection: PROJECTION,
      extent: PROJECTION.getExtent()
    })

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

          return renderFn(this.canvas, extent);
        },
        ratio: 1
      })
    });

    let map = new ol.Map(
      {
        view: initialView,
        //interactions: [this.interactions],
        renderer: ['canvas', 'dom'],
        controls: [new ol.control.Zoom({
          duration: 400,
          className: 'ol-zoom',
          delta: 1
        })],
        layers: [ArcGisLayer, canvasLayer]
      })

    this.map = global.olmap = map;


  }


  shouldComponentUpdate() {
    return false;
  }

  /**
   * initialization here
   */
  componentDidMount() {

    let map = this.map;
    let triggerRenderFn = this.triggerRender.bind(this);
    let container = this.refs.container.getDOMNode();

    map.setTarget(container);

    map.on('postcompose', triggerRenderFn)
    map.on('pointermove', this.onMouseMove.bind(this))
   // map.on('precompose', triggerRenderFn)

    map.on('click', this.onClick.bind(this))
  }

  triggerRender() {
    this.canvasLayer.getSource().changed()
  }

  onMouseMove(ev) {

    let coordinate = ev.coordinate;
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

    let el = this.map.getViewport();
    if (changeCursor) {

      el.style.cursor = 'pointer'
      //el
     // debugger;
    } else {
      el.style.cursor = '';
    }
  }


  getMarkerByCoord(){

  }

  // todo проходить по всем маркерам карты на предмет клика
  // или рендеринга
  traverseMarkers( mapFn ) {
    let markers = this.viewportVisibleMarkers;
    
    for ( let key in markers ){
      let marker = markers[key];
     // if (marker.contains())
    }

  }

  onClick(ev) {

    let map = this.map;
    let pixel = ev.pixel; // координаты клика во viewport
    let coordinate = ev.coordinate;
    let store = this._pointsStore;
    let selectedMarker = null;
    let cancelSelection = false;

    // проверка – не кликнули на точку трэка?
    let currentSelectedPoint = this._pointsStore.getSelectedPoint();
    if (currentSelectedPoint) {
      let marker = currentSelectedPoint.marker;
      if (marker.hasTrackLoaded()) {
        let track = marker.track;
        let possibleTrackPoint = track.getPointAtCoordinate(coordinate);
        if (possibleTrackPoint !== null) {
          console.log( 'trackpoint  found', possibleTrackPoint);
          return;
        }
      }
    }

    // по какому маркеру кликнули?
    let markers = this.viewportVisibleMarkers;
    for (let key in markers) {
      let marker = markers[key];

      if (marker.contains(coordinate)) {
        selectedMarker = marker;
        break;
      }
    }

    if (selectedMarker) {
      selectedMarker.onClick()
      store.handleSelectPoint(selectedMarker.point)
    }
  }

  render() {
    return (<div>
              <div ref="container" className="openlayers-container"/>
              <div className="openlayers-popup ol-popup">
                  <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                  <div id="popup-content"><p>You clicked here:</p><code>20° 27′ 26″ N 108° 20′ 14″ E</code></div>
              </div>
            </div>)
  }

  renderCanvas(canvas, extent) {

    // canvas example
    // https://gist.github.com/acanimal/b2f60367badb0b17a4d9

    let pointsStore = this._pointsStore;
    let selected = pointsStore.getSelectedPoint();
    let selectedMarker = pointsStore.getSelectedMarker();
    let map = this.map;

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
        // todo переключать отрисовку маленький/большой значок
        // в зависимости от количества маркеров на видимой части карты
        // будет некрасиво, если попадать точно в границу количества
        marker.render(options);
      }
    }

    if (selectedMarker) {
      selectedMarker.track.render();
      selectedMarker.render({selected: true, ...options});

      let view = map.getView();
      let zoom = view.getZoom();
      let size = map.getSize();
      let pixel = [(size[0] - SIDEBAR_WIDTH_PX) / 2, size[1] / 2];

      if (pointsStore.state.trackingMode) {
          view.centerOn(selectedMarker.coords, size, pixel)
          if (zoom < 12) {
            view.setZoom(12)
          }
          this.disableInteractions();
      }

    } else {
      this.enableInteractions()
    }

    return canvas;
  }

  enableInteractions() {
    //this.map.addInteraction(this.interactions);
  }

  disableInteractions() {
    //this.map.removeInteraction(this.interactions);
  }

  getMarkersInBounds(bounds) {

    let returns = [];
    let markers = this.markers;
    let keys = Object.keys(markers);

    for (let i = 0, till = keys.length; i < till; i++) {
      let key = keys[i];
      let point = markers[key];

      // @todo переписать на простые сравнения, без метода contains
      if (ol.extent.containsCoordinate(bounds, point.coords)) {
        returns.push(point)
      }
    }

    return returns;
  }


  componentWillReceiveProps(nextProps) {
    this.updatePoints(nextProps.points);
  }

  updatePoints(updatedPoints) {

    let keys = Object.keys(updatedPoints);
    let ctx = this.canvas.getContext('2d');

    for (let i = 0, till = keys.length; i < till; i++) {

      let key = keys[i];
      let point = updatedPoints[key];

      if (point.timestamp === 1420074000000) {
        continue;
      }
      if ((typeof point.coords === 'undefined') || (typeof point.speed === 'undefined')) {
        console.warn('point coords or speed is undefined, so skip! point: ', point);
        continue;
      }
      if ((point.coords[0] === null) || (point.coords[1] === null)) {
        console.warn('point lat or long is null, so skip! point: ', point);
        continue;
      }


      let _point = this.markers[key];

      if (_point) {
        _point.setPoint(point)
      } else {
        this.markers[key] = new CarMarker(point, this);
      }
    }
  }

}

