import LIST from '../../mocks/waybills.js';
import {makeDate, makeTime} from '../utils/dates.js';
import {getDriverByCode} from './EmployeesStore.js';

let DATA = _.clone(LIST);

window.updateBillStore = function( newData) {
	DATA = newData;
	sortList();
	if (window.updateBillsJournal !== undefined ){
		debugger;
		window.updateBillsJournal()
	}
}

// todo move to Rx.JS

sortList()

export function getList() {

	return DATA.filter((bill) => bill.STATUS !== 'deleted')

}

export function deleteBill(id) {
	let bill = getBillById(id);
	bill.STATUS = 'deleted';
}


export function getDefaultBill() {

		let now = new Date();
		let vyezd_plan = new Date( 
	    now.getFullYear(),
	    now.getMonth(),
	    now.getDate(),
	    9,
	    0
    );
		let vozvr_plan = new Date( 
	    now.getFullYear(),
	    now.getMonth(),
	    now.getDate() + 1,
	    9,
	    0
    )
		return {
		    ID: getLastNumber() + 1,
		    STATUS: null,
		    NUMBER: getLastNumber() + 1,
		    DATE_CREATE: makeDate(now) + ' ' + makeTime(now), 
		    RESPONSIBLE_PERSON_ID: "",
		    PLAN_DEPARTURE_DATE: vyezd_plan,
		    FACT_DEPARTURE_DATE: vyezd_plan,
		    PLAN_ARRIVAL_DATE: vozvr_plan,
		    FACT_ARRIVAL_DATE: vozvr_plan,
		    DRIVER_ID: null,
		    CAR_ID: "",
		    ROUTE_ID: "",
		    FUEL_TYPE_ID: 1,
		    FUEL_START: "",
		    FUEL_TO_GIVE: "",
		    FUEL_GIVEN: "",
		    FUEL_END: "",
		    PASSES_COUNT: "",
				ODOMETR_START: "",
				ODOMETR_END: "",
				MOTOHOURS_START: "",
				MOTOHOURS_END: "",
				MOTOHOURS_EQUIP_START: "",
				MOTOHOURS_EQUIP_END: ""
		}
}


export function getLastBillByCarId( carId ) {

}


export function getLastNumber() {
	let result = 0;

	return DATA.length + 1;

	if (DATA.length === 0 ) return result;

	_.each(DATA, (v) => {
		if ( v.id > result ) {
			result = v.id
		}
	})

	return result;
}

function sortList() {
	DATA = DATA.sort((a, b) => b.ID - a.ID).filter((bill) => bill.STATUS !== 'deleted')
}

export function createBill(data) {
	let toSave = _.clone(data);
	toSave.STATUS = 'open';
	toSave.PLAN_DEPARTURE_DATE = makeDate(toSave.PLAN_DEPARTURE_DATE) + ' ' + makeTime(toSave.PLAN_DEPARTURE_DATE);
	toSave.PLAN_ARRIVAL_DATE = makeDate(toSave.PLAN_ARRIVAL_DATE) + ' ' + makeTime(toSave.PLAN_ARRIVAL_DATE);
	toSave.FACT_DEPARTURE_DATE = toSave.FACT_ARRIVAL_DATE = '';
	toSave.DRIVER_ID = getDriverByCode(toSave.DRIVER_ID).id;
	DATA.push( toSave );
	sortList()
}

export function updateBill(data, correctionFlag = false) {
	let toSave = _.clone(data);
	let updatedBill = getBillById(toSave.ID);


	toSave.PLAN_DEPARTURE_DATE = !!toSave.PLAN_DEPARTURE_DATE.length ? toSave.PLAN_DEPARTURE_DATE : makeDate(toSave.PLAN_DEPARTURE_DATE) + ' ' + makeTime(toSave.PLAN_DEPARTURE_DATE);
	toSave.PLAN_ARRIVAL_DATE = !!toSave.PLAN_ARRIVAL_DATE.length ? toSave.PLAN_ARRIVAL_DATE : makeDate(toSave.PLAN_ARRIVAL_DATE) + ' ' + makeTime(toSave.PLAN_ARRIVAL_DATE);

	if (!correctionFlag) {
	 	toSave.FACT_DEPARTURE_DATE = makeDate(toSave.FACT_DEPARTURE_DATE) + ' ' + makeTime(toSave.FACT_DEPARTURE_DATE);
		toSave.FACT_ARRIVAL_DATE = makeDate(toSave.FACT_ARRIVAL_DATE) + ' ' + makeTime(toSave.FACT_ARRIVAL_DATE);
	} else {
		toSave.DRIVER_ID = getDriverByCode(toSave.DRIVER_ID).id;
		toSave.FACT_DEPARTURE_DATE = toSave.FACT_ARRIVAL_DATE = '';
	}

	_.each(toSave, (v,k ) => {
		updatedBill[k] = v;
	})

	//updatedBill.STATUS = false;

	sortList();

}

export function getBillById( id){
	let result;
	_.each(DATA, (bill) => {
		if (bill.ID === id) {
			result = bill;
		}

	})

	return result;
}