import {
  AnalyticsService,
  OdhCoverageReportService,
  DtCoverageReportService,
} from 'api/Services';

import { createValidDateTime } from 'utils/dates';
import { get, cloneDeep } from 'lodash';

export const loadOdhCoverageReport = (date_start, date_end) => {
  const payload: any = {};

  if (date_start) {
    payload.date_start = createValidDateTime(date_start);
  }
  if (date_end) {
    payload.date_end = createValidDateTime(date_end);
  }

  return OdhCoverageReportService.get(payload)
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        result: {
          rows: [],
          mets: null,
        },
      };
    })
    .then((ans) => ({
      odhCoverageReport: get(ans, ['result', 'rows'], []),
      meta: get(ans, ['result', 'meta'], null),
    }));
};

export const loadDtCoverageReport = (date_start, date_end) => {
  const payload: any = {};

  if (date_start) {
    payload.date_start = createValidDateTime(date_start);
  }
  if (date_end) {
    payload.date_end = createValidDateTime(date_end);
  }

  return DtCoverageReportService.get(payload)
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        result: {
          rows: [],
          mets: null,
        },
      };
    })
    .then((ans) => ({
      dtCoverageReport: get(ans, ['result', 'rows'], []),
      meta: get(ans, ['result', 'meta'], null),
    }));
};

export const exportOdhCoverageReport = (date_start, date_end) => {
  const payload: any = {
    format: 'xls',
  };

  if (date_start) {
    payload.date_start = createValidDateTime(date_start);
  }
  if (date_end) {
    payload.date_end = createValidDateTime(date_end);
  }

  return OdhCoverageReportService.getBlob(payload)
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        blob: null,
      };
    });
};

export const exportDtCoverageReport = (date_start, date_end) => {
  const payload: any = {
    format: 'xls',
  };

  if (date_start) {
    payload.date_start = createValidDateTime(date_start);
  }
  if (date_end) {
    payload.date_end = createValidDateTime(date_end);
  }

  return DtCoverageReportService.getBlob(payload)
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        blob: null,
      };
    });
};

export const loadAnalytics = (data) => {
  const payload = cloneDeep(data);
  payload.date_from = createValidDateTime(payload.date_from);
  payload.date_to = createValidDateTime(payload.date_to);

  return AnalyticsService.postBlob(payload)
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        blob: null,
        fileName: '',
      };
    });
};
