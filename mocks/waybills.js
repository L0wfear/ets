import { getDrivers, getMasters } from '../scripts/stores/EmployeesStore.js';
import moment from 'moment';
import {getCars} from './krylatskoe_cars.js';

const DRIVERS = getDrivers();
const MASTERS = getMasters();

let LIST = [];
let CARS = []
let LAST_BILL_NUMBER = 0;

let getLastBillNumber = () => LAST_BILL_NUMBER+1;
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


function getBill () {
    let bill = _.clone(template);

    let new_id = getLastBillNumber();
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
    LAST_BILL_NUMBER++;

    return bill;
}


export function generateBills() {
  return getCars().then((cars)=>{
    CARS = cars;

    for (let i = 0; i < 50; i++) {
      LIST.push( getBill());
    }

    // epic shiiit
    console.log('some waybills generated', LIST )
    setTimeout(function() {
        //debugger;
        window.updateBillStore(LIST)
    }, 800)
  })
}

export default LIST;
