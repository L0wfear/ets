import Tile from 'ol/layer/Tile';
import TileImage from 'ol/source/TileImage';
import TileGrid from 'ol/tilegrid/TileGrid';
import Projection from 'ol/proj/Projection';
import MapServerConfig from 'components/new/ui/map/config/MapServerConfig';

// import { debounce } from 'lodash';
// import EverGisTokenService from 'api/map/EverGisTokenService';

const FULL_EXTENT = MapServerConfig.fullExtent;
const TILES_URL =
  '//apieatlas.mos.ru/arcgis/rest/services/egko_122018/MapServer/tile';
const TILE_SIZE = MapServerConfig.tileInfo.rows;
const ORIGIN = MapServerConfig.tileInfo.origin;
const DEVICE_PIXEL_RATIO = window.devicePixelRatio;
// let evergisTokenService = null;

export function projectToPixel(map, coordinates) {
  let x;
  let y;

  if (coordinates.length) {
    [x, y] = coordinates;
  } else {
    x = coordinates.x;
    y = coordinates.y;
  }

  if (x === null || y === null) {
    return { x: 0, y: 0 };
  }

  const coords = map.getPixelFromCoordinate([x, y]);

  return {
    x: coords[0] * DEVICE_PIXEL_RATIO,
    y: coords[1] * DEVICE_PIXEL_RATIO,
  };
}

export function projectToPixelNew(map, coordinates) {
  let x;
  let y;

  if (coordinates.length) {
    [x, y] = coordinates;
  } else {
    x = coordinates.x;
    y = coordinates.y;
  }

  if (x === null || y === null) {
    return { x: 0, y: 0 };
  }

  const coords = map.getPixelFromCoordinate([x, y]);

  return { x: coords[0], y: coords[1] };
}

export const EXTENT: [number, number, number, number] = [
  FULL_EXTENT.xmin,
  FULL_EXTENT.ymin,
  FULL_EXTENT.xmax,
  FULL_EXTENT.ymax,
];
export const PROJECTION = new Projection({
  code: 'MSK77',
  units: 'pixels',
  extent: EXTENT,
});

const RESOLUTIONS = [];
const SCALES = [];
for (let i = 0, till = MapServerConfig.tileInfo.lods.length; i < till; i++) {
  RESOLUTIONS.push(MapServerConfig.tileInfo.lods[i].resolution);
  SCALES.push(MapServerConfig.tileInfo.lods[i].scale);
}

function tileUrl(tileCoord) {
  /*
  if (!evergisTokenService) {
    evergisTokenService = new EverGisTokenService();
  }
  const z = tileCoord[0];
  const x = tileCoord[1];
  const y = -tileCoord[2] - 1;
  return `${TILES_URL}/${z}/${y}/${x}?_sb=${evergisTokenService.getToken()}`;
  */

  const z = tileCoord[0];
  const x = tileCoord[1];
  const y = tileCoord[2];
  return `${TILES_URL}/${z}/${y}/${x}`;
}

const ArcGisSource = new TileImage({
  tileUrlFunction: tileUrl,
  crossOrigin: 'anonymous',
  projection: PROJECTION,
  tileGrid: new TileGrid({
    origin: [ORIGIN.x, ORIGIN.y],
    resolutions: RESOLUTIONS,
    tileSize: TILE_SIZE,
  }),
  // tilePixelRatio: 2,
});

ArcGisSource.on('tileloadstart', () => {
  // any
});

/*
function onErrorsLimitCallback() {
  // tslint:disable-next-line
  console.error('EVERGIS TOKEN ATTEMPTS LIMIT EXCEEDED');
}

ArcGisSource.on('tileloaderror', () => {
  // const onErrorsLimit = debounce(onErrorsLimitCallback, 1000);

  // TODO идентифицировать ошибку конкретно токена
  if (!evergisTokenService.isFetchingToken() && !evergisTokenService.attemptsLimitExceeded()) {
    evergisTokenService.fetchToken().then(() => {
      ArcGisSource.refresh();
    });
  } else if (evergisTokenService.attemptsLimitExceeded()) {
    onErrorsLimit();
  }
});
*/

export const ArcGisLayer = new Tile({
  source: ArcGisSource,
  extent: EXTENT,
});
