import React from 'react';
import PolyMap from './PolyMap.jsx';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { polyState, polyStyles } from '../../constants/polygons.js';
import { vectorStyles, vectorState, getVectorArrowStyle, getVectorLayer, getVectorSource } from '../../constants/vectors.js';
import Div from '../ui/Div.jsx';

export default class DrawMap extends PolyMap {
  constructor(props) {
    super(props);
  }

  onClick(ev) {
    let map = this.map;
    let pixel = ev.pixel; // координаты клика во viewport
    let coordinate = ev.coordinate;
    let cancelSelection = false;
    map.forEachFeatureAtPixel(pixel, (feature, layer) =>  {
      let { state } = feature.getProperties();
      if (state && state !== 1) {
        this.props.onDrawFeatureClick(feature, ev, this);
      }
    });
  }

  init() {
    this.addInteraction();
  }

  addInteraction() {
    this.draw = new ol.interaction.Draw({
      source: this.vectorSource,
      type: 'LineString',
    });
    this.draw.on('drawend', this.onDrawEnd.bind(this));
    this.map.addInteraction(this.draw);
    setTimeout(() => this.draw.setActive(false), 500);
  }

  onDrawEnd(ev) {
    let { feature } = ev;
    let id = this.props.object_list.length || 0;
    const geometry = feature.getGeometry();
    feature.setStyle(getVectorArrowStyle(feature));
    geometry.forEachSegment((start, end, index) => {
      let featureSegment = new ol.Feature({
        geometry: new ol.geom.LineString([start, end]),
        id: id,
      });
      featureSegment.setStyle(getVectorArrowStyle(featureSegment));
      id++;
      this.props.onDrawFeatureAdd(featureSegment, featureSegment.getGeometry().getCoordinates(), featureSegment.getGeometry().getLength());
    })
    this.draw.setActive(false);
    feature.on('change', () => {
      this.vectorSource.removeFeature(feature)
    });
  }

  render() {
    return (<div>
              <div ref="container" style={{opacity: this.props.errorLoading ? .4 : 1}} className="openlayers-container">
                <Div hidden={!this.props.object_list.length}>
                  <button className="continue-route-button" onClick={this.addPoint.bind(this)}><Glyphicon glyph="pencil"/></button>
                  <button className="delete-last-point-button" onClick={this.removeLastPoint.bind(this)}><Glyphicon glyph="remove"/></button>
                </Div>
              </div>
            </div>)
  }

  renderRoute(object_list = []) {
    let map = this.map;
    let vectorSource = new ol.source.Vector({wrapX: false});
    //let styleFunction = polyStyles[polyState.SELECTABLE];

    _.each(object_list, (object, index) => {
      let start = [object.begin.x_msk, object.begin.y_msk];
      let end = [object.end.x_msk, object.end.y_msk];
      let feature = new ol.Feature({
        geometry: new ol.geom.LineString([start, end]),
        id: object.id,
        state: object.state,
        distance: object.distance,
      });
      feature.setStyle(getVectorArrowStyle(feature));

      vectorSource.addFeature(feature);
    });

    !!this.vectorLayer && map.removeLayer(this.vectorLayer);

    let vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        //style: styleFunction
    })

    this.vectorLayer = vectorLayer;

    map.addLayer(vectorLayer);
  }

  componentDidMount() {
    let map = this.map;
    let triggerRenderFn = this.triggerRender.bind(this);
    let container = this.refs.container;

    map.setTarget(container);
    map.on('postcompose', triggerRenderFn);

    this.popup = new ol.Overlay.Popup();
    map.addOverlay(this.popup);

    this.enableInteractions();

    this.renderODHs(this.props.polys);
    this.renderRoute(this.props.object_list);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.polys !== undefined) {
      this.popup.hide();
      this.renderODHs(nextProps.polys);
    }
    if (nextProps.object_list !== undefined) {
      this.renderRoute(nextProps.object_list);
    }
  }

  onPointAdd(e, draw) {
    let { feature, coordinates } = e;
    let end = coordinates;
    let startObject = _.last(this.props.object_list);
    let start = [startObject.end.x_msk, startObject.end.y_msk];
    let featureSegment = new ol.Feature({
      geometry: new ol.geom.LineString([start, end]),
      id: this.props.object_list.length,
    });
    featureSegment.setStyle(getVectorArrowStyle(featureSegment));
    this.props.onDrawFeatureAdd(featureSegment, featureSegment.getGeometry().getCoordinates(), featureSegment.getGeometry().getLength());
    draw.setActive(false);
  }

  addPoint() {
    this.draw.setActive(true);
    let startObject = _.last(this.props.object_list);
    let start = [startObject.begin.x_msk, startObject.begin.y_msk];
    let end = [startObject.end.x_msk, startObject.end.y_msk];
    let featureSegment = new ol.Feature({
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
}
