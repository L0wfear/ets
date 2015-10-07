import MapServerConfig from './MapServerConfig.js';

const ORIGIN = [-5622500, 3830200];

//let projection = new ol.proj.Projection();


const transformFn = ol.proj.transform;
const projectFromLonLatFn = ol.proj.fromLonLat;

const OL_EXTENTS = {
	//	xmin: 

    topLeft: [4018294.576951716, 7579189.976644937],
    topRight: [4356299.116028764, 7578731.354475225],
    bottomRight: [4351560.020275084, 7368376.6526344195],
    bottomLeft: [4022422.176479114, 7368835.274804131]
}


const INITIAL_EXTENT = MapServerConfig.initialExtent;
const FULL_EXTENT = MapServerConfig.fullExtent;


export function projectLonLat([lat, lon]){
	return projectFromLonLatFn([lon, lat]);
}

export function projectToPixel([x, y]){
	return olmap.getPixelFromCoordinate([x, y])
}


/**
 * функция проецирования координат МСК в координаты OpenLayers
 * @return {[type]} [description]
 */
export function project([x, y]){




	// get BOUNDS
	// get ORIGIN
	

	// process X
	// 
	
	if ( x > FULL_EXTENT.xmax || x < FULL_EXTENT.xmin){
		console.log( 'x ',x,'is not in initials')
	}
	if ( y > FULL_EXTENT.ymax || y < FULL_EXTENT.ymin){
		console.log( 'y ',y,'is not in initials')
	}


	let projectedX =  OL_EXTENTS.topLeft[0] + (x - ORIGIN[0]) * Xproportion;//50,34504057
	let projectedY = OL_EXTENTS.topLeft[1] + (y - ORIGIN[1]) * Yproportion;

//debugger;
	return [projectedX, projectedY];




	// process Y

}


/**
 * функция проецирования координат OpenLayers в координаты МСК
 * @return {[type]} [description]
 */
function unproject(){

}

function pixelProject(){

}


