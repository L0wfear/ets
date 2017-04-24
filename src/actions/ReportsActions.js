import { Actions } from 'flummox';
import { createValidDateTime, createValidDate } from 'utils/dates';
import _ from 'lodash';
import {
  DailyCleaningReportsServiceETS,
  DailyCleaningReportsServiceCAFAP,
  WeeklyTechnicalOperationCompleteReportsService,
  FuelReportService,
  CoverageReportService,
  AnalyticsService,
  OdhCoverageReportService,
  DtCoverageReportService,
  CarFuncTypeUsageReportService,
  CarFuncTypeUsageDetailReportService,
  BrigadeAndEmployeeEfficiencyReport1LService,
  BrigadeEfficiencyReport2LService,
  EmployeeEfficiencyReportService,
  TrackEventsReportService,
} from 'api/Services';

export default class ReportsActions extends Actions {

  // Статистика выхода техники за период

  createCarFuncTypeUsageReport(data) {
    const payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    // payload.car_type_id_list = payload.car_type_id_list);
    return CarFuncTypeUsageReportService.post(payload, true, 'json');
  }

  getCarFuncTypeUsageReports(data) {
    const payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return CarFuncTypeUsageReportService.get(payload);
  }

  getCarFuncTypeUsageDetailReport(data) {
    return CarFuncTypeUsageDetailReportService.get(data);
  }

  getCarFuncTypeUsageReportById(id) {
    const payload = {
      id,
    };

    return CarFuncTypeUsageReportService.get(payload);
  }

  // Cleaning - ETS

  createDailyCleaningReportETS(data) {
    const payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    // payload.car_type_id_list = payload.car_type_id_list);
    return DailyCleaningReportsServiceETS.post(payload, true, 'json');
  }

  getDailyCleaningReportsETS() {
    return DailyCleaningReportsServiceETS.get();
  }

  getDailyCleaningReportByIdETS(id) {
    return DailyCleaningReportsServiceETS.path(id).get();
  }

  // Cleaning - CAFAP

  createDailyCleaningReportCAFAP(data) {
    const payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    // payload.car_type_id_list = payload.car_type_id_list);
    return DailyCleaningReportsServiceCAFAP.post(payload, true, 'json');
  }

  getDailyCleaningReportsCAFAP() {
    return DailyCleaningReportsServiceCAFAP.get();
  }

  getDailyCleaningReportByIdCAFAP(id) {
    return DailyCleaningReportsServiceCAFAP.path(id).get();
  }

  //

  getFuelReport(data) {
    const payload = _.cloneDeep(data);
    payload.date_from = createValidDate(payload.date_from);
    payload.date_to = createValidDate(payload.date_to);
    return FuelReportService.get(payload);
  }

  getAnalytics(data) {
    const payload = _.cloneDeep(data);
    payload.date_from = createValidDateTime(payload.date_from);
    payload.date_to = createValidDateTime(payload.date_to);

    return AnalyticsService.postBlob(payload);
  }

  getCoverageReport(state) {
    const payload = _.cloneDeep(state);
    delete payload.companyStructureList;
    delete payload.coverageReport;
    if (!payload.structure_id) payload.structure_id = null;
    return CoverageReportService.get(payload);
  }

  getWeeklyTechnicalOperationCompleteReports() {
    return WeeklyTechnicalOperationCompleteReportsService.get();
  }

  getWeeklyTechnicalOperationCompleteReportById(id) {
    return WeeklyTechnicalOperationCompleteReportsService.path(id).get();
  }

  createWeeklyTechnicalOperationCompleteReport(data) {
    const payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return WeeklyTechnicalOperationCompleteReportsService.post(payload, true, 'json');
  }

  getOdhCoverageReport(date_start, date_end) {
    const payload = {};
    if (date_start) {
      payload.date_start = createValidDateTime(date_start);
    }
    if (date_end) {
      payload.date_end = createValidDateTime(date_end);
    }

    return OdhCoverageReportService.get(payload);
  }

  exportOdhCoverageReport(date_start, date_end, format) {
    const payload = {};
    if (date_start) {
      payload.date_start = createValidDateTime(date_start);
    }
    if (date_end) {
      payload.date_end = createValidDateTime(date_end);
    }
    if (format) {
      payload.format = format;
    }
    return OdhCoverageReportService.getBlob(payload);
  }

  getDtCoverageReport(date_start, date_end) {
    const payload = {};
    if (date_start) {
      payload.date_start = createValidDateTime(date_start);
    }
    if (date_end) {
      payload.date_end = createValidDateTime(date_end);
    }

    return DtCoverageReportService.get(payload);
  }

  exportDtCoverageReport(date_start, date_end, format) {
    const payload = {};
    if (date_start) {
      payload.date_start = createValidDateTime(date_start);
    }
    if (date_end) {
      payload.date_end = createValidDateTime(date_end);
    }
    if (format) {
      payload.format = format;
    }
    return DtCoverageReportService.getBlob(payload);
  }

  getBrigadeAndEmployeeEfficiencyReport1L(data) {
    const payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return BrigadeAndEmployeeEfficiencyReport1LService.get(payload);
  }

  getBrigadeEfficiencyReport2L(data) {
    const payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return BrigadeEfficiencyReport2LService.get(payload);
  }

  getEmployeeEfficiencyReports(data) {
    const payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return EmployeeEfficiencyReportService.get(payload);
  }

  getTrackEventsReports(data) {
    const payload = {};
    if (data.date_start) {
      payload.date_start = createValidDateTime(data.date_start);
    }
    if (data.date_end) {
      payload.date_end = createValidDateTime(data.date_end);
    }
    return TrackEventsReportService.path('aggregate').get(payload);
  }

  getTrackEventsReport(payload) {
    return TrackEventsReportService.get(payload);
  }

  clearStateList(listName) {
    return listName;
  }
}
