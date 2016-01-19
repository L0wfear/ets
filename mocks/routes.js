import {getRoadByODHId, getRoadsActual} from '../scripts/adapter.js';


let ACTUAL_ROADS = [];
// getRoadsActual().then(r => {
// 	ACTUAL_ROADS = r;
// 	//console.log('actual roads loaded', ACTUAL_ROADS)
// });

let ACTUAL_DTS = []

// fetch('http://ods.mos.ru/ssd/city-dashboard/dt_list/').then(r=>r.json()).then(r=> {
// 	ACTUAL_DTS = r;
// 	//console.log('actual dts loaded', ACTUAL_DTS)
// });

let LIST =  [
	{
		id: 1,
		name: 'Крылатское маршрут 1 (ПУ-зима)',
		image: 'images/routes/1_zima.jpg',
		odhs: [10000259,10000252,10005327,10000260,10005328,10005332,10000257,10000262,10000272,10000258,10000261,10005331,10005330]
	},
	{
		id:2,
		name: 'Крылатское маршрут 2 (ПЩ-зима)',
		image: 'images/routes/2_zima_psch.jpg',
		odhs: [10000259,10005327,10000260,10005328,10005332,10000257,10000262,10000272,10000258,10000261,10005331,10005330]
	},
	{
		id: 3,
		name: 'Крылатское маршрут 4 (зима)',
		image: 'images/routes/4_zima.jpg',
		odhs: [],
		dts: []
	}
]

export function getRouteById (id) {
	let result;
	_.each(LIST, route => {
		if (route.id === id ) {
			result = route
		}
	})

	return result;
}


_.each(LIST, (v) => {
	v.label = v.name;
	v.value = v.id;
	v.polys = {}
	v.odhNames = [];

	if (v.odhs.length > 0) {
		v.odhs.forEach((odhID) => getRoadByODHId(odhID).then(r => {
			v.odhNames.push(r[0].name);
			v.polys[odhID] = {
				shape: JSON.parse(r[0].SHAPE),
				simplified: JSON.parse(r[0].SHAPE_SIMPLIFIED),
				name: r[0].name,
				state: 1
			}
		}))
	}
})

window.ROUTES = LIST;

export default LIST;
