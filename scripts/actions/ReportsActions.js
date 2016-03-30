import { Actions } from 'flummox';
import _ from 'lodash';
import { DailyCleaningReportsService } from 'api/Services';
import { createValidDateTime } from 'utils/dates';

export default class ReportsActions extends Actions {

  createDailyCleaningReport(data) {
    let payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    //payload.car_type_id_list = payload.car_type_id_list);
    return DailyCleaningReportsService.post(payload, true, 'json');
  }

  getDailyCleaningReports() {
    return DailyCleaningReportsService.get();
  }

  getDailyCleaningReportById(id) {
    const payload = {
      id
    };

    return DailyCleaningReportsService.get(payload);
  }

}
