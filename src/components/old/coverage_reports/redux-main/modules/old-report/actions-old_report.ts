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
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

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

export const oldReportGetOdhCoverageReport = (date_start, date_end, meta: LoadingMeta): EtsAction<ReturnType<typeof loadOdhCoverageReport>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    loadOdhCoverageReport(date_start, date_end),
    meta,
  );

  dispatch(oldReportChangeOdhCoverageReport(result.odhCoverageReport));
  global.NOTIFICATION_SYSTEM.notify('Отчет обновлен', 'info');

  return result;
};

export const oldReportGetDtCoverageReport = (date_start, date_end, meta: LoadingMeta): EtsAction<ReturnType<typeof loadDtCoverageReport>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    loadDtCoverageReport(date_start, date_end),
    meta,
  );

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

export const oldReportExportOdhCoverageReport = (date_start, date_end, meta: LoadingMeta): EtsAction<ReturnType<typeof exportOdhCoverageReport>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    exportOdhCoverageReport(date_start, date_end),
    meta,
  );

  return result;
};

export const oldReportExportDtCoverageReport = (date_start, date_end, meta: LoadingMeta): EtsAction<ReturnType<typeof exportDtCoverageReport>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    exportDtCoverageReport(date_start, date_end),
    meta,
  );

  return result;
};

export const oldReportGetAnalytics = (data, meta: LoadingMeta): EtsAction<ReturnType<typeof loadAnalytics>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    loadAnalytics(data),
    meta,
  );

  return result;
};
