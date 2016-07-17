import React, { Component } from 'react';
import CarMarker from './markers/car/CarMarker.js';
import { PROJECTION, ArcGisLayer } from './MskAdapter.js';
import { polyState, polyStyles } from 'constants/polygons.js';
import { vectorStyles, vectorState, getVectorArrowStyle } from 'constants/vectors.js';

let POLYS_LAYER = null;

// https://github.com/pka/ol3-react-example
// local crs example http://stackoverflow.com/questions/20222885/custom-tiles-in-local-crs-without-projection
// custom tiles example
export default class PolyMap extends Component {

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
    });

    this.controls = [];
    this.controls.push(new ol.control.Zoom({
      duration: 200,
      className: 'ol-zoom',
      delta: 1
    }));

    this.layers = [ArcGisLayer];

    this.map = new ol.Map({
      view: this.initialView,
      interactions: new ol.interaction.defaults({doubleClickZoom :false}),
      renderer: ['canvas','dom'],
      controls: this.controls,
      layers: this.layers
    });

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

      if (poly.state === 4) feature.setStyle(polyStyles['green']);

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
    let container = this.refs.container;

    map.setTarget(container);

    this.popup = new ol.Overlay.Popup();
    map.addOverlay(this.popup);

    this.enableInteractions();

    this.renderPolygons(this.props.polys);
  }

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

    //console.log(coordinate)

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
