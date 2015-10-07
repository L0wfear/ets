// import ol from 'imports?define=>false!openlayers';
import React, { Component } from 'react';
import CarMarker from '../markers/car/Marker.js';

import {project as MSKProject, projectLatLon} from './MskAdapter.js';

// WebGL example
// http://openlayers.org/en/master/examples/icon-sprite-webgl.html
//
// current WebGL stats
// http://webglstats.com/
//
// OpenLayers performance cases
// http://trac.osgeo.org/openlayers/wiki/Future/OpenLayersWithCanvas

import MapServerConfig from './MapServerConfig.js';
global.ol = ol;

//olx.FrameState.pixelRatio = 1;

const TILES_URL = 'http://ods.mos.ru/ssd/ArcGIS/rest/services/egko_go/MapServer' // '//ods.mos.ru/ssd/ArcGIS/rest/services/egko_go/MapServer';
const TILE_SIZE = [MapServerConfig.tileInfo.rows, MapServerConfig.tileInfo.cols];
const ORIGIN = MapServerConfig.tileInfo.origin;
const INITIAL_EXTENT = MapServerConfig.initialExtent;
const FULL_EXTENT = MapServerConfig.fullExtent;

let resolutions = [];
let scales = [];

for (let i = 0, till = MapServerConfig.tileInfo.lods.length; i < till; i++) {
  resolutions.push(MapServerConfig.tileInfo.lods[i].resolution);
  scales.push(MapServerConfig.tileInfo.lods[i].scale);
}

/* let tilesPerZoom = [
    12,
    35,
    187,
    640,
    1768]*/


// https://github.com/pka/ol3-react-example
// local crs example http://stackoverflow.com/questions/20222885/custom-tiles-in-local-crs-without-projection
// custom tiles example
export default class OpenLayersMap extends Component {

  constructor(props, context) {
    super(props, context);

    this._points = {};
    this._pointsStore = this.props.flux.getStore('points');
  }


  shouldComponentUpdate() {
    return false;
  }

  /**
   * initialization here
   */
  componentDidMount() {

    let some_extent = [4207094.0368161015, 7465145.9304434545, 4216877.976436604, 7474929.870063957];

    let initialView = new ol.View({
      center: this.props.center,
      zoom: this.props.zoom,
      minZoom: 0,
      maxZoom: 20, 
     // projection: 'EPSG:4326'
      //extent: some_extent
    })


    let layerExtent = [FULL_EXTENT.xmin, FULL_EXTENT.ymin, FULL_EXTENT.xmax, FULL_EXTENT.ymax] //);


    let MSK_SOURCE = new ol.source.TileArcGISRest({
        url: TILES_URL
      });

    window.MSK = MSK_SOURCE

    let MSK77Layer = new ol.layer.Tile({
      source: MSK_SOURCE
    });


    let canvasLayer = new ol.layer.Image({
        source: new ol.source.ImageCanvas({
          canvasFunction: canvasFunction
        })
      });

    window.MSK_LAYER = MSK77Layer;
    console.log( MSK_SOURCE)

    let container = React.findDOMNode(this);

    let map = new ol.Map(
      {
        view: initialView,
        target: 'olmap',
        renderer: 'canvas',
        controls: ol.control.defaults(),

        layers: [
        //canvasLayer,

        /*new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: TILES_URL + '/tile/{z}/{y}/{x}'
          })
        }),*/

       // new ol.layer.Tile({
        //    source: new ol.source.MapQuest({layer: 'sat'})
        //  }),
        MSK77Layer
        ]
      })
    map.setTarget(container);


    this._map = global.olmap = map;

    this._canvas = olmap.renderer_.canvas_;
    //this.renderCanvas()

    map.on('click', this.onClick.bind(this))

    function canvasFunction(extent, resolution, pixelRatio, size, projection){
      console.log( 'canvas works');
    }

    this.renderCanvas()
  }


  onClick(ev) {

    let map = this._map;
    let pixel = ev.pixel; // координаты viewport
    let coordinate = ev.coordinate;


    console.log('lonlat from pixel', ol.proj.toLonLat(coordinate))
    console.log( 'coord from pixel', map.getCoordinateFromPixel(pixel))
    console.log( 'pixel from coordinate ',map.getPixelFromCoordinate(coordinate))

  }

  render() {
    return <div className="openlayers-container"/>
  }

  projectCoordToViewportPixel([x, y]){
     return this._map.getPixelFromCoordinate([x,y])
  }

  renderCanvas(time) {


    let pointsStore = this._pointsStore;

  /*  let isRenderPaused = pointsStore.state.isRenderPaused;
    if (isRenderPaused) return;*/

    const canvas = this._canvas;

    let ctx = this._canvas.getContext('2d');
    let map = this._map;
    let selected = pointsStore.getSelectedPoint();
    let markers = this._markers;

    const bounds = map.getView().calculateExtent(map.getSize());

   // ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
   // ctx.clearRect(0, 0, canvas.width, canvas.height);
   // ctx.restore();

    let optimizedPoints = this._points; //this.getMarkersInBounds(bounds);

    const options = {
      showPlates: this.props.showPlates
    };

console.log( 'rendering canvas ')

    let rendered = 0;
    let keys = Object.keys(optimizedPoints);

    for (let i = 0, till = keys.length; i < till; i++) {

      //if ( i > 1) return;
      let key = keys[i];
      let marker = optimizedPoints[key];
      let id = marker._point.id;

      if (selected === null || id !== selected.id) {
        //if ( POINTS_CACHE_MAP[id] === undefined || POINTS_CACHE_MAP[id] < marker._point.timestamp){
        marker.render(ctx, false, time, options);
        rendered++;
      // }
      }
    }

    let selectedMarker = selected ? markers[selected.id] : false;
    if (selectedMarker) {
      selectedMarker.renderTrackInColors(ctx, map.getZoom() >= 15)
      //selectedMarker.renderTrack(ctx);
      selectedMarker.render(ctx, true, time, options);

      if (pointsStore.state.trackingMode) {
        this.disableInteractions();
        if (map.getZoom() < 15) {
          map.fitBounds([selectedMarker._coords], {
            paddingBottomRight: [500, 50],
            paddingTopLeft: [50, 50],
            animate: false,
            zoom: 16
          });
        }
        map.panToCenterWithoutAnimation(selectedMarker._coords, pointsStore)
      }
    } else {
      this.enableInteractions()
    }


    window.requestAnimationFrame(this.renderCanvas.bind(this))

 }

  enableInteractions() {
    // todo enable openlayers interactions
  }

  disableInteractions() {
    // todo disable openlayers interactions
  }

  getMarkersInBounds(bounds) {

    let returns = [];
    let points = this._points;
    let keys = Object.keys(points);

    return points;

    for (let i = 0, till = keys.length; i < till; i++) {
      let key = keys[i];
      let point = points[key];

      if (bounds.contains(marker._coords)) {
        returns.push(marker)
      }
    }

    console.log( returns );
    return returns;
  }


  componentWillReceiveProps(nextProps) {
    this.updatePoints(nextProps.points);
  }

  updatePoints(updatedPoints) {

    let keys = Object.keys(updatedPoints);

    for (let i = 0, till = keys.length; i < till; i++) {

      let key = keys[i];
      let point = updatedPoints[key];

      if (point.timestamp === 1420074000000) {
        continue;
      }
      if ((typeof point.coords === 'undefined') || (typeof point.speed === 'undefined')) {
        console.warn('point coords or speed is undefined, so skip! point: ', point);
        continue;
      }
      if ((point.coords[0] === null) || (point.coords[1] === null)) {
        console.warn('point lat or long is null, so skip! point: ', point);
        continue;
      }


      let _point = this._points[key];

      if (_point) {
        _point.setPoint(point)
      } else {
        this._points[key] = new CarMarker(point, this._map, this._pointsStore);
      }
    }
  }

}

