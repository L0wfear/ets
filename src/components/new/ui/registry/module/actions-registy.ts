import {
  REGISTRY_ADD_INITIAL_DATA,
  REGISTRY_REMOVE_DATA,
  REGISTRY_CHANGE_FILTER,
  REGISTRY_CHANGE_LIST,
  REGISTRY_CHANGE_SERVICE,
  REGISTRY_SET_LOADING_STATUS,
  OneRegistryData,
} from 'components/new/ui/registry/module/registry';
import { saveData } from 'utils/functions';
import { get } from 'lodash';

import { makeProcessedArray } from 'components/new/ui/registry/module/utils/processed';

import {
  setEmptyRawFilters,
  applyFilterFromRaw,
  mergeFilterValuesWithRawFilter,
} from 'components/new/ui/registry/module/utils/filter';
import {
  mergeFilter,
  mergeHeader,
  mergeList,
  mergeListMeta,
} from 'components/new/ui/registry/module/utils/merge';
import { getJSON, deleteJSON } from 'api/adapter';
import configStand from 'config';
import { getBlob } from 'api/adapterBlob';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { processResponse } from 'api/APIService';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import { isBoolean, isNullOrUndefined } from 'util';
import { getFrontDutyMission } from 'redux-main/reducers/modules/missions/duty_mission/promise';
import { getFrontEmployee } from 'redux-main/reducers/modules/employee/employee/promise';
import { getFrontTypesAttr } from 'redux-main/reducers/modules/autobase/types_attr/promise';
import { getFrontNorm } from 'redux-main/reducers/modules/norm_registry/promise';
import { getFrontCar } from 'redux-main/reducers/modules/autobase/car/promise';
import { getFrontEmployeeOnCar } from 'redux-main/reducers/modules/employee_on_car/promise_employee_on_car';
import { getFrontTechnicalOperationRelations } from 'redux-main/reducers/modules/technical_operation_relations/promise_technical_operation_relations';
import { getFrontMission } from 'redux-main/reducers/modules/missions/mission/promise';
import { getListData } from './selectors-registry';
import { getRegistryState, getSessionState } from 'redux-main/reducers/selectors';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';

/**
 * Да простят меня боги
 * @todo сделать нормально
 */

export const registryAddInitialData: any = ({ registryKey, ...config }) => (dispatch, getState) => {
  if (!config.noInitialLoad) {
    setTimeout(() => (
      dispatch(
        registryLoadDataByKey(registryKey),
      )
    ), 100);
  }

  const STRUCTURES = getSessionStructuresOptions(getState());
  const userData = getSessionState(getState()).userData;

  const mergeConfig: any = {
    isLoading: !config.noInitialLoad,
    Service: config.Service,
    filter: mergeFilter(config.filter),
    header: mergeHeader(config.header),
    trash: config.trash,
  };

  const columnContorolData = localStorage.getItem(`columnContorol`);
  let meta = config.list.meta;

  if (columnContorolData) {
    const currentRegistryData = get(JSON.parse(columnContorolData), registryKey, null);

    if (currentRegistryData) {
      meta = {
        fields: meta.fields.map((fieldData) => {
          const filedFormLocalStorage = currentRegistryData.find(({ key }) => fieldData.key === key);
          return {
            ...fieldData,
            ...(filedFormLocalStorage || {}),
          };
        }),
      };
    }
  }

  mergeConfig.list = mergeList(
    {
      ...config.list,
      meta,
    },
    mergeConfig.filter.fields,
    {
      STRUCTURES,
      userData,
    },
  );

  return dispatch({
    type: REGISTRY_ADD_INITIAL_DATA,
    payload: {
      registryKey,
      config: mergeConfig,
    },
  });
};

export const registryRemoveData = (registryKey) => ({
  type: REGISTRY_REMOVE_DATA,
  payload: {
    registryKey,
  },
});

export const actionSetLoadingStatus = (registryKey, isLoading) => ({
  type: REGISTRY_SET_LOADING_STATUS,
  payload: {
    registryKey,
    isLoading,
  },
});

export const actionChangeRegistryMetaFields: any = (registryKey, fields) => (dispatch, getState) => {
  const registyData = get(getState(), ['registry', registryKey], null);
  const list = get(registyData, 'list', null);

  const STRUCTURES = getSessionStructuresOptions(getState());
  const userData = getSessionState(getState()).userData;

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        meta: mergeListMeta(
          { fields },
          {
            STRUCTURES,
            userData,
          }),
      },
    ),
  );
};

export const actionChangeGlobalPaylaodInServiceData: any = (registryKey, payload, needUpdate = true) => (dispatch, getState) => {
  const registryData = get(getState(), `registry.${registryKey}`, null);
  const ServiceData = get(registryData, 'Service', null);

  const ServiceDataNew = Object.entries(ServiceData).reduce(
    (newObj, [key, value]) => {
      if (payload[key]) {
        const lastPayload = get(value, 'payload', {});

        newObj[key] = {
          ...value,
          payload: {
            ...lastPayload,
            ...payload[key],
          },
        };
      } else {
        newObj[key] = value;
      }

      return newObj;
    },
    {},
  );

  dispatch(
    registryChangeServiceData(registryKey, ServiceDataNew),
  );

  if (needUpdate) {
    dispatch(
      registryLoadDataByKey(registryKey),
    );
  }
};

export const registryLoadDataByKey: any = (registryKey) => async (dispatch, getState) => {
  // const stateSome = getState();
  dispatch(
    actionSetLoadingStatus(registryKey, true),
  );

  const registryData = get(getState(), `registry.${registryKey}`, null);
  const getRegistryData = get(registryData, 'Service.getRegistryData', null);
  const userServerFilters = get(getRegistryData, 'userServerFilters', false);
  const list: any = get(registryData, 'list', null);

  let arrayRaw = null;
  let arrayExtra = {};
  let total_count = 0;

  if (getRegistryData) {
    let payload = {};
    if (getRegistryData.payload) {
      payload = {
        ...getRegistryData.payload,
      };
    }
    if (userServerFilters) {
      const perPage: any = get(list, 'paginator.perPage', 0);
      const offset: any = get(list, 'paginator.currentPage', 0);
      const filterValues: any = get(list, 'processed.filterValues', {}) || {};
      const sort: any = get(list, 'processed.sort', {}) || {};

      payload = {
        ...payload,
        limit: MAX_ITEMS_PER_PAGE,
        offset: offset * perPage,
        sort_by: sort.field ? `${sort.field}:${sort.reverse ? 'desc' : 'asc'}` : '',
        filter: JSON.stringify(filterValues),
      };
    }

    let result = null;
    try {
      result = await etsLoadingCounter(
        dispatch,
        getJSON(
          `${configStand.backend}/${getRegistryData.entity}`,
          payload,
        ),
        { page: registryKey, noTimeout: isBoolean(getRegistryData.noTimeout) ? getRegistryData.noTimeout : true },
      );
    } catch (error) {
      console.error(error); //tslint:disable-line
    }

    const typeAns = get(getRegistryData, 'typeAns', 'result.rows');
    const typeExtra = get(getRegistryData, 'typeExtra', 'result.extra');

    processResponse(result);
    const uniqKey: any = get(list, 'data.uniqKey', null);
    arrayRaw = get(result, typeAns, []);
    arrayExtra = get(result, typeExtra, {});

    switch (getRegistryData.format) {
      case 'dutyMissionTemplate': {
        arrayRaw = arrayRaw.map(getFrontDutyMission);
        break;
      }
      case 'employee': {
        arrayRaw = arrayRaw.map(getFrontEmployee);
        break;
      }
      case 'typesAttr': {
        arrayRaw = arrayRaw.map(getFrontTypesAttr);
        break;
      }
      case 'normRegistry': {
        arrayRaw = arrayRaw.map(getFrontNorm);
        break;
      }
      case 'carActual': {
        arrayRaw = arrayRaw.map(getFrontCar);
        break;
      }
      case 'employee_on_car': {
        arrayRaw = arrayRaw.map(getFrontEmployeeOnCar);
        break;
      }
      case 'technical_operation_relations': {
        arrayRaw = arrayRaw.map(getFrontTechnicalOperationRelations);
        break;
      }
      case 'duty_mission': {
        arrayRaw = arrayRaw.map(getFrontDutyMission);
      }
      case 'mission': {
        arrayRaw = arrayRaw.map(getFrontMission);
      }
    }

    arrayRaw = arrayRaw.filter((data) => !isNullOrUndefined(data[uniqKey]));

    if (userServerFilters) {
      total_count = get(result, 'result.meta.total_count', 0) || get(result, 'meta.total_count', 0) || get(result, 'total_count', 0);
    } else {
      total_count = arrayRaw.length;
    }

    if (total_count > 0 && !arrayRaw.length) {
      dispatch(
        registryChangeDataPaginatorCurrentPage(
          registryKey,
          Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1,
        ),
      );
      return;
    }
  }

  let resultDisaptch = null;

  if (list) {
    let array = arrayRaw;
    if (!userServerFilters) {
      array = arrayRaw.sort((a, b) => b[list.data.uniqKey] - a[list.data.uniqKey]);
    }

    let processedArray = array;
    let processedTotalCount = 0;

    if (!userServerFilters) {
      const processed: any = get(list, 'processed', {}) || {};
      const fields: any = get(registryData, 'filter.fields', []);

      processedArray = makeProcessedArray(array, processed, fields);
      processedTotalCount = processedArray.length;
    } else {
      processedTotalCount = total_count;
    }

    resultDisaptch = dispatch(
      registryChangeListData(
        registryKey,
        {
          ...list,
          data: {
            ...list.data,
            total_count,
            array,
            arrayExtra,
          },
          processed: {
            ...list.processed,
            processedArray,
            total_count: processedTotalCount,
          },
        },
      ),
    );
  }

  dispatch(
    actionSetLoadingStatus(registryKey, false),
  );

  return resultDisaptch;
};

export const registryChangeDataPaginatorCurrentPage = (registryKey, currentPage = 0) => (dispatch, getState) => {
  dispatch(
    actionUnselectSelectedRowToShow(registryKey, true),
  );

  const registryData = get(getState(), `registry.${registryKey}`, null);

  if (registryData) {
    dispatch(
      registryChangeListData(
        registryKey,
        {
          ...registryData.list,
          paginator: {
            ...registryData.list.paginator,
            currentPage: Number(currentPage),
          },
        },
      ),
    );

    const getRegistryData = get(getState(), `registry.${registryKey}.Service.getRegistryData`, null);
    const userServerFilters = get(getRegistryData, 'userServerFilters', false);

    if (getRegistryData && userServerFilters) {
      dispatch(
        registryLoadDataByKey(registryKey),
      );
    }
  }
};

export const registryChangeServiceData = (registryKey, Service) => ({
  type: REGISTRY_CHANGE_SERVICE,
  payload: {
    registryKey,
    Service,
  },
});

export const registryChangeListData = (registryKey: string, list: OneRegistryData['list']) => ({
  type: REGISTRY_CHANGE_LIST,
  payload: {
    registryKey,
    list,
  },
});

export const registryChangeFilterData = (registryKey, filter) => ({
  type: REGISTRY_CHANGE_FILTER,
  payload: {
    registryKey,
    filter,
  },
});

export const registryChangeFilterRawValues = (registryKey, valueKey, type, value) => (dispatch, getState) => {
  const {
    registry: {
      [registryKey]: {
        filter,
      },
    },
  } = getState();

  return dispatch(
    registryChangeFilterData(
      registryKey,
      {
        ...filter,
        rawFilterValues: {
          ...filter.rawFilterValues,
          [valueKey]: {
            ...filter.rawFilterValues[valueKey],
            [type]: {
              ...filter.rawFilterValues[valueKey][type],
              value,
            },
          },
        },
      },
    ),
  );
};

export const registryResetAllTypeFilter = (registryKey) => (dispatch, getState) => {
  dispatch(
    actionUnselectSelectedRowToShow(registryKey, true),
  );

  const registyData = get(getState(), ['registry', registryKey], null);
  const getRegistryData = get(registyData, 'Service.getRegistryData', null);
  const userServerFilters = get(getRegistryData, 'userServerFilters', false);
  const filter = {
    ...get(registyData, 'filter', {}),
  };
  const list = get(registyData, 'list', null);

  filter.rawFilterValues = setEmptyRawFilters(filter);

  const processed = {
    ...list.processed,
    filterValues: applyFilterFromRaw(filter),
  };

  if (!getRegistryData || !userServerFilters) {
    processed.processedArray = makeProcessedArray(list.data.array, processed, filter.fields);
    processed.total_count = processed.processedArray.length;
  }

  dispatch(
    registryChangeFilterData(
      registryKey,
      filter,
    ),
  );

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        processed: {
          ...processed,
        },
      },
    ),
  );

  if (getRegistryData && userServerFilters) {
    dispatch(
      registryLoadDataByKey(registryKey),
    );
  }
};

export const applyFilterValues = (registryKey, filterValues) => (dispatch, getState) => {
  dispatch(
    actionUnselectSelectedRowToShow(registryKey, true),
  );

  const registyData = get(getState(), ['registry', registryKey], null);
  const getRegistryData = get(registyData, 'Service.getRegistryData', null);
  const userServerFilters = get(getRegistryData, 'userServerFilters', false);
  const filter: OneRegistryData['filter'] = get(registyData, 'filter', {});
  const list: OneRegistryData['list'] = get(registyData, 'list', null);

  const processed = {
    ...list.processed,
    filterValues,
  };

  if (__DEVELOPMENT__) {
    console.log('SAVE FILTER', processed.filterValues); // tslint:disable-line:no-console
  } else {
    let filterAsString = '';

    try {
      filterAsString = JSON.stringify(processed.filterValues);
    } catch (e) {
      filterAsString = processed.filterValues;
    }

    console.log('SAVE FILTER', filterAsString); // tslint:disable-line:no-console
  }

  if (!getRegistryData || !userServerFilters) {
    processed.processedArray = makeProcessedArray(list.data.array, processed, filter.fields);
    processed.total_count = processed.processedArray.length;
  }

  dispatch(
    registryChangeFilterData(
      registryKey,
      {
        ...filter,
        rawFilterValues: mergeFilterValuesWithRawFilter(filter.rawFilterValues, filterValues),
      },
    ),
  );

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        processed,
      },
    ),
  );

  if (getRegistryData && userServerFilters) {
    dispatch(
      registryLoadDataByKey(registryKey),
    );
  }
};

export const registryApplyRawFilters = (registryKey) => (dispatch, getState) => {
  const registyData = get(getState(), ['registry', registryKey], null);
  const filter = get(registyData, 'filter', {});

  dispatch(
    applyFilterValues(
      registryKey,
      applyFilterFromRaw(filter),
    ),
  );
};

export const registryToggleIsOpenFilter = (registryKey) => (dispatch, getState) => {
  const filterState = getState().registry[registryKey].filter;

  return dispatch(
    registryChangeFilterData(
      registryKey,
      {
        ...filterState,
        isOpen: !filterState.isOpen,
      },
    ),
  );
};

export const registyLoadPrintForm: any = (registryKey) => async  (dispatch, getState) => {
  const getBlobData = get(
    getState(),
    ['registry', registryKey, 'Service', 'getBlobData'],
    get(getState(), ['registry', registryKey, 'Service', 'getRegistryData'], null),
  );
  let blob = null;
  let fileName = '';

  if (getBlobData) {
    const result = await etsLoadingCounter(
      dispatch,
      getBlob(
        `${configStand.backend}/${getBlobData.entity}`,
        getBlobData.payload || { format: 'xls'},
      ),
      { page: registryKey },
    );
    processResponse(result);
    blob = get(result, 'blob', null);
    fileName = get(result, 'fileName', '');
  }

  if (blob && fileName) {
    saveData(blob, fileName);
  }
};

export const registryTriggerOnChangeSelectedField = (registryKey, field) => (dispatch, getState) => {
  dispatch(
    actionUnselectSelectedRowToShow(registryKey, true),
  );

  const registyData = get(getState(), ['registry', registryKey], null);
  const getRegistryData = get(registyData, 'Service.getRegistryData', null);
  const userServerFilters = get(getRegistryData, 'userServerFilters', false);
  const filter = get(registyData, 'filter', {});
  const list = get(registyData, 'list', null);

  const {
    processed : {
      sort: sortOld,
    },
  } = list;

  const sort = {
    ...sortOld,
  };

  if (field === sortOld.field) {
    if (sortOld.reverse) {
      sort.field = '';
      sort.reverse = false;
    } else {
      sort.reverse = true;
    }
  } else {
    sort.field = field;
    sort.reverse = false;
  }

  const processed = {
    ...list.processed,
    sort,
  };

  if (!getRegistryData || !userServerFilters) {
    processed.processedArray = makeProcessedArray(list.data.array, processed, filter.fields);
  }

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        processed,
      },
    ),
  );

  if (getRegistryData && userServerFilters) {
    dispatch(
      registryLoadDataByKey(registryKey),
    );
  }
};

export const registryCheckLine: any = (registryKey, rowData) => (dispatch, getState) => {
  const registryData = get(getState(), `registry.${registryKey}`, null);
  const list: any = get(registryData, 'list', null);
  const uniqKey: any = get(list, 'data.uniqKey', null);
  const checkedRowsCurrent: any = get(list, 'data.checkedRows', {});

  const checkedRowsNew = { ...checkedRowsCurrent };

  if (!checkedRowsNew[rowData[uniqKey]]) {
    checkedRowsNew[rowData[uniqKey]] = rowData;
  } else {
    delete checkedRowsNew[rowData[uniqKey]];
  }

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        data: {
          ...list.data,
          checkedRows: checkedRowsNew,
        },
      },
    ),
  );
};

export const registryGlobalCheck: any = (registryKey) => (dispatch, getState) => {
  const registryData = get(getState(), `registry.${registryKey}`, null);
  const getRegistryData = get(registryData, 'Service.getRegistryData', null);
  const userServerFilters = get(getRegistryData, 'userServerFilters', false);
  const list: any = get(registryData, 'list', null);
  const uniqKey: any = get(list, 'data.uniqKey', null);
  const offset: any = get(list, 'paginator.currentPage', 0);
  const checkedRowsCurrent: any = get(list, 'data.checkedRows', {});
  const processedArray: any = get(list, 'processed.processedArray', {}) || {};

  let checkedRowsNew = {};
  let checkArray = processedArray;

  if (!getRegistryData || !userServerFilters) {
    checkArray = processedArray.slice(offset, MAX_ITEMS_PER_PAGE);
  }

  if (Object.keys(checkedRowsCurrent).length === checkArray.length) {
    checkedRowsNew = {};
  } else {
    checkedRowsNew = checkArray.reduce((newObj, oneData) => {
      newObj[oneData[uniqKey]] = oneData;

      return newObj;
    }, {});
  }

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        data: {
          ...list.data,
          checkedRows: checkedRowsNew,
        },
      },
    ),
  );
};

export const registryResetGlobalCheck: any = (registryKey) => (dispatch, getState) => {
  const registryData = get(getState(), `registry.${registryKey}`, null);
  const list: any = get(registryData, 'list', null);
  const checkedRows: any = get(list, 'data.checkedRows', {});

  if (Object.keys(checkedRows).length) {
    dispatch(
      registryChangeListData(
        registryKey,
        {
          ...list,
          data: {
            ...list.data,
            checkedRows: {},
          },
        },
      ),
    );
  }
};

export const registrySelectRow: any = (registryKey, selectedRow) => (dispatch, getState) => {
  const {
    registry: {
      [registryKey]: {
        list,
      },
    },
  } = getState();

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        data: {
          ...list.data,
          selectedRow,
        },
      },
    ),
  );

  const children = get(selectedRow, 'children', null);

  if (children && children.length) {
    const listNew = getListData(getRegistryState(getState()), registryKey);
    const uniqKey = listNew.data.uniqKey;
    const processedArray = listNew.processed.processedArray.map(
      (rowData) => {
        if (rowData[uniqKey] === selectedRow[uniqKey]) {
          return {
            ...rowData,
            is_open: !rowData.is_open,
          };
        }
        return rowData;
      },
    );

    dispatch(
      registryChangeListData(
        registryKey,
        {
          ...listNew,
          processed: {
            ...listNew.processed,
            processedArray,
          },
        },
      ),
    );
  }
};

export const registrySetSelectedRowToShowInForm: any = (registryKey, selectedRow?) => (dispatch, getState) => {
  const {
    registry: {
      [registryKey]: {
        list,
      },
    },
  } = getState();

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        data: {
          ...list.data,
          selectedRowToShow: selectedRow || list.data.selectedRow,
        },
      },
    ),
  );
};

export const actionUnselectSelectedRowToShow: any = (registryKey: string, allReset: boolean) => (dispatch, getState) => {
  const list = get(getState(), `registry.${registryKey}.list`, null);

  if (list) {
    dispatch(
      registryChangeListData(
        registryKey,
        {
          ...list,
          data: {
            ...list.data,
            selectedRow: !allReset ? list.data.selectedRow : null,
            checkedRows: !allReset ? list.data.checkedRows : {},
            selectedRowToShow: null,
          },
        },
      ),
    );
  }
};

export const registryLoadOneData: any = (registryKey, id) => async (dispatch, getState) => {
  const registryData = get(getState(), `registry.${registryKey}`, null);
  const getOneData = get(registryData, 'Service.getOneData', null);

  if (getOneData) {
    const result = await etsLoadingCounter(
      dispatch,
      getJSON(
        `${configStand.backend}/${getOneData.entity}`,
        { id },
      ),
      { page: registryKey, noTimeout: true },
    );

    let response = get(
      result,
      get(getOneData, 'typeAns', 'result.rows.0'),
      null,
    );

    switch (getOneData.format) {
      case 'dutyMissionTemplate': {
        response = getFrontDutyMission(response);
        break;
      }
      case 'employee': {
        response = getFrontEmployee(response);
        break;
      }
    }

    dispatch(
      registrySetSelectedRowToShowInForm(registryKey, response),
    );

    return response;
  }

  return null;
};

export const registryRemoveSelectedRows: any = (registryKey, rows?: any[]) => async (dispatch, getState) => {
  let itemToRemove = rows;
  const registryData = get(getState(), `registry.${registryKey}`, null);
  const list: any = get(registryData, 'list', null);
  const uniqKey: string = get(list, 'data.uniqKey', null);
  const removeOneData = get(
    registryData,
    'Service.removeOneData',
    get(registryData, 'Service.getRegistryData', null),
  );

  if (!itemToRemove) {
    const checkedRowsCurrent: any = get(list, 'data.checkedRows', {});
    const selectedRowCurrent: any = get(list, 'data.selectedRow', {});

    itemToRemove = Object.values(checkedRowsCurrent);

    if (!itemToRemove.length) {
      itemToRemove.push(selectedRowCurrent);
    }
  }

  dispatch(
    actionUnselectSelectedRowToShow(registryKey, true),
  );

  try {
    await Promise.all(
      itemToRemove.map(async ({ [uniqKey]: uniqKeyValue }: any) => {
        let path = `${configStand.backend}/${removeOneData.entity}`;
        const payload: any = {};

        if (removeOneData.uniqKeyLikeQueryString) {
          payload[uniqKey] = uniqKeyValue;
        } else {
          path = `${path}/${uniqKeyValue}`;
        }

        let response = null;

        try {
          response = await etsLoadingCounter(
            dispatch,
            deleteJSON(
              path,
              payload,
              'json',
            ),
            { page: registryKey },
          );
          processResponse(response);
        } catch (error) {
          throw new Error(error);
        }

        return response;
      }),
    );
    global.NOTIFICATION_SYSTEM.notify('Выбранные записи успешно удалены', 'success');
  } catch (error) {
    throw error;
  }

  return true;
};

export const registryResetSelectedRowToShowInForm: any = (registryKey, isSubmitted) => (dispatch, getState) => {
  dispatch(
    actionUnselectSelectedRowToShow(
      registryKey,
      isSubmitted,
    ),
  );

  if (isSubmitted) {
    dispatch(
      registryLoadDataByKey(registryKey),
    );
  }
};
