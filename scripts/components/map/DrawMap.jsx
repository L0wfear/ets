import React from 'react';
import PolyMap from './PolyMap.jsx';
import { polyState, polyStyles } from '../../constants/polygons.js';
import { vectorStyles, vectorState, getVectorArrowStyle } from '../../constants/vectors.js';

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
      //console.log(feature);
      //this.props.onFeatureClick(feature, ev, this);
    });
  }

  init() {
    this.addInteraction();
  }
  //
  // renderODHs(polys = {}) {
  //   console.log('dqwqwdqw')
  //   let map = this.map;
  //
  //   let GeoJSON = new ol.format.GeoJSON();
  //   let vectorSource = new ol.source.Vector();
  //   let styleFunction = polyStyles[polyState.SELECTABLE];
  //
  //   _.each(polys, (poly, key) => {
  //     let feature = new ol.Feature({
  //       geometry: GeoJSON.readGeometry(poly.shape),
  //       name: poly.name,
  //       id: key,
  //       state: poly.state,
  //     });
  //     feature.setStyle(getVectorArrowStyle(feature));
  //
  //     vectorSource.addFeature(feature);
  //   })
  //
  //   !!POLYS_LAYER && map.removeLayer(POLYS_LAYER);
  //
  //   let polysLayer = new ol.layer.Vector({
  //       source: vectorSource,
  //       style: styleFunction
  //   });
  //
  //   POLYS_LAYER = polysLayer;
  //
  //   map.addLayer(polysLayer);
  //
  //   map.getView().setZoom(6);
  //   map.getView().setCenter([-5441.16131979791, 10146.687775846918])
  //
  // }

  addInteraction() {
    var geometryFunction, maxPoints;
    var value = 'LineString';
    this.draw = new ol.interaction.Draw({
      source: this.vectorSource,
      type: /** @type {ol.geom.GeometryType} */ (value),
      //geometryFunction: geometryFunction,
      //maxPoints: maxPoints
    });
    this.draw.on('drawend', this.onDrawEnd.bind(this));

    if (this.props.manualDraw) {
      this.map.addInteraction(this.draw);
    }

  }

  onDrawEnd(ev) {
    let { feature } = ev;
    const geometry = feature.getGeometry();
    //console.log(`LENGTH`, geometry.getLength());
    console.log(geometry.getCoordinates());
    feature.setStyle(getVectorArrowStyle(feature));
    this.props.onFeatureAdd(ev.feature, geometry.getCoordinates(), this);
    this.draw.setActive(false);
    // let format = new ol.format.GeoJSON();
    // let source = POLYS_LAYER.getSource();
    // let features = source.getFeatures();
    // _.each(features, feature => {
    //   const newFeature = format.writeFeatureObject(ev.feature);
    //   const currentFeature = format.writeFeatureObject(feature);
    //   const intersection = intersect(newFeature, currentFeature);
    //   if (intersection) {
    //     const formattedFeature = format.readFeature(intersection);
    //     //this.props.onFeatureClick(feature, ev, this);
    //   }
    // })
  }

  render() {
    console.warn('DRAWMAP RENDER');
    return (<div>
              <div ref="container" style={{opacity: this.props.errorLoading ? .4 : 1}} className="openlayers-container"/>
            </div>)
  }
}
