import ol from 'openlayers';
import React, { Component } from 'react';


/*
TODO request this with JSONP
 let MapServerConfig = TILES_URL + '?f=json&pretty=true';
 fetch( MAP_SERVER_INFO, (data)=>console.log('tileserverinfo is', data ))
 */
import MapServerConfig from './MapServerConfig.js';

const TILES_URL = '//ods.mos.ru/ssd/ArcGIS/rest/services/egko_go/MapServer';
const TILE_SIZE = [MapServerConfig.tileInfo.rows, MapServerConfig.tileInfo.cols];
const ORIGIN = MapServerConfig.tileInfo.origin;
const INITIAL_EXTENT = MapServerConfig.initialExtent;
const FULL_EXTENT  = MapServerConfig.fullExtent;

let resolutions = [];
let scales = [];

for (let i=0, till = MapServerConfig.tileInfo.lods.length; i<till; i++) {
  resolutions.push(MapServerConfig.tileInfo.lods[i].resolution);
  scales.push(MapServerConfig.tileInfo.lods[i].scale);
}

let tilesPerZoom = [
    12,
    35,
    187,
    640,
    1768
  ]




class OpenLayersMap extends Component {


  constructor(props, context) {
    super(props, context);
  }


  /**
   * initialization here
   */
  componentDidMount() {

    let initialView = {
      center: [0, 0],
      zoom: 1
    };

    let obj = ol;

    //debugger;
    let layerExtent = /*new OL.Bounds(*/[FULL_EXTENT.xmin, FULL_EXTENT.ymin, FULL_EXTENT.xmax, FULL_EXTENT.ymax]//);


    let TileLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
       // attributions: [attribution],
        url: TILES_URL+'/tile/{z}/{y}/{x}'
      })
    })

    let layers = [
      TileLayer
     // OL.Layer.XYZ('ESRI', TILES_URL+'/tile/${z}/${y}/${x}')
    ]


     /**
      * EXAMPLE
      * OF Layer.XYZ
      *
     var map, layer;
      function init(){
        var layerExtent = new OpenLayers.Bounds( -13758743.4295939,  5591455.28887228, -13531302.3472101 , 5757360.4178881);
        map = new OpenLayers.Map( 'map', {'restrictedExtent': layerExtent} );
        layer = new OpenLayers.Layer.XYZ( "ESRI",
          "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}",
          {sphericalMercator: true} );
        map.addLayer(layer);
        map.zoomToExtent(map.restrictedExtent);
      }
    */

   /* let cacheLayer = new OL.layer.ArcGISCache( "AGSCache",
      "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer", {
        isBaseLayer: true,

        //From layerInfo above
        resolutions: resolutions,
        tileSize: TILE_SIZE,
        tileOrigin: [ORIGIN.x, ORIGIN.y],
        maxExtent: layerExtent,
        //projection: 'EPSG:' + layerInfo.spatialReference.wkid
      });*/

    //layers.push( cacheLayer );

    let map = new ol.Map({
      target: 'olmap',
      view: initialView,
      layers: layers,
      resolutions: resolutions,
      restrictedExtent: layerExtent,
      units: MapServerConfig.units
    })

  }

  render(){
    return (
      <div className="openlayers-container">
        <div id="olmap"></div>
      </div>
    )
  }


}

export default OpenLayersMap;
