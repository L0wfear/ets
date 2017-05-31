import { Actions } from 'flummox';
import { createValidDateTime } from 'utils/dates';
import _ from 'lodash';
import {
  CoverageReportService,
  AnalyticsService,
  OdhCoverageReportService,
  DtCoverageReportService,
  TrackEventsReportService,
} from 'api/Services';

export default class ReportsActions extends Actions {
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
