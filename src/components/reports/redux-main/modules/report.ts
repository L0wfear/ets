import { FetchingStatusReducerFactory } from 'utils/redux-utils';
import { reports } from 'api/Services';
import { hasWarningNotification } from 'utils/notifications';
import * as ReduxTypes from 'components/reports/redux-main/modules/@types/report.h';
import { makeDataForSummerTable } from 'components/reports/redux-main/modules/report_utils';
import { isArray } from 'util';

export type IStateReport = ReduxTypes.IReportStateProps;

const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
const SET_SUMMARY_TABLE_DATA = 'SET_SUMMARY_TABLE_DATA';
const SET_REPORT_DATA_WITH_SUMMER_DATA = 'SET_REPORT_DATA_WITH_SUMMER_DATA';
const GET_REPORT_DATA = 'GET_REPORT_DATA';
const GET_REPORT_DATA_WITH_SUMMER_DATA = 'GET_REPORT_DATA_WITH_SUMMER_DATA';
const GET_REPORT_DATA_START = 'GET_REPORT_DATA_START';
const GET_REPORT_DATA_DONE = 'GET_REPORT_DATA_DONE';
const GET_REPORT_DATA_ERROR = 'GET_REPORT_DATA_ERROR';
const GET_TABLE_METAINFO = 'GET_TABLE_METAINFO';
const GET_REPORT_META_START = 'GET_REPORT_META_START';
const GET_REPORT_META_DONE = 'GET_REPORT_META_DONE';
const GET_REPORT_META_ERROR = 'GET_REPORT_META_ERROR';
const metaFetchingStatusReducer = FetchingStatusReducerFactory('reportMeta');
const dataFetchingStatusReducer = FetchingStatusReducerFactory('reportData');

const initialState: IStateReport = {
  data: {},
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

export const getTableMetaInfo: ReduxTypes.IGetTableMetaInfo = (serviceName) => (dispatch) =>
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
    } catch (errorData) {
      dispatch({ type: GET_REPORT_META_ERROR, error: errorData.error_text });
      reject(errorData);
    }
  });

const getTableMetaInfoReducer = (state: IStateReport, { payload }) => ({
  ...state,
  tableMetaInfo: {
    ...payload,
  },
});

export const getReportData: ReduxTypes.IGetReportData = (serviceName, getOpts: any = {}, reportType = '', props = {}) => (dispatch) =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch({ type: GET_REPORT_DATA_START });
      const payload = { ...getOpts };

      if (payload.filter) {
        payload.filter = JSON.stringify(Object.entries(JSON.parse(payload.filter)).reduce((newObj, [key, value]) => {
          if (Array.isArray(value)) {
            newObj[`${key}__in`] = value;
          } else {
            newObj = {
              ...newObj,
              ...value,
            };
          }

          return newObj;
        }, {}));
      }

      const response = await reports[serviceName].get(payload);
      /*  Если видишь это и не понимаешт зачем, то смело удаляй

      let response: any = null;
      if (props.reportKey !== 'fuel_cards_report') {
        response = await reports[serviceName].get(payload);
      } else {
        /* fuel_cards_report
          reports[serviceName].get(payload);
          response = await Promise.resolve({
            result: {
              extra: {},
              meta: {
                date_end: '2019-02-27T08:59:00',
                date_start: '2019-02-20T09:00:00"',
                description: '',
                fields: [
                  {
                    fuel_type: {
                      filter_field: 'fuel_type',
                      name: 'Тип топлива',
                    },
                  },
                  {
                    fuel_method: {
                      filter_field: 'fuel_method',
                      name: 'Способ заливки',
                    },
                  },
                  {
                    fuel_card: {
                      filter_field: 'fuel_card',
                      name: 'Топливная карта',
                    },
                  },
                  {
                    fuel_given: {
                      filter_field: 'fuel_given',
                      name: 'Выдано, л ТС',
                    },
                  },
                  {
                    equipment_fuel_given: {
                      filter_field: 'finished_at',
                      name: 'Выдано, л оборудования',
                    },
                  },
                  {
                    fuel_sum: {
                      filter_field: 'fuel_sum',
                      name: 'Выдано итого',
                    },
                  },
                  {
                    some_filter_field: {
                      filter_field: 'some_filter_field',
                      name: 'Свойство, по которому надо фильтровать но не выводить',
                      display: false,
                    },
                  },
                ],
                level: 'company',
                levels: {
                  current: {
                    filter: [
                      'company_id',
                    ],
                    level: 'company',
                  },
                },
                name: 'Отчет по топливным картам',
                summary: {
                  aggr_fields: ['fuel_sum'],
                  with_summary_data: true,
                  fields: [
                    {
                      fuel_method: {
                        filter_field: 'fuel_method',
                        name: 'Способ заливки',
                      },
                    },
                    {
                      fuel_card: {
                        filter_field: 'fuel_card',
                        name: 'Топливная карта',
                      },
                    },
                    {
                      fuel_sum: {
                        filter_field: 'fuel_sum',
                        name: 'Выдано всего',
                      },
                    },
                  ],
                },
              },
              rows: [
                {
                  __title_rows: [
                    {
                      title: '1 строка над основномы строками (отступ по номеру)',
                    },
                    {
                      title: '2 строка над основномы строками (отступ по номеру)',
                    },
                  ],
                  rows: [
                    {
                      fuel_type: 1,
                      fuel_method: 2,
                      fuel_card: 3,
                      fuel_given: 4,
                      equipment_fuel_given: 5,
                      fuel_sum: 6,
                    },
                    {
                      fuel_type: 1,
                      fuel_method: 2,
                      fuel_card: 3,
                      fuel_given: 4,
                      equipment_fuel_given: 5,
                      fuel_sum: 10,
                    },
                  ],
                  __footer_rows: [
                    {
                      title: '1 строка под основномы строками (отступ по номеру)',
                    },
                    {
                      fuel_type: {
                        type: 'value',
                        value: '',
                      },
                      fuel_method: {
                        type: 'value',
                        value: '',
                      },
                      fuel_card: {
                        type: 'value',
                        value: 'Итого',
                      },
                      fuel_given: {
                        type: 'agg',
                      },
                      equipment_fuel_given: {
                        type: 'agg',
                      },
                      fuel_sum: {
                        type: 'agg',
                      },
                    },
                  ],
                },
                {
                  __title_rows: [
                    {
                      title: '1 строка над основномы строками (отступ по номеру)',
                    },
                    {
                      title: '2 строка над основномы строками (отступ по номеру)',
                    },
                    {
                      title: '3 строка над основномы строками (отступ по номеру)',
                    },
                  ],
                  rows: [
                    {
                      fuel_type: '1_fuel_type',
                      fuel_method: '1_fuel_method',
                      fuel_card: '1_fuel_card',
                      fuel_given: '1_fuel_given',
                      equipment_fuel_given: '1_equipment_fuel_given',
                      fuel_sum: '1_fuel_sum',
                    },
                    {
                      fuel_type: '2_fuel_type',
                      fuel_method: '2_fuel_method',
                      fuel_card: '2_fuel_card',
                      fuel_given: '2_fuel_given',
                      equipment_fuel_given: '2_equipment_fuel_given',
                      fuel_sum: '2_fuel_sum',
                    },
                  ],
                  __footer_rows: [
                    {
                      fuel_type: {
                        type: 'value',
                        value: '',
                      },
                      fuel_method: {
                        type: 'value',
                        value: '',
                      },
                      fuel_card: {
                        type: 'value',
                        value: 'Итого',
                      },
                      fuel_given: {
                        type: 'agg',
                      },
                      equipment_fuel_given: {
                        type: 'agg',
                      },
                      fuel_sum: {
                        type: 'agg',
                      },
                    },
                    {
                      title: '2 строка под основномы строками (отступ по номеру)',
                    },
                    {
                      title: '3 строка под основномы строками (отступ по номеру)',
                    },
                  ],
                },
              ],
            },
          });
      }
      */

      const deepArr = response.result.rows.some((blockData) => isArray(blockData.rows));
      if (deepArr) {
        response.result.rows = response.result.rows.reduce((blockDataObj, blockData) => {
          blockDataObj.array.push({
              ...blockData,
              rows: blockData.rows.map((row, index) => {
                row._uniq_field = index + blockDataObj.index + 1;
                return row;
              }),
          });

          blockDataObj.index = blockDataObj.index + blockData.rows.length;

          return blockDataObj;
        }, { array: [], index: 0 }).array;
      }

      if (hasWarningNotification(response)) {
        dispatch({ type: GET_REPORT_DATA_DONE });
        return;
      }

      dispatch({ type: GET_REPORT_DATA_DONE });
      if (props.notUseServerSummerTable) {
        dispatch(setAllData(response, props));
      } else {
        dispatch({
          type: GET_REPORT_DATA,
          payload: {
            data: response,
            reportType,
          },
        });
      }
      resolve(response);
    } catch (errorData) {
      dispatch({ type: GET_REPORT_DATA_ERROR, error: errorData.error_text });
      reject(errorData);
    }
  });

const getReportDataReducer = (state: IStateReport, { payload }) => {
  const { data, reportType } = payload;

  const newState = reportType !== 'summary'
    ? {
      data,
      ...state,
      tableMetaInfo: {
        ...state.tableMetaInfo,
        fields: data.result.meta.fields,
      },
      meta: data.result.meta,
      list: data.result.rows.map((row, index) => ({ _uniq_field: index + 1, ...row })),

      prevTableMetaInfo: {
        ...state.tableMetaInfo,
      },
      prevMeta: { ...state.meta },
      prevList: [...state.list],

      summaryList: [],
      summaryMeta: {},
      summaryTableMetaInfo: [],
    }
    : {
      ...state,
      summaryTableMetaInfo: data.result.meta.fields,
      summaryMeta: data.result.meta,
      summaryList: data.result.rows.map((row, index) => ({ _uniq_field: index + 1, ...row })),
    };

  return newState;
};

const getReportDataWithSummerDataReducer = (state: IStateReport, { payload }) => {
  const { data, summerData } = payload;
  return {
    data,
    tableMetaInfo: {
      ...state.tableMetaInfo,
      fields: data.result.meta.fields,
    },
    meta: data.result.meta,
    list: data.result.rows.map((row, index) => ({ _uniq_field: index + 1, ...row })),

    prevTableMetaInfo: {
      ...state.tableMetaInfo,
    },
    prevMeta: { ...state.meta },
    prevList: [...state.list],
    summaryTableMetaInfo: data.result.meta.summary.fields,
    summaryMeta: data.result.meta,
    summaryList: summerData.map((row, index) => ({ _uniq_field: index + 1, ...row })),
  };
};

export const setAllData: any = (response, props) => ({
    type: GET_REPORT_DATA_WITH_SUMMER_DATA,
    payload: {
      data: response,
      summerData: makeDataForSummerTable(response, props),
    },
  }
);

export const setReportDataWithSummerData: any = ({ data, props }) => ({
  type: SET_REPORT_DATA_WITH_SUMMER_DATA,
  payload: {
    list: data.result.rows.map((row, index) => ({ _uniq_field: index + 1, ...row })),
    summaryList: makeDataForSummerTable(data, props),
  },
});

export const setReportDataWithSummerDataReducer: any = (state, { payload: { list, summaryList } }) => ({
  ...state,
  list,
  summaryList,
});

export const setSummaryTableData: ReduxTypes.ISetSummaryTableDataState = (tableData) => ({
  type: SET_SUMMARY_TABLE_DATA,
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
    case SET_REPORT_DATA_WITH_SUMMER_DATA: return setReportDataWithSummerDataReducer(state, action);
    case GET_REPORT_DATA: return getReportDataReducer(state, action);
    case GET_REPORT_DATA_WITH_SUMMER_DATA: return getReportDataWithSummerDataReducer(state, action);
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
