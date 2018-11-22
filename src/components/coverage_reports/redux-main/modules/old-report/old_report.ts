import { createPath } from 'redux-main/redux-utils';
import { IStateOldReport } from 'components/coverage_reports/redux-main/modules/old-report/@types/old_report';

const OLD_REPORT = createPath('OLD_REPORT');

export const OLD_REPORT_SET_ODH_COVERAGE_REPORT = OLD_REPORT`SET_ODH_COVERAGE_REPORT`;
export const OLD_REPORT_SET_DT_COVERAGE_REPORT = OLD_REPORT`SET_DT_COVERAGE_REPORT`;

const initialState: IStateOldReport = {
  odhCoverageReport: [],
  dtCoverageReport: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case OLD_REPORT_SET_ODH_COVERAGE_REPORT: {
      return {
        ...state,
        odhCoverageReport: payload.odhCoverageReport,
      };
    }
    case OLD_REPORT_SET_DT_COVERAGE_REPORT: {
      return {
        ...state,
        dtCoverageReport: payload.dtCoverageReport,
      };
    }
    default: {
      return state;
    }
  }
};
