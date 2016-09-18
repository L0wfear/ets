import React, { Component } from 'react';
import { PROJECTION, ArcGisLayer } from './MskAdapter.js';
import { polyState, polyStyles } from 'constants/polygons.js';
import { getVectorArrowStyle } from 'constants/vectors.js';
import { getPolyStyle } from 'utils/ol';

let POLYS_LAYER = null;

// https://github.com/pka/ol3-react-example
// local crs example http://stackoverflow.com/questions/20222885/custom-tiles-in-local-crs-without-projection
// custom tiles example
export default class PolyMap extends Component {

  constructor(props, context) {
    super(props, context);
    const self = this;
    console.warn('POLYMAP CONSTRUCTOR');

    this.markers = {};
    this._handlers = null; // map event handlers

    this.initialView = new ol.View({
      center: this.props.center,
      zoom: this.props.zoom,
      minZoom: 2,
      maxZoom: 13,
      projection: PROJECTION,
      extent: PROJECTION.getExtent(),
    });

    this.controls = [];
    this.controls.push(new ol.control.Zoom({
      duration: 200,
      className: 'ol-zoom',
      delta: 1,
    }));

    this.layers = [ArcGisLayer];

    this.map = new ol.Map({
      view: this.initialView,
      interactions: new ol.interaction.defaults({ doubleClickZoom: false }),
      renderer: ['canvas', 'dom'],
      controls: this.controls,
      layers: this.layers,
    });

    this.init();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.polys !== undefined) {
      if (this.popup) {
        this.popup.hide();
      }
      this.renderPolygons(nextProps.polys);
    }
  }

  /**
   * initialization here
   */
  componentDidMount() {
    const map = this.map;
    const container = this.refs.container;

    map.setTarget(container);

    this.popup = new ol.Overlay.Popup();
    map.addOverlay(this.popup);

    this.enableInteractions();

    this.renderPolygons(this.props.polys);
  }

  init() {
    global.map = this.map;
  }

  renderPolygons(polys = {}) {
    const map = this.map;

    const GeoJSON = new ol.format.GeoJSON();
    const vectorSource = new ol.source.Vector();
    let styleFunction = polyStyles[polyState.SELECTABLE];

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
      } else {
        styleFunction = null;
      }

      if (poly.state === 4) {
        feature.setStyle(getPolyStyle('green'));
      }

      vectorSource.addFeature(feature);
    });

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
  }

  shouldComponentUpdate() {
    return false;
  }

  onMouseMove(ev) {
    const coordinate = ev.coordinate;
    const pixel = ev.pixel;
    const map = this.map;
    const el = this.map.getViewport();
    const hit = map.forEachFeatureAtPixel(pixel, (feature, layer) => true);

    el.style.cursor = hit ? 'pointer' : '';
  }

  onClick(ev) {
    const map = this.map;
    const pixel = ev.pixel; // координаты клика во viewport
    const coordinate = ev.coordinate;
    const cancelSelection = false;

    map.forEachFeatureAtPixel(pixel, (feature, layer) => {
      this.props.onFeatureClick(feature, ev, this);
    });

    // TODO on poly click
  }

  /**
   * Вызывается при манипуляциях с картой, таких как перемещение видимой
   * области, зуммирование
   * @method
   */
  onMoveEnd() {
    const zoom = this.map.getView().getZoom();
    console.info(`Центр карты: [${this.map.getView().getCenter()}], зум: ${zoom}`);
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

  render() {
    console.warn('POLYMAP RENDER', this.props);
    return (
      <div>
        <div ref="container" className="openlayers-container" />
      </div>
    );
  }

}
