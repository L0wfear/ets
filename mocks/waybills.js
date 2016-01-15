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
            number: 0,
            date_create: '2015-12-18 9:00',
            responsible_person_id: "",
            plan_departure_date: '2015-12-18 9:00',
            fact_departure_date: '2015-12-18 9:00',
            plan_arrival_date: '2015-12-19 9:00',
            fact_arrival_date: '2015-12-19 9:00',
            driver_id: null,
            car_id: "",
            ROUTE_ID: "",
            FUEL_TYPE_ID: 1,
            FUEL_START: "",
            FUEL_TO_GIVE: "",
            fuel_given: "",
            fuel_end: "",
            PASSES_COUNT: "",
            ODOMETR_START: "",
            odometr_end: "",
            MOTOHOURS_START: "",
            motohours_end: "",
            MOTOHOURS_EQUIP_START: "",
            MOTOHOURS_EQUIP_END: ""
        }


function getBill (number) {
    let bill = _.clone(template);

    let new_id = number + 1;
    bill.ID = bill.number = new_id;
    bill.driver_id = getRandomDriver().id;
    bill.responsible_person_id = getRandomMaster().id;
    bill.STATUS = Math.floor(Math.random()*2) === 0 ? 'closed' : 'open';
    bill.ODOMETR_START = Math.floor(Math.random()*1000);
    bill.FUEL_START = bill.FUEL_TO_GIVE = Math.floor(Math.random()*100);
    bill.MOTOHOURS_START = Math.floor(Math.random()*3000);
    bill.MOTOHOURS_EQUIP_START = Math.floor(Math.random()*2000);
    bill.car_id = getRandomCar().id;
    if (bill.STATUS === 'open' ) {
        bill.fact_departure_date = bill.fact_arrival_date = "";
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

    toSave.plan_departure_date = !!toSave.plan_departure_date.length ? toSave.plan_departure_date : makeDate(toSave.plan_departure_date) + ' ' + makeTime(toSave.plan_departure_date);
  	toSave.plan_arrival_date = !!toSave.plan_arrival_date.length ? toSave.plan_arrival_date : makeDate(toSave.plan_arrival_date) + ' ' + makeTime(toSave.plan_arrival_date);

  	if (!correctionFlag) {
  	 	toSave.fact_departure_date = makeDate(toSave.fact_departure_date) + ' ' + makeTime(toSave.fact_departure_date);
  		toSave.fact_arrival_date = makeDate(toSave.fact_arrival_date) + ' ' + makeTime(toSave.fact_arrival_date);
  	} else {
  		toSave.driver_id = getDriverByCode(toSave.driver_id).id;
  		toSave.fact_departure_date = toSave.fact_arrival_date = '';
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
	toSave.plan_departure_date = makeDate(toSave.plan_departure_date) + ' ' + makeTime(toSave.plan_departure_date);
	toSave.plan_arrival_date = makeDate(toSave.plan_arrival_date) + ' ' + makeTime(toSave.plan_arrival_date);
	toSave.fact_departure_date = toSave.fact_arrival_date = '';
	toSave.driver_id = getDriverByCode(toSave.driver_id).id;
	LIST.push(toSave);

  return new Promise( (res, rej) => {
    setTimeout( () => {
      res(LIST);
    }, 500);
  });
}

export function getDefaultBill(currentBillCount = 0) {

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
		    ID: currentBillCount + 1,
		    STATUS: null,
		    number: currentBillCount + 1,
		    date_create: makeDate(now) + ' ' + makeTime(now),
		    responsible_person_id: "",
		    plan_departure_date: vyezd_plan,
		    fact_departure_date: vyezd_plan,
		    plan_arrival_date: vozvr_plan,
		    fact_arrival_date: vozvr_plan,
		    driver_id: null,
		    car_id: "",
		    //ROUTE_ID: "",
		    FUEL_TYPE_ID: 1,
		    FUEL_START: "",
		    FUEL_TO_GIVE: "",
		    fuel_given: "",
		    fuel_end: "",
		    //PASSES_COUNT: "",
				ODOMETR_START: "",
				odometr_end: "",
				MOTOHOURS_START: "",
				motohours_end: "",
				MOTOHOURS_EQUIP_START: "",
				MOTOHOURS_EQUIP_END: ""
		}
}

export default LIST;
