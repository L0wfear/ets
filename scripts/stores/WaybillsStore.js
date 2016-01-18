import { Store } from 'flummox';
import _ from 'lodash';
import {makeDate, makeTime} from '../utils/dates.js';
import moment from 'moment';

class WaybillsStore extends Store {

  constructor(flux) {
    super();

    const waybillsActions = flux.getActions('waybills');
    this.register(waybillsActions.getWaybills, this.handleGetWaybills);
    this.register(waybillsActions.removeWaybill, this.handleRemoveWaybill);
    this.register(waybillsActions.updateWaybill, this.handleUpdateWaybill);
    this.register(waybillsActions.createWaybill, this.handleCreateWaybill);

    this.state = {
      waybillsList: [],
    };

  }

  handleGetWaybills(waybills) {
    this.setState({waybillsList: waybills.result});
  }

  //todo: определить объединять или нет
  handleRemoveWaybill(waybills) {
    this.setState({waybillsList: waybills.result});
  }

  handleUpdateWaybill(waybills) {
    this.setState({waybillsList: waybills.result});
  }

  handleCreateWaybill(waybills) {
    console.info('CREATED WAYBILL');
    this.setState({waybillsList: waybills.result});
  }

}

export default WaybillsStore;


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
		    //ID: currentBillCount + 1,
		    status: null,
		    //number: currentBillCount + 1,
		    //date_create: makeDate(now) + ' ' + makeTime(now),
		    responsible_person_id: "",
		    plan_departure_date: vyezd_plan,
		    fact_departure_date: vyezd_plan,
		    plan_arrival_date: vozvr_plan,
		    fact_arrival_date: vozvr_plan,
		    driver_id: null,
		    car_id: "",
		    //ROUTE_ID: "",
		    fuel_type_id: 1,
		    fuel_start: "",
		    fuel_to_give: "",
		    fuel_given: "",
		    fuel_end: "",
		    //PASSES_COUNT: "",
				odometr_start: null,
				odometr_end: "",
				motohours_start: null,
				motohours_end: "",
				motohours_equip_start: null,
				motohours_equip_end: "",
		}
}
