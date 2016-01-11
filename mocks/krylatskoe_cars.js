//import { getCarsInfo }  from './adapter.js';
//import { getOwnerById } from './owners.js';
import { getTypeById} from '../scripts/types.js';
import { getModelById } from '../scripts/models.js';

let KRYLATSKOE_CARS = [];

export function getCars() {
	return fetch('//ods.mos.ru/ssd/city-dashboard/cache_krylatskoe/')
	.then(r => r.json())
	.then(cars => {
		let KRYLATSKOE_CARS_INNER = [];
		_.each(cars, (car, key ) => {
			let _car = car.car;

			delete car.contract_type_ids;
			delete car.contractor_ids;
			delete car.customer_ids;
			delete car.provider_ids;

			let type = getTypeById(_car.type_id);
			let model = getModelById(_car.model_id);

			_car.type = !!type ? type.title : 'Н/Д';
			_car.model = !!model ? model.title === 'НЕИЗВЕСТНА' ? "Н/Д" : model.title : 'Н/Д';
			_car.label = _car.gov_number + ' [' + _car.model + ']';
			_car.id = key;
			_car.value = key;
			KRYLATSKOE_CARS.push( _car );
			KRYLATSKOE_CARS_INNER.push( _car );
		})

		return KRYLATSKOE_CARS_INNER;
	})
}

export function getCarById(id) {
	let result;
	_.each(KRYLATSKOE_CARS, (car) => {
		if (car.id === id) {
			result = car;
		}
	})

	return !!result ? result : {};
}

export function getCarsByModelId(model_id) {
	const cars = _.filter(KRYLATSKOE_CARS, c => c.model_id === model_id);
	return cars;
}


export default KRYLATSKOE_CARS;
