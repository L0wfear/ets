import TileLayer from 'ol/layer/Tile';
import TileImage from 'ol/source/TileImage';
import TileGrid from 'ol/tilegrid/TileGrid';
import Projection from 'ol/proj/Projection';
import MapServerConfig from 'components/new/ui/map/config/MapServerConfig';

const FULL_EXTENT = MapServerConfig.fullExtent;
const TILES_URL = '//apieatlas.mos.ru/arcgis/rest/services/egko_122018/MapServer/tile';
const TILE_SIZE = MapServerConfig.tileInfo.rows;
const ORIGIN = MapServerConfig.tileInfo.origin;

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

const ArcGisSource = new TileImage({
  url: `${TILES_URL}/{z}/{y}/{x}`,
  tilePixelRatio: 4,
  crossOrigin: 'anonymous',
  projection: PROJECTION,
  tileGrid: new TileGrid({
    origin: [ORIGIN.x, ORIGIN.y],
    resolutions: RESOLUTIONS,
    tileSize: TILE_SIZE,
  }),
  // tilePixelRatio: 2,
});

export const getArcGisLayer = () => (
  new TileLayer({
    source: ArcGisSource,
    extent: EXTENT,
  })
);

