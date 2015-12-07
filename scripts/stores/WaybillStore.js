import LIST from '../../mocks/waybills.js';
import {makeDate, makeTime} from '../utils/dates.js';
import {getDriverByCode} from './EmployeesStore.js';

sortList()

export function getList() {
	return LIST;
}

export function getLastNumber() {
	let result = 0;

	_.each(LIST, (v) => {
		if ( v.id > result ) {
			result = v.id
		}
	})

	return result;
}

function sortList() {
	LIST.sort((a, b) => b.id - a.id)
}

export function createBill(data) {
	let toSave = _.clone(data);
	toSave.status = true;
	toSave.vyezd_plan = makeDate(toSave.vyezd_plan) + ' ' + makeTime(toSave.vyezd_plan);
	toSave.vozvr_plan = makeDate(toSave.vozvr_plan) + ' ' + makeTime(toSave.vozvr_plan);
	toSave.vozvr_fakt = toSave.vyezd_fakt = '';
	toSave.driver_id = getDriverByCode(toSave.driver_id).id;
	LIST.push( toSave );
	sortList()
}

export function updateBill(data) {
	let toSave = _.clone(data);
	let updatedBill = getBillById(toSave.id);

	toSave.vyezd_fakt = makeDate(toSave.vyezd_fakt) + ' ' + makeTime(toSave.vyezd_fakt);
	toSave.vozvr_fakt = makeDate(toSave.vozvr_fakt) + ' ' + makeTime(toSave.vozvr_fakt);

	_.each(toSave, (v,k ) => {
		updatedBill[k] = v;
	})

	updatedBill.status = false;

	sortList();

}

export function getBillById( id){
	let result;
	_.each(LIST, (bill) => {
		if (bill.id === id) {
			result = bill;
		}

	})

	return result;
}