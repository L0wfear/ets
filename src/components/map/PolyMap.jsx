import React, { Component, PropTypes } from 'react';
import { polyState, polyStyles } from 'constants/polygons.js';
import { getVectorArrowStyle } from 'constants/vectors.js';
import { getPolyStyle, GeoJSON } from 'utils/ol';
import each from 'lodash/each';
import { PROJECTION, ArcGisLayer } from './MskAdapter.js';

let POLYS_LAYER = null;

// https://github.com/pka/ol3-react-example
// local crs example http://stackoverflow.com/questions/20222885/custom-tiles-in-local-crs-without-projection
// custom tiles example
export default class PolyMap extends Component {

  static get propTypes() {
    return {
      center: PropTypes.array,
      zoom: PropTypes.number,
      onFeatureClick: PropTypes.func,
      polys: PropTypes.object,
    };
  }

  constructor(props, context) {
    super(props, context);

    this.markers = {};
    this._handlers = null; // map event handlers

    this.initialView = new ol.View({
      center: props.center,
      zoom: props.zoom,
      minZoom: 2,
      maxZoom: props.maxZoom || 13,
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
      interactions: new ol.interaction.defaults({ doubleClickZoom: false }), // eslint-disable-line
      renderer: ['canvas', 'dom'],
      controls: this.controls,
      layers: this.layers,
    });

    this.init();
  }

  /**
   * initialization here
   */
  componentDidMount() {
    const map = this.map;
    const container = this._container;

    map.setTarget(container);

    this.popup = new ol.Overlay.Popup();
    map.addOverlay(this.popup);

    this.enableInteractions();

    this.renderPolygons(this.props.polys, true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.polys !== undefined) {
      if (this.popup) {
        this.popup.hide();
      }
      this.renderPolygons(nextProps.polys);
    }
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

  init() {
    // TODO рак
    global.map = this.map;
  }

  renderPolygons(polys = {}, fit) {
    const map = this.map;
    const vectorSource = new ol.source.Vector();
    let styleFunction = polyStyles[polyState.SELECTABLE];

    each(polys, (poly, key) => {
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
    fit && this.fitToExtent(polysLayer);
  }

  fitToExtent(polysLayer) {
    const extent = polysLayer.getSource().getExtent();
    extent[0] !== Infinity && this.map.getView().fit(extent, this.map.getSize());
  }

  shouldComponentUpdate() {
    return false;
  }

  onMouseMove(ev) {
    const pixel = ev.pixel;
    const map = this.map;
    const el = this.map.getViewport();
    const hit = map.forEachFeatureAtPixel(pixel, () => true);

    el.style.cursor = hit ? 'pointer' : '';
  }

  onClick(ev) {
    const map = this.map;
    const pixel = ev.pixel; // координаты клика во viewport

    map.forEachFeatureAtPixel(pixel, (feature) => {
      this.props.onFeatureClick(feature, ev, this);
    });
  }

  /**
   * Вызывается при манипуляциях с картой, таких как перемещение видимой
   * области, зуммирование
   * @method
   */
  onMoveEnd() {
    const zoom = this.map.getView().getZoom();
    console.info(`Центр карты: [${this.map.getView().getCenter()}], зум: ${zoom}`); // eslint-disable-line
  }

  render() {
    return (
      <div ref={node => (this._container = node)} className="openlayers-container" />
    );
  }

}
