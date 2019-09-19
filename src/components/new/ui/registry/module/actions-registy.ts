import { get, keyBy, uniqBy, uniq } from 'lodash';
import { isBoolean, isNullOrUndefined } from 'util';

import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

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
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { createValidDate, createValidDateTime } from 'components/@next/@utils/dates/dates';
import { makeInspectCarsConditionExtendedFront } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_promise';
import { ConsumableMaterialWrap, ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { getFrontNorm } from 'redux-main/reducers/modules/some_uniq/norm_registry/promise';
import { removeEmptyString } from 'redux-main/reducers/modules/form_data_record/actions';

/**
 * Да простят меня боги
 * @todo сделать нормально
 */

export const registryAddInitialData: any = ({ registryKey, ...config }) => (dispatch, getState) => {
  const STRUCTURES = getSessionStructuresOptions(getState());
  const userData = getSessionState(getState()).userData;

  const mergeConfig: any = {
    isLoading: !config.noInitialLoad,
    Service: config.Service,
    path: config.path || null,
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

export const actionSetRequestTime = (registryKey, idRequestTime) => ({
  type: REGISTRY_SET_ID_REQUEST_TIME,
  payload: {
    registryKey,
    idRequestTime,
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

export const actionChangeGlobalPaylaodInServiceData = (registryKey, payload, needUpdate = true): EtsAction<any> => (dispatch, getState) => {
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

export const registryLoadDataByKey: any = (registryKey, responseDataList: any[] = []) => async (dispatch, getState) => {
  // const stateSome = getState();
  dispatch(
    actionSetLoadingStatus(registryKey, true),
  );
  dispatch(
    actionUnselectSelectedRowToShow(registryKey, true),
  );
  const idRequestTime = +(new Date());
  dispatch(
    actionSetRequestTime(registryKey, idRequestTime),
  );

  const registryData = get(getState(), `registry.${registryKey}`, null);
  const path = get(registryData, 'path', null);
  const getRegistryData = get(registryData, 'Service.getRegistryData', null);
  const userServerFilters = get(getRegistryData, 'userServerFilters', false);
  const list: any = get(registryData, 'list', null);
  const uniqKey = list.data.uniqKey;

  let arrayRaw = null;
  let objectExtra = {};
  let total_count = 0;

  if (getRegistryData) {
    let payload = {};
    if (getRegistryData.payload) {
      payload = {
        ...Object.entries(getRegistryData.payload).reduce(
          (newObj, [key, value]) => {
            if (!isNullOrUndefined(value)) {
              newObj[key] = value;
            }
            return newObj;
          },
          {},
        ),
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
        { page: registryKey, noTimeout: isBoolean(getRegistryData.noTimeout) ? getRegistryData.noTimeout : true, path },
      );
    } catch (error) {
      console.error(error); //tslint:disable-line
    }

    const idRequestTimeOld = get(getState(), `registry.${registryKey}.idRequestTime`, null);

    if (idRequestTime !== idRequestTimeOld) {
      return;
    }

    const typeAns = get(getRegistryData, 'typeAns', 'result.rows');
    const typeExtra = get(getRegistryData, 'typeExtra', 'result.extra');

    processResponse(result);

    const arrayRawResult = get(result, typeAns, []);

    const newDataObj = keyBy(responseDataList, uniqKey);

    arrayRaw = arrayRawResult.map(
      (resultElem) => {
        return newDataObj[resultElem[uniqKey]] || resultElem;
      },
    );

    objectExtra = get(result, typeExtra, {});

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
        break;
      }
      case 'mission': {
        arrayRaw = arrayRaw.map(getFrontMission);
        break;
      }
      case 'cars_condition_extended': {
        arrayRaw = arrayRaw.map(makeInspectCarsConditionExtendedFront);
        break;
      }
      case 'inspect_act_scan': {
        arrayRaw = arrayRaw.reduce(
          (newArr, { files = [] }) => {
            files.forEach(
              (file) => {
                if (file.kind === 'act_scan') {
                  newArr.push({
                    id: file.id,
                    files: [file],
                    name: file.name,
                    notes: file.notes,
                    url: file.url,
                  });
                }
              },
            );

            return newArr;
          },
          [],
        );
        break;
      }
      case 'consumable_material_wrap': {
        arrayRaw = (arrayRaw as ConsumableMaterial[]).map(
          (rowData): ConsumableMaterialWrap => ({
            ...rowData,
            technical_operation_ids: uniqBy(rowData.norms, 'technical_operation_id')
              .map(({ technical_operation_id }) => technical_operation_id),
            technical_operation_names: uniqBy(rowData.norms, 'technical_operation_name')
              .map(({ technical_operation_name }) => technical_operation_name),
            municipal_facility_ids: uniqBy(rowData.norms, 'municipal_facility_id')
              .map(({ municipal_facility_id }) => municipal_facility_id),
            municipal_facility_names: uniqBy(rowData.norms, 'municipal_facility_name')
              .map(({ municipal_facility_name }) => municipal_facility_name),
            to_element: uniq(
              rowData.norms.map(({ technical_operation_name, municipal_facility_name }) => (
                `${technical_operation_name}[${municipal_facility_name}]`
              )),
            ),
          }),
        );
      }
    }

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
            objectExtra,
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

export const registryChangeListData = (registryKey: string, listRaw: OneRegistryData['list']): EtsAction<void> => (dispatch, getState) => {
  const registyData = get(getState(), ['registry', registryKey]);
  const getRegistryData = get(registyData, 'Service.getRegistryData');
  const userServerFilters = get(getRegistryData, 'userServerFilters', false);
  const filter = get(registyData, 'filter');
  const listOld = get(registyData, 'list', null);

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

export const registyLoadPrintForm = (registryKey, useFiltredData?: boolean): EtsAction<Promise<void>> => async  (dispatch, getState) => {
  const getBlobData = get(
    getState(),
    ['registry', registryKey, 'Service', 'getBlobData'],
    get(getState(), ['registry', registryKey, 'Service', 'getRegistryData'], null),
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
    const registryData = get(getState(), `registry.${registryKey}`, null);
    const path = get(registryData, 'path', null);

    if (useFiltredData) {
      const list: any = get(registryData, 'list', null);
      const processedArray: any = get(list, 'processed.processedArray', {}) || {};

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

export const registryTriggerOnChangeSelectedField = (registryKey, field, sortable?: boolean) => (dispatch, getState) => {
  if (field === 'checkbox') {
    dispatch(
      registryGlobalCheck(registryKey),
    );

    return;
  }
  if (sortable) {
    dispatch(
      actionUnselectSelectedRowToShow(registryKey, true),
    );

    const registyData = get(getState(), ['registry', registryKey], null);
    const getRegistryData = get(registyData, 'Service.getRegistryData', null);
    const userServerFilters = get(getRegistryData, 'userServerFilters', false);
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

export const registryCheckLine: any = (registryKey, rowData) => (dispatch, getState) => {
  const registryData: OneRegistryData = get(getState(), `registry.${registryKey}`, null);
  const list = get(registryData, 'list');
  const uniqKey: any = get(list, 'data.uniqKey', null);
  const checkedRowsCurrent: any = get(list, 'data.checkedRows', {});

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

export const registryChangeGroupActiveColumn: any = (registryKey, payload: {key: string, value: any}) => (dispatch, getState) => {
  const {
    registry: {
      [registryKey]: {
        list,
      },
    },
  } = getState();

  const newVal = {
    ...list.meta.groupColumn,
    [payload.key]: payload.value,
  };

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        meta: {
          ...list.meta,
          groupColumn: {
            ...newVal,
          },
        },
      },
    ),
  );
};

// добавление новой строки в реестре, по кнопкке ButtonAddNewRowTable
export const registryAddNewRow: any = (registryKey, payload: { defaultRowValue, }) => (dispatch, getState) => {
  const {
    registry: {
      [registryKey]: {
        list,
      },
    },
  } = getState();
  let newRowVal = {...payload.defaultRowValue};
  // выводим поля из data на верхний уровень
  if (registryKey === 'InspectCarsConditionsCarsExtendedRegistry') {
    newRowVal = makeInspectCarsConditionExtendedFront(newRowVal);
  }
  // const customKeyId = list.rendersFields.values.length;
  const newRow = {
    ...newRowVal,
    id: list.data.array.length + 1,
    isNewRow: true,
  };

  const newListRegistry = {
    data: {
      ...list.data,
      array: [
        newRow,
        ...list.data.array,
      ],
    },
  };

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        ...newListRegistry,
      },
    ),
  );

};

export const registrySelectRow = <F extends Record<string, any>>(registryKey: string, selectedRow: F): EtsAction<Promise<void>> => async (dispatch, getState) => {
  const list = getListData(getRegistryState(getState()), registryKey) as OneRegistryData<F>['list'];

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
  const pathToLoadingMeta = get(registryData, 'path', null);

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

export const registryResetSelectedRowToShowInForm: any = (registryKey, isSubmitted, responseData) => async (dispatch, getState) => {
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

export const registryChangeObjectExtra = (registryKey: string, partialObjectExtra: Record<string, any>): EtsAction<void> => (dispatch, getState) => {
  const list = getListData(getRegistryState(getState()), registryKey);

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

export const registryChangeRenderSelectedRow = (registryKey: string, payload: { key: string, value: any }): EtsAction<void> => (dispatch, getState) => {
  const list = getListData(getRegistryState(getState()), registryKey);

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

export const registryChangeRenderOptions = (registryKey: string, payload: {options: any}): EtsAction<void> => (dispatch, getState) => {
  const list = getListData(getRegistryState(getState()), registryKey);

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
