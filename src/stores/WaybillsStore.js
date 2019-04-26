import { Store } from 'flummox';
import {
  getTomorrow9am,
  getDateWithMoscowTz,
  createValidDateTime,
} from 'utils/dates';

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
    this.setState({
      waybillsList: waybills.result,
      waybillstotalCount: waybills.total_count,
    });
  }
}

export function getDefaultBill({ company_id = null }) {
  // TODO change fuel type to default from app config
  return {
    status: null,
    plan_departure_date: createValidDateTime(getDateWithMoscowTz()),
    plan_arrival_date: createValidDateTime(getTomorrow9am()),
    driver_id: null,
    car_id: '',
    fuel_type: 'DT',
    fuel_start: '',
    equipment_fuel: null,
    equipment_fuel_type: 'DT',
    odometr_start: null,
    motohours_start: null,
    mission_id_list: [],
    car_refill: [],
    equipment_refill: [],
    company_id,
    is_one_fuel_tank: true,
  };
}
