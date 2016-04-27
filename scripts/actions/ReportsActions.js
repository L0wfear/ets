import { Actions } from 'flummox';
import _ from 'lodash';
import { DailyCleaningReportsService, WeeklyTechnicalOperationCompleteReportsService, FuelReportService } from 'api/Services';
import { createValidDateTime, createValidDate } from 'utils/dates';

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

  getFuelReport(data) {
    let payload = _.cloneDeep(data);
    payload.date_from = createValidDate(payload.date_from);
    payload.date_to = createValidDate(payload.date_to);
    return FuelReportService.get(payload, true, 'json');
  }

  getDailyCleaningReportById(id) {
    const payload = {
      id
    };

    return DailyCleaningReportsService.get(payload);
  }

  getWeeklyTechnicalOperationCompleteReports() {
    return WeeklyTechnicalOperationCompleteReportsService.get();
  }

  getWeeklyTechnicalOperationCompleteReportById(id) {
    const payload = {
      id
    };

    return WeeklyTechnicalOperationCompleteReportsService.get(payload);
  }

  createWeeklyTechnicalOperationCompleteReport(data) {
    let payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return WeeklyTechnicalOperationCompleteReportsService.post(payload, true, 'json');
  }

}
