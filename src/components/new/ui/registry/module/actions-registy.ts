import {
  REGISTRY_ADD_INITIAL_DATA,
  REGISTRY_REMOVE_DATA,
  REGISTRY_CHANGE_FILTER,
  REGISTRY_CHANGE_LIST,
} from 'components/new/ui/registry/module/registry';
import { saveData } from 'utils/functions';
import { get } from 'lodash';

import { makeProcessedArray } from 'components/new/ui/registry/module/utils/processed';

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
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';

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
  const registryData = get(getState(), `registry.${registryKey}`, null);
  const getRegistryData = get(registryData, 'Service.getRegistryData', null);
  const list: any = get(registryData, 'list', null);

  let arrayRaw = null;
  let total_count = 0;

  if (getRegistryData) {
    let payload = {};
    if (getRegistryData.payload) {
      payload = {
        ...getRegistryData.payload,
      };
    }
    if (getRegistryData.userServerFilters) {
      const offset: any = get(list, 'paginator.currentPage', 0);
      const filterValues: any = get(list, 'processed.filterValues', {}) || {};
      const sort: any = get(list, 'processed.sort', {}) || {};

      payload = {
        ...payload,
        limit: MAX_ITEMS_PER_PAGE,
        offset,
        sort_by: sort.field ? `${sort.field}:${sort.reverse ? 'desc' : 'asc'}` : '',
        filter: JSON.stringify(filterValues),
      };
    }

    const result = await etsLoadingCounter(
      dispatch,
      getJSON(
        `${configStand.backend}/${getRegistryData.entity}`,
        payload,
      ),
      { page: registryKey },
    );
    const typeAns =  get(getRegistryData, 'typeAns', 'result.rows');

    processResponse(result);
    arrayRaw = get(result, typeAns, []);
    if (getRegistryData.userServerFilters) {
      total_count =  get(result, 'total_count', 0);
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

  if (list) {
    const array = arrayRaw.sort((a, b) => a[list.data.uniqKey] - b[list.data.uniqKey]);
    return dispatch(
      registryChangeListData(
        registryKey,
        {
          ...list,
          data: {
            ...list.data,
            total_count,
            array,
          },
          processed: {
            ...list.processed,
            processedArray: array,
            total_count: getRegistryData.userServerFilters ? total_count : array.length,
          },
        },
      ),
    );
  }
};

export const registryChangeDataPaginatorCurrentPage = (registryKey, currentPage = 0) => (dispatch, getState) => {
  const { registry: { [registryKey]: registryData } } = getState();
  const getRegistryData = get(getState(), ['registry', registryKey, 'Service', 'getRegistryData'], null);

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

  if (getRegistryData.userServerFilters) {
    dispatch(
      registryLoadDataByKey(registryKey),
    );
  }
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
  const registyData = get(getState(), ['registry', registryKey], null);
  const getRegistryData = get(registyData, 'Service.getRegistryData', null);
  const filter = {
    ...get(registyData, 'filter', {}),
  };
  const list = get(registyData, 'list', null);

  filter.rawFilterValues = setEmptyRawFilters(filter);

  const processed = {
    ...list.processed,
    filterValues: applyFilterFromRaw(filter),
  };

  if (!getRegistryData.userServerFilters) {
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

  if (getRegistryData.userServerFilters) {
    dispatch(
      registryLoadDataByKey(registryKey),
    );
  }
};

export const registryApplyRawFilters = (registryKey) => (dispatch, getState) => {
  const registyData = get(getState(), ['registry', registryKey], null);
  const getRegistryData = get(registyData, 'Service.getRegistryData', null);
  const filter = get(registyData, 'filter', {});
  const list = get(registyData, 'list', null);

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

  if (!getRegistryData.userServerFilters) {
    processed.processedArray = makeProcessedArray(list.data.array, processed, filter.fields);
    processed.total_count = processed.processedArray.length;
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

  if (getRegistryData.userServerFilters) {
    dispatch(
      registryLoadDataByKey(registryKey),
    );
  }
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
  const registyData = get(getState(), ['registry', registryKey], null);
  const getRegistryData = get(registyData, 'Service.getRegistryData', null);
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

  if (!getRegistryData.userServerFilters) {
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

  if (getRegistryData.userServerFilters) {
    dispatch(
      registryLoadDataByKey(registryKey),
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
