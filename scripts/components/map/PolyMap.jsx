// import ol from 'imports?define=>false!openlayers';
import React, { Component } from 'react';
import CarMarker from '../markers/car/Marker.js';
import { PROJECTION, ArcGisLayer } from './MskAdapter.js';
import 'ol3-popup/src/ol3-popup.js';
import { getGeoObjectsByCoords } from '../../adapter.js';
import '../../vendor/onTabUnfocus.js';
import { polyState, polyStyles } from '../../constants/polygons.js';
import { vectorStyles, vectorState, getVectorArrowStyle } from '../../constants/vectors.js';

window.addEventListener('blur', (ev) => {
  //let store = flux.getStore('points')
  //store.pauseRendering()
});

window.addEventListener('focus', (ev) => {
  //let store = flux.getStore('points')
 // store.unpauseRendering()]
  //global.olmap && global.olmap.updateSize()
});

let POLYS_LAYER = null;

global.ol = ol;

// https://github.com/pka/ol3-react-example
// local crs example http://stackoverflow.com/questions/20222885/custom-tiles-in-local-crs-without-projection
// custom tiles example
export default class OpenLayersMap extends Component {

  constructor(props, context) {
    super(props, context);
    let self = this;
    console.warn('POLYMAP CONSTRUCTOR');

    this.markers = {};
    this._handlers = null; // map event handlers

    this.initialView = new ol.View({
      center: this.props.center,
      zoom: this.props.zoom,
      minZoom: 2,
      maxZoom: 13,
      projection: PROJECTION,
      extent: PROJECTION.getExtent()
    })

    let renderFn = this.renderCanvas.bind(this);
    // let canvasLayer = this.canvasLayer = new ol.layer.Image({
    //   source: new ol.source.ImageCanvas({
    //     canvasFunction: function draw(extent, res, pixelRatio, size, proj) {
    //       if (!this.canvas) {
    //         self.canvas = this.canvas = document.createElement('canvas');
    //         self.context = this.canvas.getContext('2d');
    //       }
    //
    //       this.canvas.setAttribute('width', size[0]);
    //       this.canvas.setAttribute('height', size[1]);
    //
    //       return renderFn(this.canvas, extent, pixelRatio);
    //     },
    //     ratio: 1
    //   })
    // });

    this.controls = [];
    this.controls.push(new ol.control.Zoom({
      duration: 200,
      className: 'ol-zoom',
      delta: 1
    }));

    this.layers = [ArcGisLayer/*, canvasLayer*/];
    // if (this.props.manualDraw) {
    //   this.vectorLayer = new ol.layer.Vector({
    //     source: new ol.source.Vector({wrapX: false}),
    //     style: new ol.style.Style({
    //       fill: new ol.style.Fill({
    //         color: 'rgba(255, 255, 255, 0.2)'
    //       }),
    //       stroke: new ol.style.Stroke({
    //         color: '#ffcc33',
    //         width: 2
    //       }),
    //       image: new ol.style.Circle({
    //         radius: 7,
    //         fill: new ol.style.Fill({
    //           color: '#ffcc33'
    //         })
    //       })
    //     }),
    //     // updateWhileAnimating: false,
    //     // updateWhileInteracting: false
    //   });
    //   //this.layers.push(this.vectorLayer);
    // }

    this.map = new ol.Map({
      view: this.initialView,
      interactions: new ol.interaction.defaults({doubleClickZoom :false}),
      renderer: ['canvas','dom'],
      controls: this.controls,
      layers: this.layers
    });

    global.olmap = this.map;

    this.map.getView().setZoom(6);
    this.map.getView().setCenter([-5441.16131979791, 10146.687775846918])


    this.init();
  }

  init() {
    global.map = this.map;
  }

  renderPolygons(polys = {}) {
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
        feature.setStyle(polyStyles[poly.state]);
      } else {
        styleFunction = null;
      }

      vectorSource.addFeature(feature);
    });

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

  shouldComponentUpdate() {
    return false;
  }

  /**
   * initialization here
   */
  componentDidMount() {

    let map = this.map;
    //let triggerRenderFn = this.triggerRender.bind(this);
    let container = this.refs.container;

    map.setTarget(container);
    //map.on('postcompose', triggerRenderFn);

    this.popup = new ol.Overlay.Popup();
    map.addOverlay(this.popup);

    this.enableInteractions();

    this.renderPolygons(this.props.polys);
  }

  // triggerRender() {
  //   this.canvasLayer.getSource().changed()
  // }

  onMouseMove(ev) {
    let coordinate = ev.coordinate;
    let pixel = ev.pixel;
    let map = this.map;
    let el = this.map.getViewport();
    let hit = map.forEachFeatureAtPixel(pixel, (feature, layer) => true);

    el.style.cursor = hit ? 'pointer' : '';
  }

  onClick(ev) {

    let map = this.map;
    let pixel = ev.pixel; // координаты клика во viewport
    let coordinate = ev.coordinate;
    let cancelSelection = false;

    map.forEachFeatureAtPixel(pixel, (feature, layer) =>  {
      this.props.onFeatureClick(feature, ev, this);
    });

    // TODO on poly click
  }

  hidePopup() {
    this.popup.hide()
  }

  render() {
    console.warn('POLYMAP RENDER', this.props);
    return (
      <div>
        <div ref="container" style={{opacity: 1}} className="openlayers-container"/>
      </div>
    );
  }

  renderCanvas(canvas, extent) {

    // canvas example
    // https://gist.github.com/acanimal/b2f60367badb0b17a4d9
    let map = this.map;

    return canvas;
  }

  enableInteractions() {
    let map = this.map;
    let interactions = map.getInteractions();

    if (this._handlers === null) {
      this._handlers = {
        singleclick: map.on('singleclick', this.onClick.bind(this)),
        pointermove: map.on('pointermove', this.onMouseMove.bind(this)),
      }

      interactions.forEach((interaction)=> {
        interaction.setActive(true);
      });
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.polys !== undefined) {
      if (this.popup) {
        this.popup.hide();
      }
      this.renderPolygons(nextProps.polys);
    }
  }

}
