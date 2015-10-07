import MapServerConfig from './MapServerConfig.js';

const INITIAL_EXTENT = MapServerConfig.initialExtent;
const FULL_EXTENT = MapServerConfig.fullExtent;
const TILES_URL = '//ods.mos.ru/ssd/ArcGIS/rest/services/egko_go/MapServer';
const TILE_SIZE = MapServerConfig.tileInfo.rows;
const ORIGIN = MapServerConfig.tileInfo.origin;

export function projectToPixel([x, y]) {
	return olmap.getPixelFromCoordinate([x, y])
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
              var z = tileCoord[0];
              var x = tileCoord[1];
              var y = -tileCoord[2] - 1;
              return TILES_URL + '/tile/' + z + '/' + y + '/' + x
          },
          projection: PROJECTION,
          tileGrid: new ol.tilegrid.TileGrid({
              origin: [ORIGIN.x, ORIGIN.y],
              resolutions: RESOLUTIONS,
              tileSize: TILE_SIZE
          })
      }),
      extent: EXTENT
});