import { Store } from 'flummox';
import _ from 'lodash';
import { getToday9am, getTomorrow9am} from 'utils/dates';

class WaybillsStore extends Store {

  constructor(flux) {
    super();

    const waybillsActions = flux.getActions('waybills');
    this.register(waybillsActions.getWaybills, this.handleGetWaybills);
    this.register(waybillsActions.delete, this.handleGetWaybills);
    this.register(waybillsActions.update, this.handleGetWaybills);
    this.register(waybillsActions.create, this.handleGetWaybills);

    this.state = {
      waybillsList: [],
    };

  }

  handleGetWaybills(waybills) {
    this.setState({waybillsList: waybills.result});
  }

}

export default WaybillsStore;


export function getDefaultBill() {
	return {
    status: null,
    //responsible_person_id: null,
    plan_departure_date: getToday9am(),
    //fact_departure_date: vyezd_plan,
    plan_arrival_date: getTomorrow9am(),
    // fact_arrival_date: vozvr_plan,
    driver_id: null,
    car_id: "",
    fuel_type_id: 6,
    fuel_start: "",
    equipment_fuel: false,
    //fuel_to_give: null,
    //fuel_given: "",
    //fuel_end: "",
		odometr_start: null,
		//odometr_end: "",
		motohours_start: null,
		//motohours_end: "",
		//motohours_equip_start: null,
		//motohours_equip_end: "",
    mission_id_list: [],
    company_id: JSON.parse(localStorage.getItem('current_user')).company_id,
	}
}
