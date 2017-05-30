import { Actions } from 'flummox';
import { createValidDateTime } from 'utils/dates';
import _ from 'lodash';
import {
  CoverageReportService,
  AnalyticsService,
  OdhCoverageReportService,
  DtCoverageReportService,
  CarFuncTypeUsageReportService,
  CarFuncTypeUsageDetailReportService,
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
