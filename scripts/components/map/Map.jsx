// import ol from 'imports?define=>false!openlayers';
import React, { Component } from 'react';
import CarMarker from '../markers/car/Marker.js';
import { PROJECTION, ArcGisLayer } from './MskAdapter.js';
import 'ol3-popup/src/ol3-popup.js';
import { getGeoObjectsByCoords } from '../../adapter.js';
import '../../vendor/onTabUnfocus.js';

window.addEventListener('blur', (ev) => {
  //let store = flux.getStore('points')
  //store.pauseRendering()
})

window.addEventListener('focus', (ev) => {
  //let store = flux.getStore('points')
 // store.unpauseRendering()]
  global.olmap && global.olmap.updateSize()
})

// todo move to settings
const SIDEBAR_WIDTH_PX = 500;

// WebGL example
// http://openlayers.org/en/master/examples/icon-sprite-webgl.html
//
// current WebGL stats
// http://webglstats.com/
//
// OpenLayers performance cases
// http://trac.osgeo.org/openlayers/wiki/Future/OpenLayersWithCanvas

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
    if ( !props.noMarkers ) {
      this._pointsStore = this.props.flux.getStore('points');
    }
    this.viewportVisibleMarkers = {};

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
          //debugger;
         // size = self.map.getSize();
          this.canvas.setAttribute('width', size[0]);
          this.canvas.setAttribute('height', size[1]);

          return renderFn(this.canvas, extent, pixelRatio);
        },
        ratio: 1
      })
    });


    let controls = []
    if (!this.props.errorLoading) {
      controls.push(new ol.control.Zoom({
          duration: 400,
          className: 'ol-zoom',
          delta: 1
        }))
    }

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

  renderODHs() {
    let map = this.map;
    let odhs = window.ROUTES[1].polys;

    let featuresJSON = {
      type: 'FeatureCollection',
      features: []
    }


    let styleFunction = new ol.style.Style({
       fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.9)'
       }),
       stroke: new ol.style.Stroke({
            color: 'red',
            width: 1
       })
    });



    _.each(odhs, (poly)=>{
          featuresJSON.features.push({
            type: 'Feature',
            geometry: poly.shape
          })
      })

    let vectorSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(featuresJSON)
    })


    let polysLayer = new ol.layer.Vector({
        source: vectorSource,
        style: styleFunction
    })

    map.addLayer(polysLayer);

    map.getView().setZoom(6);
    map.getView().setCenter([-5441.16131979791, 10146.687775846918])

  }

  shouldComponentUpdate() {
    return !this.props.noMarkers;
  }

  /**
   * initialization here
   */
  componentDidMount() {

    let map = this.map;
    let triggerRenderFn = this.triggerRender.bind(this);
    let container = this.refs.container;

    map.setTarget(container);
    map.on('postcompose', triggerRenderFn);

    this.popup = new ol.Overlay.Popup();
    map.addOverlay(this.popup);

    if (this.props.noMarkers) {
      this.renderODHs()
    }

    if (this.props.errorLoading) {
      this.disableInteractions();
    } else {
      this.enableInteractions();
    }
  }

  triggerRender() {
    this.canvasLayer.getSource().changed()
  }

  onMouseMove(ev) {

    let coordinate = ev.coordinate;
    let changeCursor = false;

    if (!this.props.noMarkers) {

      let markers = this.viewportVisibleMarkers;
      for (let key in markers) {
        let marker = markers[key];

        if (marker.contains(coordinate)) {
          changeCursor = true;
          break;
        }
      }

      if (this._pointsStore.hasMarkerSelected()) {
        let currentSelectedMarker = this._pointsStore.getSelectedMarker();
        if (currentSelectedMarker.hasTrackLoaded()) {
          let possibleTrackPoint = currentSelectedMarker.track.getPointAtCoordinate(coordinate);
          if (possibleTrackPoint) {
            changeCursor = true;
          }
        }
      }

    }
    let el = this.map.getViewport();
    el.style.cursor = changeCursor ? 'pointer' : '';
  }

  getMarkerByCoord() {

  }

  // todo проходить по всем маркерам карты на предмет клика
  // или рендеринга
  traverseMarkers( mapFn ) {
    let markers = this.viewportVisibleMarkers;
    
    for ( let key in markers ){
      let marker = markers[key];
     // if (marker.contains())
    }

  }

  onClick(ev) {

    let map = this.map;
    let pixel = ev.pixel; // координаты клика во viewport
    let coordinate = ev.coordinate;
    let store = this._pointsStore;
    let selectedMarker = null;
    let cancelSelection = false;

    // проверка – не кликнули на точку трэка?
    let currentSelectedPoint = this._pointsStore.getSelectedPoint();
    if (currentSelectedPoint) {
      let marker = currentSelectedPoint.marker;
      if (marker.hasTrackLoaded()) {
        let track = marker.track;
        let possibleTrackPoint = track.getPointAtCoordinate(coordinate);
        if (possibleTrackPoint !== null) {
          let pointCoords = possibleTrackPoint.coords_msk;
          //console.log( 'trackpoint  found', possibleTrackPoint);
          let makePopupFn = track.getTrackPointTooltip(possibleTrackPoint);
          this.popup.show(pointCoords, makePopupFn());
          getGeoObjectsByCoords(possibleTrackPoint.coords_msk)
            .then((data) => {
              this.popup.show(pointCoords, makePopupFn(data.objects))
            })
          return;
        }
      }
    }

    // по какому маркеру кликнули?
    let markers = this.viewportVisibleMarkers;
    for (let key in markers) {
      let marker = markers[key];

      if (marker.contains(coordinate)) {
        selectedMarker = marker;
        break;
      }
    }

    if (selectedMarker) {
      selectedMarker.onClick();
      store.handleSelectPoint(selectedMarker.point);
      // прячем попап трэка
      this.hidePopup()
    }
  }

  hidePopup() {
    this.popup.hide()
  }

  render() {
    return (<div>
              <div ref="container" style={{opacity: this.props.errorLoading ? .4 : 1}} className="openlayers-container"/>
            </div>)
  }

  renderCanvas(canvas, extent) {

    // canvas example
    // https://gist.github.com/acanimal/b2f60367badb0b17a4d9

    let map = this.map;
    let pointsStore = this._pointsStore;
    
    let selected = this.props.noMarkers ? false : pointsStore.getSelectedPoint();
    if (!this.props.noMarkers) {
      let selectedMarker = pointsStore.getSelectedMarker();

      let optimizedMarkers = this.viewportVisibleMarkers = this.getMarkersInBounds(extent);

      const options = {
        showPlates: this.props.showPlates
      };

      let keys = Object.keys(optimizedMarkers);
      for (let i = 0, till = keys.length; i < till; i++) {
        let key = keys[i];
        let marker = optimizedMarkers[key];
        let id = marker.point.id;

        if (selected === null || id !== selected.id) {
          // todo переключать отрисовку маленький/большой значок
          // в зависимости от количества маркеров на видимой части карты
          // 
          // будет некрасиво, если попадать точно в границу количества
          marker.render(options);
        }
      }

      if (selectedMarker) {
        //debugger;
        if (selectedMarker.hasTrackLoaded()) {
          selectedMarker.track.render();
        }
        selectedMarker.render({selected: true, ...options});

        let view = map.getView();
        let zoom = view.getZoom();
        let size = map.getSize();
        let pixel = [(size[0] - SIDEBAR_WIDTH_PX) / 2, size[1] / 2];

        if (pointsStore.state.trackingMode) {
            view.centerOn(selectedMarker.coords, size, pixel)
            if (zoom < 12) {
              view.setZoom(12)
            }
            this.disableInteractions();
        } else {
          this.enableInteractions()
        }

      } else {
        this.enableInteractions()
      }
  }
    //todo remove this
    if (!selected) {
      this.hidePopup()
    }


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
    let interactions = this.map.getInteractions();

    if (this._handlers !== null) {
      map.unByKey(this._handlers.singleclick)
      map.unByKey(this._handlers.pointermove)
      this._handlers = null;

      interactions.forEach((interaction)=> {
        interaction.setActive(false)
      })
    }
  }

  getMarkersInBounds(bounds) {

    let returns = [];
    let markers = this.markers;
    let keys = Object.keys(markers);

    for (let i = 0, till = keys.length; i < till; i++) {
      let key = keys[i];
      let marker = markers[key];

      // @todo переписать на простые сравнения, без метода contains
      if (ol.extent.containsCoordinate(bounds, marker.coords) && marker.isVisible()) {
        returns.push(marker)
      }
    }

    return returns;
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.points !== undefined ){
      this.updatePoints(nextProps.points);
    }
  }

  updatePoints(updatedPoints) {

    let keys = Object.keys(updatedPoints);

    for (let i = 0, till = keys.length; i < till; i++) {

      let key = keys[i];
      let point = updatedPoints[key];

      if (point.timestamp === 1420074000000) {
        continue;
      }

      let oldPoint = this.markers[key];
      if (oldPoint) {
        oldPoint.setPoint(point)
      } else {
        this.markers[key] = new CarMarker(point, this);
      }
    }
  }

}

