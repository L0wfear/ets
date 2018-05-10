import { Actions } from 'flummox';
import { createValidDateTime } from 'utils/dates';
import { cloneDeep } from 'lodash';
import {
  CoverageReportService,
  AnalyticsService,
  OdhCoverageReportService,
  DtCoverageReportService,
} from 'api/Services';

export default class ReportsActions extends Actions {
  getAnalytics(data) {
    const payload = cloneDeep(data);
    payload.date_from = createValidDateTime(payload.date_from);
    payload.date_to = createValidDateTime(payload.date_to);

    return AnalyticsService.postBlob(payload);
  }

  getCoverageReport(state) {
    const payload = cloneDeep(state);
    delete payload.companyStructureList;
    delete payload.coverageReport;
    if (!payload.structure_id) payload.structure_id = null;
    return CoverageReportService.get(payload);
  }

  getOdhCoverageReport(date_start, date_end, query) {
    const payload = { ...query };
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

  getDtCoverageReport(date_start, date_end, query) {
    const payload = { ...query };
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

  clearStateList(listName) {
    return listName;
  }
}
