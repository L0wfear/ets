//import ol from 'imports?define=>false!openlayers';
import React, { Component } from 'react';


/*
TODO request this with JSONP
 let MapServerConfig = TILES_URL + '?f=json&pretty=true';
 fetch( MAP_SERVER_INFO, (data)=>console.log('tileserverinfo is', data ))
 */
import MapServerConfig from './MapServerConfig.js';
const OpenLayers = global.ol = ol;

const TILES_URL = 'http://ods.mos.ru/ssd/ArcGIS/rest/services/egko_go/MapServer'// '//ods.mos.ru/ssd/ArcGIS/rest/services/egko_go/MapServer';
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
  



// https://github.com/pka/ol3-react-example
// local crs example http://stackoverflow.com/questions/20222885/custom-tiles-in-local-crs-without-projection
// custom tiles example
class OpenLayersMap extends Component {


  constructor(props, context) {
    super(props, context);
  }


  shouldComponentUpdate() {
    return false;
  }

  /**
   * initialization here
   */
  componentDidMount() {

    let initialView =  new ol.View({
      center: [4191042.260876214, 7500918.459680917],
      zoom: 10,
      minZoom: 0,
      maxZoom: 20
    })

    let layerExtent = [FULL_EXTENT.xmin, FULL_EXTENT.ymin, FULL_EXTENT.xmax, FULL_EXTENT.ymax]//);

    console.log( layerExtent);
    let container = React.findDOMNode(this);


        let map = new ol.Map(
          {
          view: initialView,
          target: 'olmap',
          renderer: 'canvas',
          controls: ol.control.defaults(),
          layers: [
      
            new ol.layer.Tile({
                              source: new ol.source.OSM()
                          }),
            new ol.layer.Tile({
              source: new ol.source.TileArcGISRest({
                url: TILES_URL
              })
            }),
          ]
        })


      global.olmap = map;
      map.setTarget(container);
  }

  render(){
    return (
      <div className="openlayers-container"/>
    )
  }


}

export default OpenLayersMap;
