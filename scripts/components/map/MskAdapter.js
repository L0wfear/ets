import MapServerConfig from './MapServerConfig.js';

const INITIAL_EXTENT = MapServerConfig.initialExtent;
const FULL_EXTENT = MapServerConfig.fullExtent;


export function projectToPixel([x, y]) {
	return olmap.getPixelFromCoordinate([x, y])
}

export let EXTENT = [FULL_EXTENT.xmin, FULL_EXTENT.ymin, FULL_EXTENT.xmax, FULL_EXTENT.ymax]
export let PROJECTION = new ol.proj.Projection({
    code: 'MSK77',
    units: 'pixels',
    extent: EXTENT
});