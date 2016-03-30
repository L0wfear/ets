import { Actions } from 'flummox';
import _ from 'lodash';
import { DailyCleaningReportsService } from 'api/Services';

export default class ReportsActions extends Actions {

  createDailyCleaningReport(data) {
    let payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);

    return DailyCleaningReportsService.create(payload);
  }

  getDailyCleaningReports() {
    return DailyCleaningReportsService.get();
  }

}
