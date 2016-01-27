// import ol from 'imports?define=>false!openlayers';
import React, { Component } from 'react';
import CarMarker from '../markers/car/Marker.js';
import { PROJECTION, ArcGisLayer } from './MskAdapter.js';
import 'ol3-popup/src/ol3-popup.js';
import { getGeoObjectsByCoords } from '../../adapter.js';
import '../../vendor/onTabUnfocus.js';
import {polyState, polyStyles} from '../../constants/polygons.js';

window.addEventListener('blur', (ev) => {
  //let store = flux.getStore('points')
  //store.pauseRendering()
})

window.addEventListener('focus', (ev) => {
  //let store = flux.getStore('points')
 // store.unpauseRendering()]
  global.olmap && global.olmap.updateSize()
})

let POLYS_LAYER = null;



global.ol = ol;

// https://github.com/pka/ol3-react-example
// local crs example http://stackoverflow.com/questions/20222885/custom-tiles-in-local-crs-without-projection
// custom tiles example
export default class OpenLayersMap extends Component {

  constructor(props, context) {
    super(props, context);
    let self = this;

    this.markers = {};
    this._handlers = null; // map event handlers


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

          return renderFn(this.canvas, extent, pixelRatio);
        },
        ratio: 1
      })
    });


    let controls = []
    controls.push(new ol.control.Zoom({
        duration: 400,
        className: 'ol-zoom',
        delta: 1
      }))

    let map = new ol.Map(
      {
        view: initialView,
        //interactions: [this.interactions],
        renderer: ['canvas','dom'],
        controls: controls,
        layers: [ArcGisLayer, canvasLayer]
      })

    this.map = global.olmap = map;
  }

  renderODHs(polys = {}/*window.ROUTES[0].polys*/) {
    let map = this.map;

    let GeoJSON = new ol.format.GeoJSON();
    let vectorSource = new ol.source.Vector();
    let styleFunction = polyStyles[polyState.SELECTABLE];

    //let features = [];
    //debugger;

    _.each(polys, (poly, key) => {
      //debugger;
      let feature = new ol.Feature({
        geometry: GeoJSON.readGeometry(poly.shape),
        name: poly.name,
        id: key,
        state: polyState.SELECTABLE
      });

      vectorSource.addFeature(feature);
      //featuresJSON.readFeature(feature)
      //features.push(feature)
    })

    //debugger;


    !!POLYS_LAYER && map.removeLayer(POLYS_LAYER);

    let polysLayer = new ol.layer.Vector({
        source: vectorSource,
        style: styleFunction
    })

    POLYS_LAYER = polysLayer;

    map.addLayer(polysLayer);

    map.getView().setZoom(6);
    map.getView().setCenter([-5441.16131979791, 10146.687775846918])

  }

  shouldComponentUpdate() {
    return false;
  }


  /**
   * initialization here
   */
  componentDidMount() {

    console.log('POLYMAP MOUNT', this.props);

    let map = this.map;
    let triggerRenderFn = this.triggerRender.bind(this);
    let container = this.refs.container;

    map.setTarget(container);
    map.on('postcompose', triggerRenderFn);

    this.popup = new ol.Overlay.Popup();
    map.addOverlay(this.popup);

    this.enableInteractions();

    this.props.selectInteraction && map.addInteraction(this.props.selectInteraction);

    this.renderODHs(this.props.polys);
  }

  triggerRender() {
    this.canvasLayer.getSource().changed()
  }

  onMouseMove(ev) {

    let coordinate = ev.coordinate;
    let pixel = ev.pixel;
    let map = this.map;
    let el = this.map.getViewport();

    var hit = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                return true;
            });


    el.style.cursor = hit ? 'pointer' : '';
  }


  onClick(ev) {

    let map = this.map;
    let pixel = ev.pixel; // координаты клика во viewport
    let coordinate = ev.coordinate;
    let cancelSelection = false;


    map.forEachFeatureAtPixel(pixel, (feature, layer) =>  {
      this.props.onFeatureClick(feature, ev, this);
    })


    // TODO on poly click
  }

  hidePopup() {
    this.popup.hide()
  }

  render() {
    console.warn('RENDER POLYMAP')
    return (<div>
              <div ref="container" style={{opacity: this.props.errorLoading ? .4 : 1}} className="openlayers-container"/>
            </div>)
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
        pointermove: map.on('pointermove', this.onMouseMove.bind(this))
      }

      interactions.forEach((interaction)=> {
        interaction.setActive(true)
      })
    }



  }

  disableInteractions() {
    let map = this.map;
    let interactions = map.getInteractions();

    if (this._handlers !== null) {
      map.unByKey(this._handlers.singleclick)
      map.unByKey(this._handlers.pointermove)
      this._handlers = null;

      interactions.forEach((interaction)=> {
        interaction.setActive(false)
      })
    }
  }


  componentWillReceiveProps(nextProps) {

    console.log('RECEIVING PROPS', nextProps);

    if (nextProps.polys !== undefined) {
      this.popup.hide()
      console.log('received new polys');
      this.renderODHs(nextProps.polys)
    }
  }
}
