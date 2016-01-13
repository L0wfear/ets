import LIST from '../../mocks/waybills.js';
import {makeDate, makeTime} from '../utils/dates.js';
import {getDriverByCode} from './EmployeesStore.js';
import Rx from 'rx';

let billActions = {
	create: new Rx.Subject(),
	delete: new Rx.Subject(),
	update: new Rx.Subject()
}

// window.updateBillStore = function( newData) {
// 	DATA = newData;
// 	sortList();
// 	if (window.updateBillsJournal !== undefined ){
// 		//debugger;
// 		window.updateBillsJournal()
// 	}
// }

// todo move to Rx.JS
