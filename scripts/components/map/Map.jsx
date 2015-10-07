// import ol from 'imports?define=>false!openlayers';
import React, { Component } from 'react';
import CarMarker from '../markers/car/Marker.js';
import { EXTENT, PROJECTION, ArcGisLayer } from './MskAdapter.js'

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

    this._points = {};
    this._pointsStore = this.props.flux.getStore('points');
    this._viewportVisiblePoints = {};

    let initialView = new ol.View({
      center: this.props.center,
      zoom: this.props.zoom,
      minZoom: 2,
      maxZoom: 20,
      projection: PROJECTION,
      extent: EXTENT
    })


    let renderFn = this.renderCanvas.bind(this);
    let canvasLayer = this.canvasLayer =  new ol.layer.Image({
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
        renderer: ['canvas', 'dom'],
        controls: ol.control.defaults(),
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
    let container = React.findDOMNode(this);

    map.setTarget(container);

    map.on('postcompose', triggerRenderFn)
    map.on('precompose', triggerRenderFn)

    map.on('click', this.onClick.bind(this))
  }

  triggerRender() {
    this.canvasLayer.getSource().changed()
  }

  // todo проходить по всем маркерам карты на предмет клика
  traverseMarkers(){

  }

  onClick(ev) {

    let map = this.map;
    let pixel = ev.pixel; // координаты viewport
    let coordinate = ev.coordinate;
    let store = this._pointsStore;
    let selected = null;

    console.log('coord from pixel', map.getCoordinateFromPixel(pixel))
    console.log('pixel from coordinate ', map.getPixelFromCoordinate(coordinate))

    // по машине не кликнули?
    let cars = this._viewportVisiblePoints;
    for (let key in cars) {
      let car = cars[key];
      let coords = car.coords;

      if (car.contains(coordinate)) {
        selected = car;
      }
    }

    store.handleSelectPoint(selected && selected._point)
  }

  render() {
    return <div className="openlayers-container"/>
  }

  renderCanvas(canvas, extent) {

    // canvas example
    // https://gist.github.com/acanimal/b2f60367badb0b17a4d9

    let pointsStore = this._pointsStore;

//console.log( 'render extent is', extent)
    let ctx = canvas.getContext('2d');
    let map = this.map;
    let selected = pointsStore.getSelectedPoint();
    let markers = this._markers;


    let optimizedPoints = this._viewportVisiblePoints = this.getMarkersInBounds(extent);

    const options = {
      showPlates: this.props.showPlates
    };

    let keys = Object.keys(optimizedPoints);

    console.log( 'rendered only', keys.length, 'of', Object.keys(this._points).length, 'points')

    for (let i = 0, till = keys.length; i < till; i++) {

      let key = keys[i];
      let marker = optimizedPoints[key];
      let id = marker.point.id;

      if (selected === null || id !== selected.id) {
        marker.render(ctx, false, 0, options);
      }
    }

    let selectedMarker = selected ? markers[selected.id] : false;
    if (selectedMarker) {
      selectedMarker.renderTrackInColors(ctx, map.getZoom() >= 15)
      //selectedMarker.renderTrack(ctx);
      selectedMarker.render(ctx, true, 0, options);

      if (pointsStore.state.trackingMode) {
        this.disableInteractions();
        if (map.getZoom() < 15) {
          map.fitBounds([selectedMarker._coords], {
            paddingBottomRight: [500, 50],
            paddingTopLeft: [50, 50],
            animate: false,
            zoom: 16
          });
        }
        map.panToCenterWithoutAnimation(selectedMarker._coords, pointsStore)
      }
    } else {
      this.enableInteractions()
    }

    return canvas;
  }

  enableInteractions() {
    // todo enable openlayers interactions
  }

  disableInteractions() {
    // todo disable openlayers interactions
  }

  getMarkersInBounds(bounds) {

    let returns = [];
    let points = this._points;
    let keys = Object.keys(points);

    for (let i = 0, till = keys.length; i < till; i++) {
      let key = keys[i];
      let point = points[key];

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


      let _point = this._points[key];

      if (_point) {
        _point.setPoint(point)
      } else {
        this._points[key] = new CarMarker(point, this.map, this._pointsStore, ctx);
      }
    }
  }

}

