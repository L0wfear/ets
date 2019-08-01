import {
  OLD_REPORT_SET_ODH_COVERAGE_REPORT,
  OLD_REPORT_SET_DT_COVERAGE_REPORT,
} from 'components/old/coverage_reports/redux-main/modules/old-report/old_report';

import {
  loadOdhCoverageReport,
  loadDtCoverageReport,
  exportOdhCoverageReport,
  exportDtCoverageReport,
  loadAnalytics,
} from 'components/old/coverage_reports/redux-main/modules/old-report/promise';

export const oldReportChangeOdhCoverageReport = (odhCoverageReport) => ({
  type: OLD_REPORT_SET_ODH_COVERAGE_REPORT,
  payload: {
    odhCoverageReport,
  },
});

export const oldReportChangeDtCoverageReport = (dtCoverageReport) => ({
  type: OLD_REPORT_SET_DT_COVERAGE_REPORT,
  payload: {
    dtCoverageReport,
  },
});

export const oldReportGetOdhCoverageReport = (date_start, date_end, { page, path }) => async (dispatch) => {
  const { payload: result } = await dispatch({
    type: 'none',
    payload: loadOdhCoverageReport(date_start, date_end),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  dispatch(oldReportChangeOdhCoverageReport(result.odhCoverageReport));
  global.NOTIFICATION_SYSTEM.notify('Отчет обновлен', 'info');

  return result;
};

export const oldReportGetDtCoverageReport = (date_start, date_end, { page, path }) => async (dispatch) => {
  const { payload: result }  = await dispatch({
    type: 'none',
    payload: loadDtCoverageReport(date_start, date_end),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  dispatch(oldReportChangeDtCoverageReport(result.dtCoverageReport));
  global.NOTIFICATION_SYSTEM.notify('Отчет обновлен', 'info');

  return result;
};

export const oldReportResetOdhCoverageReport = () => (dispatch) => (
  dispatch(oldReportChangeOdhCoverageReport([]))
);

export const oldReportResetDtCoverageReport = () => (dispatch) => (
  dispatch(oldReportChangeDtCoverageReport([]))
);

export const oldReportExportOdhCoverageReport = (date_start, date_end, { page, path }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: exportOdhCoverageReport(date_start, date_end),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};

export const oldReportExportDtCoverageReport = (date_start, date_end, { page, path }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: exportDtCoverageReport(date_start, date_end),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};

export const oldReportGetAnalytics = (data, { page, path }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: loadAnalytics(data),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
