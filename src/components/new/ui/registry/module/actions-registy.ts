import {
  REGISTRY_ADD_INITIAL_DATA,
  REGISTRY_REMOVE_DATA,
  REGISTRY_CHANGE_FILTER,
  REGISTRY_CHANGE_LIST,
} from 'components/new/ui/registry/module/registry';
import { saveData } from 'utils/functions';
import { get } from 'lodash';

import { makeDataListAfterLoadInitialData } from 'components/new/ui/registry/module/utils/data';
import { makeProcessedArray } from 'components/new/ui/registry/module/utils/processed';
import allActions from 'redux-main/reducers/actions';

import {
  setEmptyRawFilters,
  applyFilterFromRaw,
} from 'components/new/ui/registry/module/utils/filter';
import {
  mergeFilter,
  mergeHeader,
  mergeList,
} from 'components/new/ui/registry/module/utils/merge';
import { getJSON } from 'api/adapter';
import configStand from 'config';
import { getBlob } from 'api/adapterBlob';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { processResponse } from 'api/APIService';

export const registryAddInitialData: any = ({ registryKey, ...config }) => (dispatch) => {
  if (!config.noInitialLoad) {
    setTimeout(() => (
      dispatch(
        registryLoadDataByKey(registryKey),
      )
    ), 100);
  }

  const mergeConfig: any = {
    Service: config.Service,
    filter: mergeFilter(config.filter),
    header: mergeHeader(config.header),
    trash: config.trash,
  };

  mergeConfig.list = mergeList(config.list, mergeConfig.filter.fields);

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

export const registryLoadDataByKey = (registryKey) => async (dispatch, getState) => {
  const getRegistryData = get(getState(), ['registry', registryKey, 'Service', 'getRegistryData'], null);

  let arrayRaw = null;

  if (getRegistryData) {
    const result = await etsLoadingCounter(
      dispatch,
      getJSON(
        `${configStand.backend}/${getRegistryData.entity}`,
        getRegistryData.payload || {},
      ),
      { page: registryKey },
    );
    const typeAns =  get(getRegistryData, 'typeAns', 'result.rows');

    processResponse(result);
    arrayRaw = get(result, typeAns, []);
  } else {
    const getPath = get(getState(), ['registry', registryKey, 'Service', 'getActionPath'], null);

    if (getPath) {
      const action = get(allActions, getPath, null);
      if (action) {
        const { data } = await dispatch(
          action(
            {},
            { page: registryKey },
          ),
        );

        arrayRaw = data;
      }
    }
  }

  const list: any = get(getState(), ['registry', registryKey, 'list']);

  if (list) {
    const array = arrayRaw.sort((a, b) => a[list.data.uniqKey] - b[list.data.uniqKey]);

    return dispatch(
      registryChangeListData(
        registryKey,
        {
          ...list,
          data: {
            ...list.data,
            ...makeDataListAfterLoadInitialData({ ...list.data, array }),
            array,
          },
          processed: {
            ...list.processed,
            processedArray: array,
            total_count: array.length,
          },
        },
      ),
    );
  }
};

export const registryChangeDataPaginatorCurrentPage = (registryKey, currentPage = 0) => (dispatch, getState) => {
  const { registry: { [registryKey]: registryData } } = getState();

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
};

export const registryChangeListData = (registryKey, list) => ({
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
  const {
    registry: {
      [registryKey]: {
        filter: {...filter},
        list,
      },
    },
  } = getState();

  filter.rawFilterValues = setEmptyRawFilters(filter);

  const processed = {
    ...list.processed,
    filterValues: applyFilterFromRaw(filter),
  };

  dispatch(
    registryChangeFilterData(
      registryKey,
      {
        ...filter,
        rawFilterValues: setEmptyRawFilters(filter),
      },
    ),
  );

  const processedArray = makeProcessedArray(list.data.array, processed, filter.fields);
  const total_count = processedArray.length;

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        processed: {
          ...processed,
          total_count,
          processedArray,
        },
      },
    ),
  );
};

export const registryApplyRawFilters = (registryKey) => (dispatch, getState) => {
  const {
    registry: {
      [registryKey]: {
        list,
        filter,
      },
    },
  } = getState();

  const processed = {
    ...list.processed,
    filterValues: applyFilterFromRaw(filter),
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
  const processedArray = makeProcessedArray(list.data.array, processed, filter.fields);
  const total_count = processedArray.length;

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        processed: {
          ...processed,
          total_count,
          processedArray,
        },
      },
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

export const registyLoadPrintForm = (registryKey) => async  (dispatch, getState) => {
  const getBlobData = get(
    getState(),
    ['registry', registryKey, 'Service', 'getBlobData'],
    get(getState(), ['registry', registryKey, 'Service', 'getRegistryData'], null),
  );
  const getBlobPath = get(getState(), ['registry', registryKey, 'Service', 'getBlobActionPath'], null);
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
  } else {
    if (getBlobPath) {
      const action = get(allActions, getBlobPath, null);

      if (action) {
        const result = await dispatch(
          action(
            { format: 'xls'},
            { page: registryKey },
          ),
        );

        blob = get(result, 'blob', null);
        fileName = get(result, 'fileName', '');
      }
    } else {
      console.warn('не определён путь до экшена для ПФ'); // tslint:disable-line:no-console
    }
  }

  if (blob && fileName) {
    saveData(blob, fileName);
  }
};

export const registryTriggerOnChangeSelectedField = (registryKey, field) => (dispatch, getState) => {
  const { registry: { [registryKey]: { list, filter } } } = getState();

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
        processed: {
          ...processed,
          processedArray: makeProcessedArray(list.data.array, processed, filter.fields),
        },
      },
    ),
  );
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

export const registryResetSelectedRowToShowInForm: any = (registryKey, isSubmitted) => (dispatch, getState) => {
  if (isSubmitted) {
    dispatch(
      registryLoadDataByKey(registryKey),
    );
  }

  dispatch(
    actionUnselectSelectedRowToShow(
      registryKey,
      isSubmitted,
    ),
  );
};
