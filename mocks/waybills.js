import { getDrivers, getMasters } from '../scripts/stores/EmployeesStore.js';

const DRIVERS = getDrivers();
const MASTERS = getMasters();
let LIST = [];
let LAST_BILL_NUMBER = 0;

let getLastBillNumber = () => LAST_BILL_NUMBER+1;
let getRandomDriver = () => DRIVERS[Math.floor(Math.random() * (DRIVERS.length ))];
let getRandomMaster = () => MASTERS[Math.floor(Math.random() * (MASTERS.length))];


let template = {
                    id: 0,
                    status: true,
                    number: "",
                    creation_date: '01-08-1989',
                    master_id: 34,
                    vyezd_plan: '01-08-1990 20:04',
                    vyezd_fakt: '01-08-1990 21:00',
                    vozvr_plan: '02-08-1990 8:07',
                    vozvr_fakt: '26-05-2030 7:00',
                    driver_id: 2,
                    auto: 'КАМАЗ',
                    route_id: 1,
                    ezdok: '3',
                    nachalo: 10,
                    konez: 2500
                };  


function getBill () {
    let bill = _.clone(template);

    let new_id = getLastBillNumber();
    bill.id = bill.number = new_id;
    bill.driver_id = getRandomDriver().id;
    bill.master_id = getRandomMaster().id;
    bill.status = !!Math.floor(Math.random()*2);
    if ( bill.status ) {
        bill.vozvr_fakt = bill.vyezd_fakt = "";
    }
    bill.ezdok = Math.floor(Math.random() * 4)+1;
    bill.route_id = Math.floor(Math.random()*3) + 1;
    LAST_BILL_NUMBER++;

    return bill;
}

for (let i = 0; i < 50; i++) {
    LIST.push( getBill());
}

console.log('waybills getnerated', LIST )

export default LIST;
