import MapServerConfig from './MapServerConfig.js';
import EVERGIS_TOKEN, { getToken, fetchEvergisToken, isFetchingToken, attemptsLimitExceeded } from 'utils/evergis.js';
import _ from 'lodash';

const INITIAL_EXTENT = MapServerConfig.initialExtent;
const FULL_EXTENT = MapServerConfig.fullExtent;
const TILES_URL = '//gisoiv.mos.ru/IntegrationGIS/SpatialProcessor/IIS/egko/MapServer/tile';
const TILE_SIZE = MapServerConfig.tileInfo.rows;
const ORIGIN = MapServerConfig.tileInfo.origin;
const DEVICE_PIXEL_RATIO = window.devicePixelRatio;

export function projectToPixel(map, coordinates) {
  let x, y;

  if (coordinates.length) {
    [x, y] = coordinates;
  } else {
    x = coordinates.x;
    y = coordinates.y
  }

  if (x === null || y === null) {
    return { x: 0, y: 0};
  }

  let coords = map.getPixelFromCoordinate([x, y]);

	return { x: coords[0] * DEVICE_PIXEL_RATIO, y: coords[1] * DEVICE_PIXEL_RATIO};
}

export const EXTENT = [FULL_EXTENT.xmin, FULL_EXTENT.ymin, FULL_EXTENT.xmax, FULL_EXTENT.ymax];
export const PROJECTION = new ol.proj.Projection({
  code: 'MSK77',
  units: 'pixels',
  extent: EXTENT
});


let RESOLUTIONS = [];
let SCALES = [];
for (let i = 0, till = MapServerConfig.tileInfo.lods.length; i < till; i++) {
  RESOLUTIONS.push(MapServerConfig.tileInfo.lods[i].resolution);
  SCALES.push(MapServerConfig.tileInfo.lods[i].scale);
}

function tileUrl(tileCoord, pixelRatio, projection) {
    let z = tileCoord[0];
    let x = tileCoord[1];
    let y = - tileCoord[2] - 1;
    return `${TILES_URL}/${z}/${y}/${x}?_sb=${getToken()}`;
}

let ArcGisSource = new ol.source.TileImage({
    tileUrlFunction: tileUrl,
    crossOrigin: 'anonymous',
    projection: PROJECTION,
    tileGrid: new ol.tilegrid.TileGrid({
        origin: [ORIGIN.x, ORIGIN.y],
        resolutions: RESOLUTIONS,
        tileSize: TILE_SIZE
    }),
    // tilePixelRatio: 2,
});

ArcGisSource.on('tileloadstart', () => {
});

ArcGisSource.on('tileloaderror', (error) => {
  const { tile } = error;

  function onErrorsLimit() {
    console.error('EVERGIS TOKEN ATTEMPTS LIMIT EXCEEDED');
  }
  onErrorsLimit = _.debounce(onErrorsLimit, 1000);

  // TODO идентифицировать ошибку конкретно токена
  if (!isFetchingToken() && !attemptsLimitExceeded()) {
    fetchEvergisToken().then(() => {
      ArcGisSource.refresh();
    });
  } else if (attemptsLimitExceeded()) {
    onErrorsLimit();
  }
});

export let ArcGisLayer = new ol.layer.Tile({
  source: ArcGisSource,
  extent: EXTENT
});
