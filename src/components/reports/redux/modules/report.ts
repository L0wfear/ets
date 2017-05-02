import { FetchingStatusReducerFactory } from 'utils/redux-utils';
import { reports } from 'api/Services';
import * as ReduxTypes from './@types/report.h';

const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
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


const initialState: ReduxTypes.IReportStateProps = {
  list: [],
  meta: {
    levels: {
      current: {},
    },
  },
  tableMetaInfo: [],
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
      dispatch({ type: GET_REPORT_META_ERROR });
      reject(error);
    }
  });

const getTableMetaInfoReducer = (state, { payload }) => ({
  ...state,
  tableMetaInfo: payload,
});

export const getReportData: ReduxTypes.IGetReportData = (serviceName, getOpts = {}) => dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch({ type: GET_REPORT_DATA_START });
      const payload = await reports[serviceName].get(getOpts);
      dispatch({ type: GET_REPORT_DATA_DONE });

      dispatch({
        type: GET_REPORT_DATA,
        payload,
      });
      resolve(payload);
    } catch (error) {
      dispatch({ type: GET_REPORT_DATA_ERROR });
      reject(error);
    }
  });

const getReportDataReducer = (state, { payload }) => ({
  ...state,
  meta: payload.result.meta,
  list: payload.result.rows,
});

export const getInitialReport: ReduxTypes.IGetInitialReport = (serviceName, getOpts = {}) => dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      // await dispatch(getTableMetaInfo(serviceName));
      await dispatch(getReportData(serviceName, getOpts));
      resolve();
    } catch (error) {
      reject(error);
    }
  });

export const setInitialState: ReduxTypes.ISetInitialState = () => ({ type: 'SET_INITIAL_STATE' });

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_INITIAL_STATE: return initialState;
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
