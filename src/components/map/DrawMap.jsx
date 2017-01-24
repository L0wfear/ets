import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import { getVectorArrowStyle } from 'constants/vectors.js';
import Div from 'components/ui/Div.jsx';
import _ from 'lodash';
import PolyMap from './PolyMap.jsx';

// Компонент используется для отрисовки векторов и точек на карте
@autobind
export default class DrawMap extends PolyMap {
  static defaultProps = {
    draw_object_list: [],
    object_list: [],
  }

  constructor(props) {
    super(props);

    if (this.props.objectsType === 'vector') {
      this.addDrawInteraction('LineString');
    } else {
      this.addDrawInteraction('Point');
    }
  }

  componentDidMount() {
    const map = this.map;
    const container = this._container;

    map.setTarget(container);

    this.enableInteractions();

    this.renderPolygons(this.props.polys);

    if (this.props.objectsType === 'vector') {
      this.renderRoute(this.props.draw_object_list);
    }
    if (this.props.objectsType === 'points') {
      this.renderRoutePoints(this.props.object_list);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.polys !== undefined) {
      this.renderPolygons(nextProps.polys);
    }
    if (nextProps.draw_object_list !== undefined && nextProps.objectsType === 'vector') {
      this.draw.setActive(false);
      this.drawSetToEnd = true;
      this.renderRoute(nextProps.draw_object_list);
    }
    if (!nextProps.draw_object_list || nextProps.draw_object_list.length === 0) {
      this.drawSetToEnd = false;
      this.draw.setActive(true);
    }
    if (nextProps.object_list !== undefined && nextProps.objectsType === 'points') {
      this.renderRoutePoints(nextProps.object_list);
    }
    if (nextProps.objectsType !== this.props.objectsType) {
      this.map.removeInteraction(this.draw);
      if (nextProps.objectsType === 'vector') {
        this.addDrawInteraction('LineString');
      } else {
        this.addDrawInteraction('Point');
      }
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  onClick(ev) {
    if (this.drawSetToEnd) {
      const map = this.map;
      const pixel = ev.pixel; // координаты клика во viewport

      map.forEachFeatureAtPixel(pixel, (feature) => {
        const { state } = feature.getProperties();
        if (state && state !== 1) {
          this.props.onDrawFeatureClick(feature, ev, this);
        }
      });
    }
  }

  onMouseMove(ev) {
    const pixel = ev.pixel;
    const map = this.map;
    const el = this.map.getViewport();
    const hit = map.forEachFeatureAtPixel(pixel, feature => feature.getProperties().state >= 2);

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
    const length = this.props.objectsType === 'vector' ? this.props.draw_object_list.length : this.props.object_list.length;
    let id = length > 0 ? length : 0;
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
    this.drawSetToEnd = false;
    setTimeout(() => (this.drawSetToEnd = true), 300);
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
    // TODO нужна ли эта строчка?
    !!this.vectorLayer && map.removeLayer(this.vectorLayer);
    this.pointsVectorLayer = pointsVectorLayer;

    map.addLayer(pointsVectorLayer);
  }

  renderRoute(object_list = []) {
    const map = this.map;
    const vectorSource = new ol.source.Vector({ wrapX: false });
    object_list = _.uniqBy(object_list, 'id');
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
    const objectList = this.props.objectsType === 'vector' ? this.props.draw_object_list : this.props.object_list;
    const end = coordinates;
    const startObject = _.last(objectList);
    const start = [startObject.end.x_msk, startObject.end.y_msk];
    const featureSegment = new ol.Feature({
      geometry: new ol.geom.LineString([start, end]),
      id: objectList.length,
    });
    featureSegment.setStyle(getVectorArrowStyle(featureSegment));
    this.props.onDrawFeatureAdd(featureSegment, featureSegment.getGeometry().getCoordinates(), featureSegment.getGeometry().getLength());
    draw.setActive(false);
  }

  addPoint() {
    this.draw.setActive(true);
    const objectList = this.props.objectsType === 'vector' ? this.props.draw_object_list : this.props.object_list;
    const startObject = _.last(objectList);
    const start = [startObject.begin.x_msk, startObject.begin.y_msk];
    const end = [startObject.end.x_msk, startObject.end.y_msk];
    const featureSegment = new ol.Feature({
      geometry: new ol.geom.LineString([start, end]),
    });
    this.draw.extend(featureSegment);
  }

  removeLastPoint() {
    const objectList = this.props.objectsType === 'vector' ? this.props.draw_object_list : this.props.object_list;
    if (objectList.length === 1) {
      this.draw.setActive(true);
    }
    this.props.removeLastDrawFeature();
  }

  render() {
    const objectList = this.props.objectsType === 'vector' ? this.props.draw_object_list : this.props.object_list;
    return (
      <div ref={node => (this._container = node)} className="openlayers-container">
        <Div>
          <button disabled={!objectList.length} className="continue-route-button" onClick={this.addPoint}><Glyphicon glyph="pencil" /></button>
          <button disabled={!objectList.length} className="delete-last-point-button" onClick={this.removeLastPoint}><Glyphicon glyph="remove" /></button>
        </Div>
      </div>
    );
  }
}
