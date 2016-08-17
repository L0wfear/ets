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
  CarFuncTypeUsageReportService
} from 'api/Services';
import config from '../config.js';

export default class ReportsActions extends Actions {

  // Статистика выхода техники за период

  createCarFuncTypeUsageReport(data) {
    let payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    //payload.car_type_id_list = payload.car_type_id_list);
    return CarFuncTypeUsageReportService.post(payload, true, 'json');
  }

  getCarFuncTypeUsageReports(data) {
    let payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return CarFuncTypeUsageReportService.get(payload);
  }

  getCarFuncTypeUsageReportById(id) {
    const payload = {
      id
    };

    return CarFuncTypeUsageReportService.get(payload);
  }

  // Cleaning - ETS

  createDailyCleaningReportETS(data) {
    let payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    //payload.car_type_id_list = payload.car_type_id_list);
    return DailyCleaningReportsServiceETS.post(payload, true, 'json');
  }

  getDailyCleaningReportsETS() {
    return DailyCleaningReportsServiceETS.get();
  }

  getDailyCleaningReportByIdETS(id) {
    const payload = {
      id
    };

    return DailyCleaningReportsServiceETS.get(payload);
  }

  // Cleaning - CAFAP

  createDailyCleaningReportCAFAP(data) {
    let payload = _.cloneDeep(data);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    //payload.car_type_id_list = payload.car_type_id_list);
    return DailyCleaningReportsServiceCAFAP.post(payload, true, 'json');
  }

  getDailyCleaningReportsCAFAP() {
    return DailyCleaningReportsServiceCAFAP.get();
  }

  getDailyCleaningReportByIdCAFAP(id) {
    const payload = {
      id
    };

    return DailyCleaningReportsServiceCAFAP.get(payload);
  }

  //

  getFuelReport(data) {
    let payload = _.cloneDeep(data);
    payload.date_from = createValidDate(payload.date_from);
    payload.date_to = createValidDate(payload.date_to);
    return FuelReportService.get(payload);
  }

  printFuelReport(data) {
    let payload = _.cloneDeep(data);
    payload.date_from = createValidDate(payload.date_from);
    payload.date_to = createValidDate(payload.date_to);
    return FuelReportService.post(payload, false, 'json', true);
  }

  getAnalytics(data) {
    let payload = _.cloneDeep(data);
    payload.date_from = createValidDateTime(payload.date_from);
    payload.date_to = createValidDateTime(payload.date_to);

    const token = JSON.parse(window.localStorage.getItem('ets-session'));
    let URL = `${config.backend}/analytical_reports/?token=${token}`;

    return fetch(URL, {
      method: 'post',
      body: JSON.stringify(payload)
    }).then((r) => r.blob());
  }

  getCoverageReport(state) {
    let payload = _.cloneDeep(state);
    delete payload.companyStructureList;
    delete payload.coverageReport;
    if (!payload.structure_id) payload.structure_id = null;
    return CoverageReportService.get(payload);
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

  getOdhCoverageReport() {
    return OdhCoverageReportService.get();
  }

}
