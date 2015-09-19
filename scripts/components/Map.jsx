import React, { Component } from 'react';
import { getStatusById } from '../statuses.js';
import { getTypeById } from '../types.js';
import { icons } from '../icons/index.js';
import Marker from './map/Marker.js';
import L from '../vendor/leaflet.8.js';
import 'leaflet-zoombox/L.Control.ZoomBox.min.js';
import _ from 'lodash';

let SIDEBAR_WIDTH_PX = 500;

L.Map.include({

  /**
   * prevents track from repainting canvas in trackingMode
   * don't touch ma talala!
   */

  panToCenterWithoutAnimation: function(center, store) {
    L.Transition = null;

    const panFn = () => {

      /*if ( this._zoomAnimated || this._fadeAnimated) {
        // TODO TRY TO OPTIMIZE
        // console.log( 'this is animated! dont try to pan plz. zoom is ', this.getZoom());
        // return false;
      }*/

      if (!store.state.trackingMode) return;

      let newOrigin = this._getNewPixelOrigin(center);
      let origin = this.getPixelOrigin();
      let offset = newOrigin.subtract(origin);
      let mapWidth = this.getSize().x;

      // вычисляем смещение с учетом открытого сайдбара
      offset.x = offset.x + ( mapWidth - (mapWidth  - SIDEBAR_WIDTH_PX ) ) / 2;

      if ( offset.x === 0 && offset.y === 0 ) return;

      console.log( 'moving map by', offset)

      // эмулируем события лифлета для правильной отрисовки карты
      this.fire('movestart');
      this._rawPanBy(offset); // внутренняя незадокументированная функция
      this.fire('move');
      this.fire('moveend',{hard:true});
      //this.fire('zoomend');
      //this.fire('dragend');
    }

    setTimeout( panFn.bind( this ), 150)
  }
});


class Map extends Component {

  constructor(props, context) {
    super(props, context);
    this._markers = {};
    this.adjustHeight = this.adjustHeight.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    let { center, zoom, showAttribution, renderLoop } = this.props;

    this.adjustHeight();

    let el = React.findDOMNode(this);
    let map = this._map = L.map(el, {
      attributionControl: false,
      preferCanvas:true//,
      //dragging: true
    });

    // @TODO remove this
    window.MAP = map;

    map.setView(center, zoom);

    let tiles =
      L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        detectRetina: true,   // http://leafletjs.com/reference.html#map-stuff-methods
        maxZoom: 16,
        minZoom: 8,
        zoomAnimation: false,
        // Disable the animation of tiles fading in and out.
        fadeAnimation: false,
        // Disable the inertia that causes the map to keep moving
        // when you drag it quickly.
        inertia: false
      })
        .addTo(map)
        .bringToBack();

    // zoombox control
    // hold shift plz
    var control = L.control.zoomBox({
       modal: false,  // If false (default), it deactivates after each use.
                    // If true, zoomBox control stays active until you click on the control to deactivate.
       position: "topleft",
       className: "zoombox-control"  // Class to use to provide icon instead of Font Awesome
    });
    map.addControl(control);

    let canvas = L.canvas({pane: 'overlayPane'}).addTo(map);
    this._canvas = canvas._container;
    this._ctx = canvas._ctx;

    this._canvas.addEventListener('mousemove', this.onMouseMove);
    map.on('click', this.onClick);
    map.on('dragstart', this.onDragStart)

    if (showAttribution) {

      let attr = L.control.attribution({
        prefix: false,
        position: 'bottomleft'
      });

      attr.addAttribution(`
        &copy; 2014-2015
        <img src="images/logo.png" style="width: 16px; height: 16px; margin-right: -5px"/>
        <a href="http://gost-group.com/" target="_blank">Группа компаний GOST</a>
      `);

      attr.addTo(map);
    }

    window.addEventListener('resize', this.adjustHeight);

    /* TODO optimize rendering via throttle or debounce
       based on some conditions like trackingMode

    let renderFn = this.renderCanvas.bind(this);
    renderLoop.add(_.throttle(renderFn, 400), this); */

    renderLoop.add(this.renderCanvas, this);

    // убираем тайтлы у подсказок
    const classesToRemove = ['leaflet-control-zoom-in', 'leaflet-control-zoom-out', 'leaflet-zoom-box-control'];
    const removeTitle = (className)=> {
      let el = document.getElementsByClassName(className)[0];
      el.setAttribute('title','')
    }
    setTimeout(()=>classesToRemove.forEach(removeTitle),0)

  }

  onDragStart(event){
    let store = this.props.flux.getStore('points');
    let isTracking = store.state.trackingMode;

    if (isTracking){
      store.setState({trackingMode: false})
    }

  }

  getMarkersInBounds(bounds){

    let points = [];
    let markers = this._markers;
    let keys = Object.keys(markers);

    for ( let i = 0, till = keys.length; i < till; i++){
      let key = keys[i];
      let marker = markers[key];

      if ( bounds.contains(marker._coords)){
        points.push(marker)
      }
    }

    return points;
  }

  renderCanvas(time) {

    let flux = this.props.flux;
    let pointsStore = flux.getStore('points');

    let isRenderPaused = pointsStore.state.isRenderPaused;
    if ( isRenderPaused ) return;

    const canvas = this._canvas;
    let ctx = this._ctx;
    let map = this._map;
    let selected = pointsStore.getSelectedPoint();
    let markers = this._markers;
    const bounds = map.getBounds();

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    let optimizedPoints = this.getMarkersInBounds(bounds);

    const options = { showPlates: this.props.showPlates };
    let rendered = 0;
    for ( let i = 0, till = optimizedPoints.length; i < till; i++){
      let marker = optimizedPoints[i];

      if ( selected === null || marker._point.id !== selected.id) {
        marker.render( ctx, false, time, options);
        rendered++;
      }
    }

    let selectedMarker = selected ? markers[selected.id] : false;
    if (selectedMarker) {
      selectedMarker.renderTrackInColors(ctx)
      //selectedMarker.renderTrack(ctx);
      selectedMarker.render(ctx, true, time, options);

      if (pointsStore.state.trackingMode){
        this.disableInteractions();
        if ( map.getZoom() < 15 ) {
          map.fitBounds([selectedMarker._coords], {
            paddingBottomRight: [500,50],
            paddingTopLeft: [50,50],
            animate: false,
            zoom: 16
          });
        }
        map.panToCenterWithoutAnimation(selectedMarker._coords, pointsStore)
      }
    } else {
      this.enableInteractions()
    }
  }

  disableInteractions(){
    return;

    let map = this._map;
    map.zoomControl.disable();
    map.touchZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
  }

  enableInteractions(){
    return;

    let map = this._map;
    map.zoomControl.enable();
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) map.tap.enable();
  }

  componentWillReceiveProps(nextProps) {
    this.updateMarkers(nextProps.points);
  }

  updateMarkers(points) {
    let keys = Object.keys(points);
    let markers = this._markers;
    let flux = this.props.flux;
    let pointsStore = flux.getStore('points');

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let point = points[key];
      if (point['timestamp'] == 1420074000000) {
        continue;
      }
      if ((typeof(point['coords']) === 'undefined') || (typeof(point['speed']) === 'undefined')){
        console.warn('point coords or speed is undefined, so skip! point: ', point);
        continue;
      }
      if ((point['coords'][0] === null) || (point['coords'][1] === null)){
        console.warn('point lat or long is null, so skip! point: ', point);
        continue;
      }

      let marker = markers[key];

      if (marker) {
        marker.setPoint(point)
      } else {
        markers[key] = new Marker(point, this._map, pointsStore);
      }
    }

  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.adjustHeight);
    this._map = null;
    this._canvas = null;
    this._markers = {};

    if (this._animation) {
      window.cancelAnimationFrame(this._animation);
      this._animation = null;
    }

  }

  adjustHeight() {
    let el = React.findDOMNode(this);
    el.style.height = window.innerHeight + 'px';
  }

  render() {
    return <div/>;
  }

  onMouseMove(e) {

    let map = this._map;
    let point = map.mouseEventToLayerPoint(e);

    let bounds = map.getBounds();
    let points = this.getMarkersInBounds(bounds);
    let keys = Object.keys(points);

    let interactive = false;

    for (let i = 0, till = keys.length; i < till; i++) {
      let key = keys[i];
      let marker = points[key];

      if (marker.contains(point)) {
        interactive = true;
        break;
      }
    }

    if (!interactive) {
      L.DomUtil.removeClass(this._canvas, 'leaflet-interactive');
    } else {
      L.DomUtil.addClass(this._canvas, 'leaflet-interactive');
    }

  }

  onClick(e) {
    let map = this._map;
    let bounds = map.getBounds();
    let markers = this.getMarkersInBounds(bounds);
    let point = e.layerPoint;

    let keys = Object.keys(markers);
    let selected = null;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let marker = markers[key];

      if (marker.contains(point)) {
        selected = marker;
      }
    }

    let flux = this.props.flux;
    let store = flux.getStore('points');
    store.handleSelectPoint( selected && selected._point)
  }

}

export default Map;
