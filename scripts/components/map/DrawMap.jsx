import React from 'react';
import PolyMap from './PolyMap.jsx';
import { Glyphicon } from 'react-bootstrap';
import { getVectorArrowStyle } from 'constants/vectors.js';
import Div from 'components/ui/Div.jsx';
import _ from 'lodash';


// Компонент используется для отрисовки векторов и точек на карте
export default class DrawMap extends PolyMap {
  constructor(props) {
    super(props);

    console.warn('DRAWMAP CONSTRUCTOR');
    if (this.props.objectsType === 'vector') {
      this.addDrawInteraction('LineString');
    } else {
      this.addDrawInteraction('Point');
    }
  }

  componentDidMount() {
    const map = this.map;
    const container = this.refs.container;

    map.setTarget(container);

    this.enableInteractions();

    this.renderPolygons(this.props.polys);

    if (this.props.objectsType === 'vector') {
      this.renderRoute(this.props.object_list);
    }
    if (this.props.objectsType === 'points') {
      this.renderRoutePoints(this.props.object_list);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.polys !== undefined) {
      this.renderPolygons(nextProps.polys);
    }
    if (nextProps.object_list !== undefined) {
      if (nextProps.objectsType === 'vector') {
        this.renderRoute(nextProps.object_list);
      }
      if (nextProps.objectsType === 'points') {
        this.renderRoutePoints(nextProps.object_list);
      }
    }
    if (nextProps.objectsType !== this.props.objectsType) {
      // !!this.pointsVectorLayer && this.map.removeLayer(this.pointsVectorLayer);
      // !!this.vectorLayer && this.map.removeLayer(this.vectorLayer);
      this.map.removeInteraction(this.draw);
      if (nextProps.objectsType === 'vector') {
        this.addDrawInteraction('LineString');
      } else {
        this.addDrawInteraction('Point');
      }
    }
  }

  onClick(ev) {
    const map = this.map;
    const pixel = ev.pixel; // координаты клика во viewport

    map.forEachFeatureAtPixel(pixel, (feature, layer) => {
      const { state } = feature.getProperties();
      if (state && state !== 1) {
        this.props.onDrawFeatureClick(feature, ev, this);
      }
    });
  }

  onMouseMove(ev) {
    const pixel = ev.pixel;
    const map = this.map;
    const el = this.map.getViewport();
    const hit = map.forEachFeatureAtPixel(pixel, (feature, layer) => {
      return feature.getProperties().state >= 2 ? true : false;
    });

    el.style.cursor = hit ? 'pointer' : '';
  }


  init() {

  }

  addDrawInteraction(type = 'LineString') {
    this.draw = new ol.interaction.Draw({
      type,
    });
    this.draw.on('drawend', type === 'LineString' ? this.onDrawEnd.bind(this) : this.onPointDrawEnd.bind(this));
    this.map.addInteraction(this.draw);
    if (this.props.edit) {
      setTimeout(() => this.draw.setActive(false), 500);
    }
  }

  removeDrawInteraction() {
    this.map.removeInteraction(this.draw);
  }

  onDrawEnd(ev) {
    const { feature } = ev;
    let id = this.props.object_list.length > 0 ? this.props.object_list.length : 0;
    const geometry = feature.getGeometry();
    geometry.forEachSegment((start, end) => {
      const featureSegment = new ol.Feature({
        geometry: new ol.geom.LineString([start, end]),
        id,
      });
      id += 1;
      this.props.onDrawFeatureAdd(featureSegment, featureSegment.getGeometry().getCoordinates(), featureSegment.getGeometry().getLength());
    });
    this.draw.setActive(false);
  }

  onPointDrawEnd(ev) {
    const { feature } = ev;
    this.props.onPointAdd(feature.getGeometry().getCoordinates());
  }

  renderRoutePoints(object_list = []) {
    const map = this.map;
    const vectorSource = new ol.source.Vector({ wrapX: false });

    _.each(object_list, (object, index) => {
      const feature = new ol.Feature({
        geometry: new ol.geom.Point(object.coordinates),
        id: index,
      });

      vectorSource.addFeature(feature);
    });

    !!this.pointsVectorLayer && map.removeLayer(this.pointsVectorLayer);

    const pointsVectorLayer = new ol.layer.Vector({
      source: vectorSource,
    });

    !!this.vectorLayer && map.removeLayer(this.vectorLayer);
    this.pointsVectorLayer = pointsVectorLayer;

    map.addLayer(pointsVectorLayer);
  }

  renderRoute(object_list = []) {
    const map = this.map;
    const vectorSource = new ol.source.Vector({ wrapX: false });
    object_list = _.uniqBy(object_list, o => o.id);
    // console.log(object_list.length, _.uniq(object_list, o => o.id).length);
    _.each(object_list, (object) => {
      const start = [object.begin.x_msk, object.begin.y_msk];
      const end = [object.end.x_msk, object.end.y_msk];
      const feature = new ol.Feature({
        geometry: new ol.geom.LineString([start, end]),
        id: object.id,
        state: object.state,
        distance: object.distance,
      });
      feature.setStyle(getVectorArrowStyle(feature));

      vectorSource.addFeature(feature);
    });

    !!this.vectorLayer && map.removeLayer(this.vectorLayer);

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
    });

    this.vectorLayer = vectorLayer;

    map.addLayer(vectorLayer);
  }

  onPointAdd(e, draw) {
    const { coordinates } = e;
    const end = coordinates;
    const startObject = _.last(this.props.object_list);
    const start = [startObject.end.x_msk, startObject.end.y_msk];
    const featureSegment = new ol.Feature({
      geometry: new ol.geom.LineString([start, end]),
      id: this.props.object_list.length,
    });
    featureSegment.setStyle(getVectorArrowStyle(featureSegment));
    this.props.onDrawFeatureAdd(featureSegment, featureSegment.getGeometry().getCoordinates(), featureSegment.getGeometry().getLength());
    draw.setActive(false);
  }

  addPoint() {
    this.draw.setActive(true);
    const startObject = _.last(this.props.object_list);
    const start = [startObject.begin.x_msk, startObject.begin.y_msk];
    const end = [startObject.end.x_msk, startObject.end.y_msk];
    const featureSegment = new ol.Feature({
      geometry: new ol.geom.LineString([start, end]),
    });
    this.draw.extend(featureSegment);
  }

  removeLastPoint() {
    if (this.props.object_list.length === 1) {
      this.draw.setActive(true);
    }
    this.props.removeLastDrawFeature();
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
      <div>
        <div ref="container" style={{ opacity: 1 }} className="openlayers-container">
          <Div hidden={!this.props.object_list.length}>
            <button className="continue-route-button" onClick={this.addPoint.bind(this)}><Glyphicon glyph="pencil" /></button>
            <button className="delete-last-point-button" onClick={this.removeLastPoint.bind(this)}><Glyphicon glyph="remove" /></button>
          </Div>
        </div>
      </div>
    );
  }
}
