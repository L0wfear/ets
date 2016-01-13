import { getDrivers, getDriverByCode, getMasters } from '../scripts/stores/EmployeesStore.js';
import {makeDate, makeTime} from '../scripts/utils/dates.js';
import moment from 'moment';
import { getCars } from './krylatskoe_cars.js';

const DRIVERS = getDrivers();
const MASTERS = getMasters();

let LIST = [];
let CARS = []
//let LAST_BILL_NUMBER = 0;

//let getLastBillNumber = () => LAST_BILL_NUMBER+1;
let getRandomDriver = () => DRIVERS[Math.floor(Math.random() * (DRIVERS.length ))];
let getRandomMaster = () => MASTERS[Math.floor(Math.random() * (MASTERS.length))];
let getRandomCar = () => CARS[Math.floor(Math.random() * (CARS.length))]


let template = {
            ID: 0,
            STATUS: 'open',
            NUMBER: 0,
            DATE_CREATE: '2015-12-18 9:00',
            RESPONSIBLE_PERSON_ID: "",
            PLAN_DEPARTURE_DATE: '2015-12-18 9:00',
            FACT_DEPARTURE_DATE: '2015-12-18 9:00',
            PLAN_ARRIVAL_DATE: '2015-12-19 9:00',
            FACT_ARRIVAL_DATE: '2015-12-19 9:00',
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


function getBill (number) {
    let bill = _.clone(template);

    let new_id = number + 1;
    bill.ID = bill.NUMBER = new_id;
    bill.DRIVER_ID = getRandomDriver().id;
    bill.RESPONSIBLE_PERSON_ID = getRandomMaster().id;
    bill.STATUS = Math.floor(Math.random()*2) === 0 ? 'closed' : 'open';
    bill.ODOMETR_START = Math.floor(Math.random()*1000);
    bill.FUEL_START = bill.FUEL_TO_GIVE = Math.floor(Math.random()*100);
    bill.MOTOHOURS_START = Math.floor(Math.random()*3000);
    bill.MOTOHOURS_EQUIP_START = Math.floor(Math.random()*2000);
    bill.CAR_ID = getRandomCar().id;
    if (bill.STATUS === 'open' ) {
        bill.FACT_DEPARTURE_DATE = bill.FACT_ARRIVAL_DATE = "";
    }
    bill.PASSES_COUNT = Math.floor(Math.random() * 4)+1;
    bill.ROUTE_ID = Math.floor(Math.random()*3) + 1;
    //LAST_BILL_NUMBER++;

    return bill;
}


export function generateBills() {
  //let waybillsList = [];


  return getCars().then((cars)=>{
    CARS = cars;

    if (LIST.length > 0) {
      return LIST;
    }

    for (let i = 0; i < 50; i++) {
      //waybillsList.push(getBill(i));
      LIST.push(getBill(i));
    }

    // epic shiiit
    // console.log('some waybills generated', LIST )
    // setTimeout(function() {
    //     //debugger;
    //     window.updateBillStore(LIST)
    // }, 800)

    return LIST;
  });
}

export function removeBill(id) {
  const index = _.findIndex(LIST, b => b.ID === id);
  if (index >= 0) {
    LIST.splice(index, 1);
  }
  return new Promise( (res, rej) => {
    setTimeout( () => {
      res(LIST);
    }, 500);
  });
}

// export function updateBill(waybill) {
//   const index = _.findIndex(LIST, b => b.ID === waybill.ID);
//   if (index >= 0) {
//     LIST[index] = _.clone(waybill);
//   }
//   return new Promise( (res, rej) => {
//     setTimeout( () => {
//       res(LIST);
//     }, 500);
//   });
// }

export function updateBill(data, correctionFlag = false) {
  console.info('UPDATING BILL # ', data.ID);
	let toSave = _.clone(data);
	let updatedBill = _.find(LIST, b => b.ID === toSave.ID);

  return new Promise( (res, rej) => {

    if (!updatedBill) rej();

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

    setTimeout( () => {
      res(LIST);
    }, 500);
  });

}

export function createBill(data) {
	let toSave = _.clone(data);
	toSave.STATUS = 'open';
	toSave.PLAN_DEPARTURE_DATE = makeDate(toSave.PLAN_DEPARTURE_DATE) + ' ' + makeTime(toSave.PLAN_DEPARTURE_DATE);
	toSave.PLAN_ARRIVAL_DATE = makeDate(toSave.PLAN_ARRIVAL_DATE) + ' ' + makeTime(toSave.PLAN_ARRIVAL_DATE);
	toSave.FACT_DEPARTURE_DATE = toSave.FACT_ARRIVAL_DATE = '';
	toSave.DRIVER_ID = getDriverByCode(toSave.DRIVER_ID).id;
	LIST.push(toSave);

  return new Promise( (res, rej) => {
    setTimeout( () => {
      res(LIST);
    }, 500);
  });
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
		    ID: LIST.length + 1,
		    STATUS: null,
		    NUMBER: LIST.length + 1,
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

export default LIST;
