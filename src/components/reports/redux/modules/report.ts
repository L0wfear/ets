import { FetchingStatusReducerFactory } from 'utils/redux-utils';
import { reports } from 'api/Services';
import { hasWarningNotification } from 'utils/notifications';
import * as ReduxTypes from './@types/report.h';

type IState = ReduxTypes.IReportStateProps;

const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
const SET_SUMMARY_TABLE_DATA = 'SET_SUMMARY_TABLE_DATA';
const GET_REPORT_DATA = 'GET_REPORT_DATA';
const GET_REPORT_DATA_START = 'GET_REPORT_DATA_START';
const GET_REPORT_DATA_DONE = 'GET_REPORT_DATA_DONE';
const GET_REPORT_DATA_ERROR = 'GET_REPORT_DATA_ERROR';
const GET_TABLE_METAINFO = 'GET_TABLE_METAINFO';
const GET_REPORT_META_START = 'GET_REPORT_META_START';
const GET_REPORT_META_DONE = 'GET_REPORT_META_DONE';
const GET_REPORT_META_ERROR = 'GET_REPORT_META_ERROR';
const metaFetchingStatusReducer = FetchingStatusReducerFactory('reportMeta');
const dataFetchingStatusReducer = FetchingStatusReducerFactory('reportData');


const initialState: IState = {
  list: [],
  meta: {
    levels: {
      current: {},
    },
  },
  tableMetaInfo: {
    fields: [],
  },

  prevList: [],
  prevMeta: {
    levels: {
      current: {},
    },
  },
  prevTableMetaInfo: {
    fields: [],
  },

  summaryList: [],
  summaryMeta: {},
  summaryTableMetaInfo: [],
  reportMetaFetching: false,
  reportDataFetching: false,
};

export const getTableMetaInfo: ReduxTypes.IGetTableMetaInfo = serviceName => dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      const metaOpts = {
        meta: 1,
      };

      dispatch({ type: GET_REPORT_META_START });
      const payload = await reports[serviceName].get(metaOpts);
      dispatch({ type: GET_REPORT_META_DONE });

      dispatch({
        type: GET_TABLE_METAINFO,
        payload,
      });
      resolve(payload);
    } catch (error) {
      dispatch({ type: GET_REPORT_META_ERROR, error });
      reject(error);
    }
  });

const getTableMetaInfoReducer = (state: IState, { payload }) => ({
  ...state,
  tableMetaInfo: {
    ...payload,
  },
});


export const getReportData: ReduxTypes.IGetReportData = (serviceName, getOpts: any = {}, reportType = '') => dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch({ type: GET_REPORT_DATA_START });
      const payload = { ...getOpts };

      if (payload.filter) {
        payload.filter = JSON.stringify(Object.entries(JSON.parse(payload.filter)).reduce((newObj, [key, value]) => ({
          ...newObj,
          [`${key}${Array.isArray(value) ? '__in' : ''}`]: value,
        }), {}));
      }

      const response = await reports[serviceName].get(payload);

      if (hasWarningNotification(response)) {
        dispatch({ type: GET_REPORT_DATA_DONE });
        return;
      }

      dispatch({ type: GET_REPORT_DATA_DONE });

      dispatch({
        type: GET_REPORT_DATA,
        payload: {
          data: response,
          reportType,
        },
      });
      resolve(response);
    } catch (error) {
      dispatch({ type: GET_REPORT_DATA_ERROR, error });
      reject(error);
    }
  });

const getReportDataReducer = (state: IState, { payload }) => {
  const { data, reportType } = payload;
  const newState = reportType !== 'summary' ? {
    ...state,
    tableMetaInfo: {
      ...state.tableMetaInfo,
      fields: data.result.meta.fields,
    },
    meta: data.result.meta,
    list: data.result.rows,

    prevTableMetaInfo: {
      ...state.tableMetaInfo,
    },
    prevMeta: { ...state.meta },
    prevList: [...state.list],

    summaryList: [],
    summaryMeta: {},
    summaryTableMetaInfo: [],
  } : {
    ...state,
    summaryTableMetaInfo: data.result.meta.fields,
    summaryMeta: data.result.meta,
    summaryList: data.result.rows,
  };

  return newState;
};

export const setSummaryTableData: ReduxTypes.ISetSummaryTableDataState = tableData => ({
  type: 'SET_SUMMARY_TABLE_DATA',
  payload: {
    ...tableData,
  },
});

export const setSummaryTableDataReducer = (state, { payload: { summaryTableMetaInfo, summaryMeta, summaryList } }) => ({
  ...state,
  summaryTableMetaInfo,
  summaryMeta,
  summaryList,
});

export const setInitialState: ReduxTypes.ISetInitialState = () => ({ type: 'SET_INITIAL_STATE' });

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_INITIAL_STATE: return initialState;
    case SET_SUMMARY_TABLE_DATA: return setSummaryTableDataReducer(state, action);
    case GET_REPORT_DATA: return getReportDataReducer(state, action);
    case GET_TABLE_METAINFO: return getTableMetaInfoReducer(state, action);

    case GET_REPORT_DATA_START: return dataFetchingStatusReducer.start(state);
    case GET_REPORT_DATA_DONE: return dataFetchingStatusReducer.done(state);
    case GET_REPORT_DATA_ERROR: return dataFetchingStatusReducer.error(state);

    case GET_REPORT_META_START: return metaFetchingStatusReducer.start(state);
    case GET_REPORT_META_DONE: return metaFetchingStatusReducer.done(state);
    case GET_REPORT_META_ERROR: return metaFetchingStatusReducer.error(state);
    default: return state;
  }
}
