import React, { Component } from 'react';
import { getStatusById } from '../statuses.js';
import { getTypeById } from '../types.js';
import { icons } from '../icons/index.js';
import Marker from './map/Marker.js';
import L from '../vendor/leaflet-custom-src.js';
import ZoomBox from 'leaflet-zoombox/L.Control.ZoomBox.min.js';


class Map extends Component {

  constructor(props, context) {
    super(props, context);
    this._markers = {};
    this.adjustHeight = this.adjustHeight.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
  }

  getDefaultProps() {

    return {
      center: [51.505, -0.09],
      zoom: 13,
      showAttribution: true
    };

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
      preferCanvas:true
    });

    // @TODO remove this
    window.MAP = map;

    map.setView(center, zoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      detectRetina: true,   // http://leafletjs.com/reference.html#map-stuff-methods
      /*bounceAtZoomLimits: true,
      minZoom: 12,
      unloadInvisibleTiles: true,
      updateWhenIdle: false,
      reuseTiles: true*/
    }).addTo(map);

    // zoombox control
    // hold shift plz
    var control = L.control.zoomBox({
       modal: false,  // If false (default), it deactivates after each use.
                    // If true, zoomBox control stays active until you click on the control to deactivate.
       position: "topleft",
       className: "zoombox-control"  // Class to use to provide icon instead of Font Awesome
    });
    map.addControl(control);

    let canvas = new L.Canvas().addTo(map);
    this._canvas = canvas._container;
    this._ctx = canvas._ctx;

    this._canvas.addEventListener('mousemove', this.onMouseMove);
    map.on('click', this.onClick);
    map.on('dragstart', this.onDragStart)

    /**
     * prevents track from repainting canvas in trackingMode
     * don't touch ma talala!
     */
    map.on('movestart', (ev) => {
      if (this.props.flux.getStore('points').state.trackingMode) {
        return false;
      }
    })

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

      this._interactive = false; // TODO use React

    }

    window.addEventListener('resize', this.adjustHeight);
    this.updateMarkers(this.props.points);
    renderLoop.add(this.renderCanvas, this);

  }

  onDragStart(event){
    let store = this.props.flux.getStore('points');
    let isTracking = store.state.trackingMode;

    if (isTracking){
      store.setState({trackingMode: false})
    }

  }

  getPointsInBounds(bounds){

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

    //let isRenderPaused = pointsStore.state.isRenderPaused;
    //if ( isRenderPaused ) return;

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

    let optimizedPoints = this.getPointsInBounds(bounds);

    const options = { showPlates: this.props.showPlates };
    for ( let i = 0, till = optimizedPoints.length; i < till; i++){
      let marker = optimizedPoints[i];

      if ( marker._point !== selected) {
        marker.render( ctx, false, time, options)
      }
    }

    let selectedMarker = selected ? markers[selected.id] : false;
    if (selectedMarker) {
      selectedMarker.renderTrack(ctx);
      if (pointsStore.state.trackingMode){
        if ( selected.status === 1 ) {
          // смещаем примерно в центр с учетом открытого сайдбара
          // зумлевел кокрастаке можно смотреть по баундам трэка, если он уже загружен
          let _coords = [selectedMarker._coords[0], selectedMarker._coords[1] + 0.004];
          map.setView(_coords, 16, { animate: true })
        }
      }
    }

    if (selectedMarker) {
      selectedMarker.render(ctx, true, time, options);
    }
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
    window.removeEventListner('resize', this.adjustHeight);
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
    let points = this.getPointsInBounds(bounds);
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
    let markers = this._markers;
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

    this.onPointClick(selected && selected._point);
  }

  onPointClick(p) {
    let flux = this.props.flux;
    flux.getActions('points').selectPoint(p);
  }

}

export default Map;
