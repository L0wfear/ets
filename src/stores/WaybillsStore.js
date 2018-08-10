import { Store } from 'flummox';
import { getTomorrow9am } from 'utils/dates';

export default class WaybillsStore extends Store {

  constructor(flux) {
    super();

    const waybillsActions = flux.getActions('waybills');
    this.register(waybillsActions.getWaybills, this.handleGetWaybills);

    this.state = {
      waybillsList: [],
      waybillstotalCount: 0,
    };
  }

  handleGetWaybills(waybills) {
    this.setState({ waybillsList: waybills.result, waybillstotalCount: waybills.total_count });
  }

}

export function getDefaultBill() {
  // TODO change fuel type to default from app config
  return {
    status: null,
    plan_departure_date: new Date(),
    plan_arrival_date: getTomorrow9am(),
    driver_id: null,
    car_id: '',
    fuel_type: 'DT',
    fuel_start: '',
    equipment_fuel: false,
    equipment_fuel_type: 'DT',
    odometr_start: null,
    motohours_start: null,
    mission_id_list: [],
    company_id: JSON.parse(localStorage.getItem(global.CURRENT_USER2)).company_id,
  };
}
