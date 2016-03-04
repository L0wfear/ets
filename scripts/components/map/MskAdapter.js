//import MapServerConfig from './MapServerConfig.js';
//import MapServerConfig from './MapServerConfig2.js';
import MapServerConfig from './MapServerConfig3.js';

const INITIAL_EXTENT = MapServerConfig.initialExtent;
const FULL_EXTENT = MapServerConfig.fullExtent;
//const TILES_URL = '//ods.mos.ru/ssd/ArcGIS/rest/services/egko_go/MapServer/tile/';
//const TILES_URL = '//apieatlas.mos.ru/arcgis/rest/services/Basemaps/egko_gc_graphics/MapServer/tile/';
const TILES_URL = '//moslight.mos.ru/ArcGIS/rest/services/egko_belle/MapServer/tile/';
const TILE_SIZE = MapServerConfig.tileInfo.rows;
const ORIGIN = MapServerConfig.tileInfo.origin;
const DEVICE_PIXEL_RATIO = window.devicePixelRatio;

export function projectToPixel(coordinates) {
  let x, y;

  if (coordinates.length) {
    [x, y] = coordinates;
  } else {
    x = coordinates.x;
    y = coordinates.y
  }

  if (x === null || y === null) {
    return [0, 0];
  }

  if (typeof olmap === 'undefined') {
    return { x: 1, y: 1};
  }

  let coords = olmap.getPixelFromCoordinate([x, y]);

	return { x: coords[0] * DEVICE_PIXEL_RATIO, y: coords[1] * DEVICE_PIXEL_RATIO};
}

export let EXTENT = [FULL_EXTENT.xmin, FULL_EXTENT.ymin, FULL_EXTENT.xmax, FULL_EXTENT.ymax]
export let PROJECTION = new ol.proj.Projection({
    code: 'MSK77',
    units: 'pixels',
    extent: EXTENT
})


let RESOLUTIONS = [];
let SCALES = [];
for (let i = 0, till = MapServerConfig.tileInfo.lods.length; i < till; i++) {
  RESOLUTIONS.push(MapServerConfig.tileInfo.lods[i].resolution);
  SCALES.push(MapServerConfig.tileInfo.lods[i].scale);
}

 export let ArcGisLayer = new ol.layer.Tile({
      source: new ol.source.TileImage({
          tileUrlFunction: function(tileCoord, pixelRatio, projection) {
              let z = tileCoord[0];
              let x = tileCoord[1]; // было без + 1
              let y = - tileCoord[2] - 1; // было с -1
              return TILES_URL + z + '/' + y + '/' + x
          },
          projection: PROJECTION,
          tileGrid: new ol.tilegrid.TileGrid({
              origin: [ORIGIN.x, ORIGIN.y],
              resolutions: RESOLUTIONS,
              tileSize: TILE_SIZE
          }),
          //tilePixelRatio: 2,
      }),
      extent: EXTENT
});
