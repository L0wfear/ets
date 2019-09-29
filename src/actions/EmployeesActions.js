import { Actions } from 'flummox';
import { WaybillDriverService } from 'api/Services';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';

export default class EmployeesActions extends Actions {
  getWaybillDrivers({ type = 'before', date_from, date_to, ...restPayload }) {
    const opts = {
      ...restPayload,
      date_from: createValidDateTime(date_from),
      date_to: createValidDateTime(date_to),
      type,
    };

    return WaybillDriverService.get(opts);
  }
}
