import { cloneDeep, get, keyBy } from 'lodash';
import { isBoolean, isNullOrUndefined } from 'util';

import { OneRegistryData, TypeConfigData } from 'components/new/ui/registry/module/@types/registry';

import {
  REGISTRY_ADD_INITIAL_DATA,
  REGISTRY_REMOVE_DATA,
  REGISTRY_CHANGE_FILTER,
  REGISTRY_CHANGE_LIST,
  REGISTRY_CHANGE_SERVICE,
  REGISTRY_SET_LOADING_STATUS,
  REGISTRY_SET_ID_REQUEST_TIME,
} from 'components/new/ui/registry/module/registry';
import { saveData } from 'utils/functions';

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
import { getBlob, postBlob } from 'api/adapterBlob';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { processResponse } from 'api/APIService';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import { getFrontDutyMission } from 'redux-main/reducers/modules/missions/duty_mission/promise';
import { getFrontEmployee } from 'redux-main/reducers/modules/employee/employee/promise';
import { getFrontTypesAttr } from 'redux-main/reducers/modules/autobase/types_attr/promise';
import { getFrontCar } from 'redux-main/reducers/modules/autobase/car/promise';
import { getFrontEmployeeOnCar } from 'redux-main/reducers/modules/employee_on_car/promise_employee_on_car';
import { getFrontTechnicalOperationRelations } from 'redux-main/reducers/modules/technical_operation_relations/promise_technical_operation_relations';
import { getFrontMission } from 'redux-main/reducers/modules/missions/mission/promise';
import { getListData } from './selectors-registry';
import { getRegistryState, getSessionState } from 'redux-main/reducers/selectors';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { validateMissionsByCheckedElements } from 'components/new/pages/missions/utils';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { createValidDate, createValidDateTime } from 'components/@next/@utils/dates/dates';
import { makeInspectCarsConditionExtendedFront } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_promise';
import { getFrontNorm } from 'redux-main/reducers/modules/some_uniq/norm_registry/promise';
import { removeEmptyString } from 'redux-main/reducers/modules/form_data_record/actions';
import { makeInspectActScanFilesFront } from 'redux-main/reducers/modules/inspect/act_scan/inspect_act_scan_promise';
import { makeConsumableMaterialFront } from 'redux-main/reducers/modules/consumable_material/promise_consumable_material';

const mapKeyMapArray: Record<OneRegistryData<any>['Service']['getRegistryData']['format'], (array: any[]) => any[]> = {
  dutyMissionTemplate: (array) => array.map(getFrontDutyMission),
  employee: (array) => array.map(getFrontEmployee),
  typesAttr: (array) => array.map(getFrontTypesAttr),
  normRegistry: (array) => array.map(getFrontNorm),
  carActual: (array) => array.map(getFrontCar),
  employee_on_car: (array) => array.map(getFrontEmployeeOnCar),
  technical_operation_relations: (array) => array.map(getFrontTechnicalOperationRelations),
  duty_mission: (array) => array.map(getFrontDutyMission),
  mission: (array) => array.map(getFrontMission),
  cars_condition_extended: (array) => array.map(makeInspectCarsConditionExtendedFront),
  inspect_act_scan: makeInspectActScanFilesFront,
  consumable_material_wrap: makeConsumableMaterialFront,
};

const makePayloadFromObject = (payload: OneRegistryData<any>['Service']['getRegistryData']['payload']) => (
  Object.entries(payload || {}).reduce(
    (newObj, [key, value]) => {
      if (!isNullOrUndefined(value)) {
        newObj[key] = value;
      }
      return newObj;
    },
    {},
  )
);

/**
 * Да простят меня боги
 * @todo сделать нормально
 */
export const registryAddInitialData = <F extends any = any>({ registryKey, ...config }: TypeConfigData<F>): EtsAction<Promise<any>> => (dispatch, getState) => {
  const STRUCTURES = getSessionStructuresOptions(getState());
  const userData = getSessionState(getState()).userData;

  const mergeConfig: Partial<OneRegistryData<any>> = {
    isLoading: !config.noInitialLoad,
    Service: config.Service,
    path: config.path || null,
    filter: mergeFilter<F>(config.filter),
    header: mergeHeader<F>(config.header),
  };

  const columnContorolData = localStorage.getItem(`columnContorol`);
  let meta = config.list.meta;

  if (columnContorolData) {
    const currentRegistryData = get(JSON.parse(columnContorolData), registryKey, null);

    if (currentRegistryData) {
      meta = {
        ...config.list.meta,
        fields: meta.fields.map((fieldData) => {
          const filedFormLocalStorage = currentRegistryData.find(({ key }) => {
            if ('key' in fieldData) {
              return fieldData.key === key;
            }
            return true;
          });
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

  dispatch({
    type: REGISTRY_ADD_INITIAL_DATA,
    payload: {
      registryKey,
      config: mergeConfig,
    },
  });

  if (!config.noInitialLoad) {
    return dispatch(
      registryLoadDataByKey(registryKey),
    );
  }
  return Promise.resolve();
};

export const registryRemoveData = (registryKey: string) => ({
  type: REGISTRY_REMOVE_DATA,
  payload: {
    registryKey,
  },
});

export const actionSetLoadingStatus = (registryKey: string, isLoading: boolean) => ({
  type: REGISTRY_SET_LOADING_STATUS,
  payload: {
    registryKey,
    isLoading,
  },
});

export const actionSetRequestTime = (registryKey: string, idRequestTime: number) => ({
  type: REGISTRY_SET_ID_REQUEST_TIME,
  payload: {
    registryKey,
    idRequestTime,
  },
});

export const actionChangeRegistryMetaFields = (registryKey: string, fields: OneRegistryData<any>['list']['meta']['fields']): EtsAction<void> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const list = get(registryData, 'list');

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

export const actionChangeGlobalPaylaodInServiceData = (registryKey: string, payload: Record<string, any>, needUpdate: boolean = true): EtsAction<any> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
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

const makePayloadForLoad = (getRegistryData: OneRegistryData['Service']['getRegistryData'], list: OneRegistryData['list']) => {
  const userServerFilters = get(getRegistryData, 'userServerFilters');
  const processed = get(list, 'processed');

  let payload = makePayloadFromObject(getRegistryData.payload);

  if (userServerFilters) {
    const paginator = get(list, 'paginator');
    const perPage = get(paginator, 'perPage', 0);
    const offset = get(paginator, 'currentPage', 0);
    const filterValues = get(processed, 'filterValues') || {};
    const sort = get(processed, 'sort') || {};

    payload = {
      ...payload,
      limit: MAX_ITEMS_PER_PAGE,
      offset: offset * perPage,
      sort_by: sort.field ? `${sort.field}:${sort.reverse ? 'desc' : 'asc'}` : '',
      filter: JSON.stringify(filterValues),
    };
  }

  return payload;
};

export const actionGetRegistryData = async (registryKey: string): EtsAction<Promise<any>> => async (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const Service = get(registryData, 'Service');
  const path = get(registryData, 'path');
  const list = get(registryData, 'list');
  const getRegistryData = get(Service, 'getRegistryData');

  const payload = makePayloadForLoad(
    getRegistryData,
    list,
  );

  let result = null;
  try {
    result = await etsLoadingCounter(
      dispatch,
      getJSON(
        `${configStand.backend}/${getRegistryData.entity}`,
        payload,
      ),
      { page: registryKey, noTimeout: isBoolean(getRegistryData.noTimeout) ? getRegistryData.noTimeout : true, path },
    );
  } catch (error) {
    console.error(error); // tslint:disable-line
  }
  processResponse(result);

  return result;
};

export const registryLoadDataByKey = <F extends Record<string, any>>(registryKey: string, responseDataList: F[] = []): EtsAction<Promise<void>> => async (dispatch, getState) => {
  const idRequestTime = +(new Date());

  dispatch(actionSetLoadingStatus(registryKey, true));
  dispatch(actionUnselectSelectedRowToShow(registryKey, true));
  dispatch(actionSetRequestTime(registryKey, idRequestTime));

  const registryData = get(getRegistryState(getState()), registryKey);
  const Service = get(registryData, 'Service');
  const getRegistryData = get(Service, 'getRegistryData');
  const userServerFilters = get(getRegistryData, 'userServerFilters');
  const list = get(registryData, 'list');
  const data = get(list, 'data');
  const uniqKey = get(data, 'uniqKey');

  let arrayRaw = [];
  let total_count = 0;
  let objectExtra = {};

  if (getRegistryData) {
    const result = await dispatch(
      actionGetRegistryData(registryKey),
    );

    const idRequestTimeOld = get(get(getRegistryState(getState()), registryKey), 'idRequestTime');
    if (idRequestTime !== idRequestTimeOld) {
      return;
    }

    const typeAns = get(getRegistryData, 'typeAns', 'result.rows');
    const typeExtra = get(getRegistryData, 'typeExtra', 'result.extra');

    // сплющивание массивов
    const arrayRawResult: any[] = get(result, typeAns) || [];
    const newDataObj: object = keyBy(responseDataList, uniqKey);
    arrayRaw = arrayRawResult.map(
      (resultElem) => {
        return newDataObj[resultElem[uniqKey]] || resultElem;
      },
    );
    objectExtra = get(result, typeExtra, {});

    // форматирование массива под реестр
    if (getRegistryData.format in mapKeyMapArray) {
      arrayRaw = mapKeyMapArray[getRegistryData.format](arrayRaw);
    }
    total_count = arrayRaw.length;

    if (userServerFilters) {
      // где-то там количество
      total_count = get(result, 'result.meta.total_count', 0) || get(result, 'meta.total_count', 0) || get(result, 'total_count', 0);

      // если в текущем списке больше 1 элемента, а массив пуст, то переходим на редыдущую страницу
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
  }

  dispatch(
    registryChangeData(
      registryKey,
      arrayRaw,
      total_count,
      objectExtra,
    ),
  );

  dispatch(
    actionSetLoadingStatus(registryKey, false),
  );
};

export const registryChangeDataPaginatorCurrentPage = (registryKey: string, currentPage = 0): EtsAction<void> => (dispatch, getState) => {
  dispatch(actionUnselectSelectedRowToShow(registryKey, true));

  const registryData = get(getRegistryState(getState()), registryKey);

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

export const registryChangeServiceData = (registryKey: string, Service: OneRegistryData<any>['Service']) => ({
  type: REGISTRY_CHANGE_SERVICE,
  payload: {
    registryKey,
    Service,
  },
});

export const registryChangeData = <F extends Record<string, any>>(registryKey: string, arrayRaw: F[], total_count: number, objectExtra: any): EtsAction<any> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const Service = get(registryData, 'Service');
  const getRegistryData = get(Service, 'getRegistryData');
  const userServerFilters = get(getRegistryData, 'userServerFilters');
  const list = get(registryData, 'list');
  const data = get(list, 'data');
  const uniqKey = get(data, 'uniqKey');

  if (list) {
    let array = arrayRaw;
    if (!userServerFilters) {
      array = arrayRaw.sort((a, b) => b[uniqKey] - a[uniqKey]);
    }
    dispatch(
      registryChangeListData(
        registryKey,
        {
          ...list,
          data: {
            ...list.data,
            total_count,
            array,
            objectExtra,
          },
        },
      ),
    );
  }
};

export const registryChangeListData = (registryKey: string, listRaw: OneRegistryData['list']): EtsAction<void> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const Service = get(registryData, 'Service');
  const getRegistryData = get(Service, 'getRegistryData');
  const userServerFilters = get(getRegistryData, 'userServerFilters');
  const filter = get(registryData, 'filter');
  const listOld = get(registryData, 'list');

  let processed = listRaw.processed;

  const triggerOnUpdate = (
    listRaw.data.array !== listOld.data.array
    || processed.sort !== listOld.processed.sort
    || processed.filterValues !== listOld.processed.filterValues
  );

  if (triggerOnUpdate) {
    processed = { ...listRaw.processed };
    if (!getRegistryData || !userServerFilters) {
      processed.processedArray = makeProcessedArray(listRaw.data.array, processed, filter.fields);
      processed.total_count = processed.processedArray.length;
    }
  }

  return dispatch({
    type: REGISTRY_CHANGE_LIST,
    payload: {
      registryKey,
      list: {
        ...listRaw,
        processed,
      },
    },
  });
};

export const registryChangeFilterData = (registryKey: string, filter: OneRegistryData<any>['filter']) => ({
  type: REGISTRY_CHANGE_FILTER,
  payload: {
    registryKey,
    filter,
  },
});

export const registryChangeFilterRawValues = (registryKey: string, valueKey: string, type: 'in' | 'eq' | 'neq' | 'like' | 'gt' | 'lt', value: any): EtsAction<EtsActionReturnType<typeof registryChangeFilterData>> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const filter = get(registryData, 'filter');

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

export const registryResetAllTypeFilter = (registryKey: string): EtsAction<void> => (dispatch, getState) => {
  dispatch(actionUnselectSelectedRowToShow(registryKey, true));
  const registryData = get(getRegistryState(getState()), registryKey);

  const Service = get(registryData, 'Service');
  const getRegistryData = get(Service, 'getRegistryData');
  const userServerFilters = get(getRegistryData, 'userServerFilters', false);
  const list = get(registryData, 'list');

  const filter = cloneDeep(get(registryData, 'filter'));

  filter.rawFilterValues = setEmptyRawFilters(filter.rawFilterValues);

  dispatch(
    registryChangeFilterData(
      registryKey,
      filter,
    ),
  );

  const registryDataNew = get(getRegistryState(getState()), registryKey);
  const listNew = get(registryDataNew, 'list');
  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...listNew,
        processed: {
          ...list.processed,
          filterValues: applyFilterFromRaw(filter.rawFilterValues),
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

export const applyFilterValues = (registryKey: string, filterValues: OneRegistryData['list']['processed']['filterValues']): EtsAction<void> => (dispatch, getState) => {
  dispatch(actionUnselectSelectedRowToShow(registryKey, true));
  const registryData = get(getRegistryState(getState()), registryKey);
  const Service = get(registryData, 'Service');
  const getRegistryData = get(Service, 'getRegistryData');
  const userServerFilters = get(getRegistryData, 'userServerFilters', false);
  const filter = get(registryData, 'filter');
  const list = get(registryData, 'list');

  const processed = {
    ...list.processed,
    filterValues,
  };

  if (__DEVELOPMENT__) {
    console.log('SAVE FILTER', processed.filterValues); // tslint:disable-line:no-console
  } else {
    let filterAsString: string | object = '';

    try {
      filterAsString = JSON.stringify(processed.filterValues);
    } catch (e) {
      filterAsString = processed.filterValues;
    }

    console.log('SAVE FILTER', filterAsString); // tslint:disable-line:no-console
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

export const registryToggleIsOpenFilter = (registryKey: string): EtsAction<EtsActionReturnType<typeof registryChangeFilterData>> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const filterState = get(registryData, 'filter');

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

export const registyLoadPrintForm = (registryKey: string, useFiltredData?: boolean): EtsAction<Promise<void>> => async  (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const Service = get(registryData, 'Service');
  const path = get(registryData, 'path') || null;
  const list = get(registryData, 'list');
  const processed = get(list, 'processed');
  const processedArray = get(processed, 'processedArray') || [];

  const getBlobData = (
    get(Service, 'getBlobData')
    || get(Service, 'getRegistryData')
  );
  let blob = null;
  let fileName = '';

  if (getBlobData) {
    const payload = {
      ...Object.entries(getBlobData.payload || {}).reduce(
        (newObj, [key, value]) => {
          if (!isNullOrUndefined(value)) {
            newObj[key] = value;
          }
          return newObj;
        },
        {},
      ),
      format: 'xls',
    };

    if (useFiltredData) {
      const paylaodAsString = Object.entries(payload).reduce(
        (str, [key, payloadData]) => `${str}&${key}=${payloadData}`,
        '',
      ).slice(1);

      const result = await etsLoadingCounter(
        dispatch,
        postBlob(
          `${configStand.backend}/${getBlobData.entity}?${paylaodAsString}`,
          { rows: processedArray },
        ),
        { page: registryKey, path },
      );
      processResponse(result);
      blob = get(result, 'blob', null);
      fileName = get(result, 'fileName', '');
    } else {

      const result = await etsLoadingCounter(
        dispatch,
        getBlob(
          `${configStand.backend}/${getBlobData.entity}`,
          payload,
        ),
        { page: registryKey, path },
      );
      processResponse(result);
      blob = get(result, 'blob', null);
      fileName = get(result, 'fileName', '');
    }
  }

  if (blob && fileName) {
    saveData(blob, fileName);
  }
};

export const registryTriggerOnChangeSelectedField = <F extends Record<string, any>>(registryKey: string, field: OneRegistryData<F>['list']['processed']['sort']['field'], sortable?: boolean): EtsAction<void> => (dispatch, getState) => {
  if (field === 'checkbox') {
    dispatch(
      registryGlobalCheck(registryKey),
    );

    return;
  }
  if (sortable) {
    dispatch(actionUnselectSelectedRowToShow(registryKey, true));
    const registryData = get(getRegistryState(getState()), registryKey);
    const Service = get(registryData, 'Service');
    const getRegistryData = get(Service, 'getRegistryData');
    const userServerFilters = get(getRegistryData, 'userServerFilters', false);
    const list = get(registryData, 'list');

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
  }
};

export const registryCheckLine = <F extends Record<string, any>>(registryKey: string, rowData: F): EtsAction<void> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const list = get(registryData, 'list');
  const data = get(list, 'data');
  const uniqKey = get(data, 'uniqKey');
  const checkedRowsCurrent = get(data, 'checkedRows') || {};

  let checkedRowsNew = { ...checkedRowsCurrent };

  if (!checkedRowsNew[rowData[uniqKey]]) {
    checkedRowsNew[rowData[uniqKey]] = rowData;
  } else {
    delete checkedRowsNew[rowData[uniqKey]];
  }

  if (list.data.proxyCheckData) {
    if (list.data.proxyCheckData === 'mission_template') {
      checkedRowsNew = validateMissionsByCheckedElements(checkedRowsNew, true);
    }
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

export const registryGlobalCheck = (registryKey: string): EtsAction<void> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const Service = get(registryData, 'Service');
  const getRegistryData = get(Service, 'getRegistryData');
  const userServerFilters = get(getRegistryData, 'userServerFilters', false);

  const list = get(registryData, 'list');
  const data = get(list, 'data');
  const uniqKey = get(data, 'uniqKey');
  const paginator = get(list, 'paginator');
  const offset = get(paginator, 'currentPage', 0);
  const checkedRowsCurrent = get(data, 'checkedRows') || {};
  const processed = get(list, 'processed');
  const processedArray = get(processed, 'processedArray') || [];

  let checkedRowsNew = {};
  let checkArray = processedArray;

  if (!getRegistryData || !userServerFilters) {
    checkArray = processedArray.slice(offset * MAX_ITEMS_PER_PAGE, (offset + 1) * MAX_ITEMS_PER_PAGE);
  }

  if (Object.keys(checkedRowsCurrent).length === checkArray.length) {
    checkedRowsNew = {};
  } else {
    checkedRowsNew = checkArray.reduce((newObj, oneData) => {
      newObj[oneData[uniqKey]] = oneData;

      return newObj;
    }, {});
  }

  if (list.data.proxyCheckData) {
    if (list.data.proxyCheckData === 'mission_template') {
      checkedRowsNew = validateMissionsByCheckedElements(checkedRowsNew, true);
    }
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

export const registryChangeGroupActiveColumn = (registryKey: string, payload: {key: string, value: any}): EtsAction<void> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const list = get(registryData, 'list');

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        meta: {
          ...list.meta,
          groupColumn: {
            ...list.meta.groupColumn,
            [payload.key]: payload.value,
          },
        },
      },
    ),
  );
};

// добавление новой строки в реестре, по кнопкке ButtonAddNewRowTable
export const registryAddNewRow = (registryKey: string, payload: { defaultRowValue: any }): EtsAction<void> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const list = get(registryData, 'list');

  let newRowVal = {...payload.defaultRowValue};
  // выводим поля из data на верхний уровень
  if (registryKey === 'InspectCarsConditionsCarsExtendedRegistry') {
    newRowVal = makeInspectCarsConditionExtendedFront(newRowVal);
  }

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        data: {
          ...list.data,
          array: [
            {
              ...newRowVal,
              id: list.data.array.length + 1,
              isNewRow: true,
            },
            ...list.data.array,
          ],
        },
      },
    ),
  );

  dispatch(
    registrySelectRow(
      registryKey,
      newRowVal,
    ),
  );
};

export const registrySelectRow = <F extends Record<string, any>>(registryKey: string, selectedRow: F): EtsAction<Promise<void>> => async (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const list = get(registryData, 'list') as OneRegistryData<F>['list'];

  const data = get(list, 'data');
  const prevRendersFields = get(list, 'rendersFields');
  const uniqKey = get(data, 'uniqKey');
  const prevSelectedRow = get(data, 'selectedRow');

  const isEqualSelectedRow = (
    uniqKey
    && get(selectedRow, uniqKey, 0) === get(prevSelectedRow, uniqKey, 1)
  );

  const list_new: OneRegistryData['list'] = {
    ...list,
    data: {
      ...list.data,
      selectedRow,
    },
    rendersFields: {
      ...list.rendersFields,
      values: selectedRow,
    },
  };

  if (!isEqualSelectedRow) {
    await dispatch(
      registrySelectRowWithPutRequest(
        registryKey,
        list_new,
        prevRendersFields,
      ),
    );
  }

  const children = get(selectedRow, 'children', null);

  if (children && children.length) {
    const listNew = getListData(getRegistryState(getState()), registryKey);

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

export const actionUnselectSelectedRowToShow = <F extends Record<string, any>>(registryKey: string, allReset: boolean): EtsAction<void> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey);
  const list = get(registryData, 'list') as OneRegistryData<F>['list'];

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
          },
        },
      ),
    );
  }
};

export const registryRemoveSelectedRows = <F extends Record<string, any>>(registryKey: string, rows?: F[]): EtsAction<Promise<boolean>> => async (dispatch, getState) => {
  let itemToRemove = rows;

  const registryData = get(getRegistryState(getState()), registryKey) as OneRegistryData<F>;
  const Service = get(registryData, 'Service');
  const list = get(registryData, 'list');
  const data = get(list, 'data');
  const uniqKey: string = get(data, 'uniqKey');

  const removeOneData = (
    get(Service, 'removeOneData')
    || get(Service, 'getRegistryData')
  );

  const pathToLoadingMeta = get(registryData, 'path');

  if (!itemToRemove) {
    const checkedRowsCurrent = get(data, 'checkedRows') || {};
    const selectedRowCurrent = get(data, 'selectedRow');

    itemToRemove = Object.values(checkedRowsCurrent);

    if (!itemToRemove.length && selectedRowCurrent) {
      itemToRemove.push(selectedRowCurrent);
    }
  }

  dispatch(
    actionUnselectSelectedRowToShow(registryKey, true),
  );

  try {
    await Promise.all(
      itemToRemove.map(async ({ [uniqKey]: uniqKeyValue }: F) => {
        let path = `${configStand.backend}/${removeOneData.entity}`;
        const payload: any = {};

        if (('uniqKeyLikeQueryString' in removeOneData) && removeOneData.uniqKeyLikeQueryString) {
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
            { page: registryKey, path: pathToLoadingMeta },
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

export const registryResetSelectedRowToShowInForm = (registryKey: string, isSubmitted: boolean, responseData: any): EtsAction<void> => async (dispatch) => {
  dispatch(
    actionUnselectSelectedRowToShow(
      registryKey,
      isSubmitted,
    ),
  );

  const canUpdateRegistry = registryKey === 'batteryRegistryRegistry' || registryKey === 'tireRegistry';

  const responseDataList = canUpdateRegistry
    ? Array.isArray(responseData)
      ? [ ...responseData ]
      : [ {...responseData} ]
    : [];

  if (isBoolean(isSubmitted) && isSubmitted) {
    dispatch(
      registryLoadDataByKey(registryKey, responseDataList),
    );
  }
};

export const registryChangeObjectExtra = <F extends Record<string, any>>(registryKey: string, partialObjectExtra: Record<string, any>): EtsAction<void> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey) as OneRegistryData<F>;
  const list = get(registryData, 'list');

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        data: {
          ...list.data,
          objectExtra: {
            ...list.data.objectExtra,
            ...partialObjectExtra,
          },
        },
      },
    ),
  );
};

// отправка запроса на обновление строки в реестре при переключении строки в реестре, ответ из PUT записывается в реестр (обновляет строку)
const registrySelectRowWithPutRequest = (registryKey: string, list_new: OneRegistryData['list'], prevRendersFields: OneRegistryData['list']['rendersFields']): EtsAction<any> => async (dispatch) => {
  const meta = get(list_new, 'meta');
  const rowRequestActions = get(meta, 'rowRequestActions');
  const actionCreate = get(rowRequestActions, 'actionCreate');
  const rowRequestActionCreate = get(actionCreate, 'action');
  const rowRequestActionCreatePayload = get(actionCreate, 'payload');
  const actionUpdate = get(rowRequestActions, 'actionUpdate');
  const rowRequestActionUpdate = get(actionUpdate, 'action');
  const rowRequestActionUpdatePayload = get(actionUpdate, 'payload');

  const rendersFieldsValues = get(prevRendersFields, 'values');
  const isNewRow = get(rendersFieldsValues, 'isNewRow', false);

  if ((rowRequestActionUpdate || (isNewRow && rowRequestActionCreate)) && rendersFieldsValues) {
    const listMetaFields = get(meta, 'fields', []);
    const formatedRendersFieldsValues = { ...rendersFieldsValues };

    if (listMetaFields.length) {
      listMetaFields.forEach(({ key, renderParams }) => {
        if (renderParams) {
          let value: any = formatedRendersFieldsValues[key];

          if (renderParams.type === 'number' && value) {
            value = Number(value);
          }
          if (renderParams.type === 'date' && value) {
            value = createValidDate(value);
          }
          if (renderParams.type === 'date' && renderParams.time) {
            value = createValidDateTime(value);
          }
          formatedRendersFieldsValues[key] = value;
        }
      });

      removeEmptyString(formatedRendersFieldsValues);
    }

    try {
      let response = null;
      if (isNewRow) {
        response = await dispatch(
          rowRequestActionCreate(
            {
              ...formatedRendersFieldsValues,
              ...rowRequestActionCreatePayload,
              id: null,
            },
            { page: '', path: '' },
          ),
        );
      } else {
        response = await dispatch(
          rowRequestActionUpdate(
            {
              ...formatedRendersFieldsValues,
              ...rowRequestActionUpdatePayload,
            },
            { page: '', path: '' },
          ),
        );
      }

      let putRes = get(response, 'result.rows.0');

      if (!putRes) {
        throw new Error("Неверный формат даанных с сервера, или пустое значение");
      }

      if (registryKey === 'InspectCarsConditionsCarsExtendedRegistry') {
        putRes = makeInspectCarsConditionExtendedFront(putRes);
      }

      const uniqKey = get(list_new, 'data.uniqKey');
      const arrayWithPutObjList = get(list_new, 'data.array', []).map((elem) => {
        if (elem[uniqKey] === putRes[uniqKey] || elem[uniqKey] === formatedRendersFieldsValues[uniqKey] ) { // во втором условии находим строку(новую) и заменяем полностью объект, что бы не оставался старый id
          return putRes;
        }
        return elem;
      });

      list_new.data.array = arrayWithPutObjList;

      if (isNewRow && !isNullOrUndefined(putRes)) {
        list_new.data.array.push(putRes);
      }

      list_new.data.selectedRow = list_new.data.selectedRow;

    } catch (error) {
      console.error(error); //tslint:disable-line
      return;
    }
  }

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list_new,
      },
    ),
  );
};

export const registryChangeRenderSelectedRow = <F extends Record<string, any>>(registryKey: string, payload: { key: string, value: any }): EtsAction<void> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey) as OneRegistryData<F>;
  const list = get(registryData, 'list');

  const newVal = {
    ...list.rendersFields.values,
    [payload.key]: payload.value,
  };

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        rendersFields: {
          ...list.rendersFields,
          values: newVal,
        },
      },
    ),
  );
};

export const registryChangeRenderOptions = <F extends Record<string, any>>(registryKey: string, payload: {options: any}): EtsAction<void> => (dispatch, getState) => {
  const registryData = get(getRegistryState(getState()), registryKey) as OneRegistryData<F>;
  const list = get(registryData, 'list');

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        rendersFields: {
          ...list.rendersFields,
          options: payload.options,
        },
      },
    ),
  );
};
