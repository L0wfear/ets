import { getDrivers, getMasters } from '../scripts/stores/EmployeesStore.js';
import moment from 'moment';

const DRIVERS = getDrivers();
const MASTERS = getMasters();
let LIST = [];
let LAST_BILL_NUMBER = 0;

let getLastBillNumber = () => LAST_BILL_NUMBER+1;
let getRandomDriver = () => DRIVERS[Math.floor(Math.random() * (DRIVERS.length ))];
let getRandomMaster = () => MASTERS[Math.floor(Math.random() * (MASTERS.length))];


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
    bill.MASTER_ID = getRandomMaster().id;
    bill.STATUS = Math.floor(Math.random()*2) === 0 ? 'closed' : 'open';
    if (bill.STATUS === 'open' ) {
        bill.FACT_DEPARTURE_DATE = bill.FACT_ARRIVAL_DATE = "";
    }
    bill.PASSES_COUNT = Math.floor(Math.random() * 4)+1;
    bill.ROUTE_ID = Math.floor(Math.random()*3) + 1;
    LAST_BILL_NUMBER++;

    return bill;
}

for (let i = 0; i < 50; i++) {
    LIST.push( getBill());
}

console.log('waybills getnerated', LIST )

export default LIST;
