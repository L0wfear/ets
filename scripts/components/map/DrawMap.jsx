import React from 'react';
import PolyMap from './PolyMap.jsx';
import { polyState, polyStyles } from '../../constants/polygons.js';
import { vectorStyles, vectorState, getVectorArrowStyle, getVectorLayer, getVectorSource } from '../../constants/vectors.js';

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
      console.log(feature.getProperties());
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
  }

  onDrawEnd(ev) {
    let { feature } = ev;
    let id = 0;
    const geometry = feature.getGeometry();
    console.log(geometry.getCoordinates());
    feature.setStyle(getVectorArrowStyle(feature));
    geometry.forEachSegment((start, end) => {
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
      console.log('REMOVING FEATURE');
      this.vectorSource.removeFeature(feature)
    })
    // setTimeout(() => {
    // this.vectorSource.removeFeature(feature);
    //     console.log(this.vectorSource.getFeatures());
    // }, 2000)

    // setTimeout(() => {
    //   //this.draw.setActive(true);
    //   console.log('EXTENDING')
    //   this.draw.extend(feature);
    // }, 2000)
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

  renderRoute(object_list = []) {
    let map = this.map;
    let vectorSource = new ol.source.Vector({wrapX: false});
    //let styleFunction = polyStyles[polyState.SELECTABLE];

    _.each(object_list, (object, index) => {
      console.log(object);
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
      console.log(feature.getProperties());
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
}
