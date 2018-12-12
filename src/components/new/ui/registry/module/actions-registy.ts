import {
  REGISTRY_ADD_INITIAL_DATA,
  REGISTRY_REMOVE_DATA,
  REGISTRY_CHANGE_FILTER,
  REGISTRY_CHANGE_LIST,
} from 'components/new/ui/registry/module/registry';
import { saveData } from 'utils/functions';

import { makeDataListAfterLoadInitialData } from 'components/new/ui/registry/module/utils/data';
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

export const registryAddInitialData: any = ({ registryKey, ...config }) => (dispatch) => {
  if (!config.noInitialLoad) {
    setTimeout(() => (
      dispatch(
        registryLoadDataByKey(registryKey),
      )
    ), 100);
  }

  return dispatch({
    type: REGISTRY_ADD_INITIAL_DATA,
    payload: {
      registryKey,
      config: {
        Service: config.Service,
        filter: mergeFilter(config.filter),
        header: mergeHeader(config.header),
        list: mergeList(config.list),
        trash: config.trash,
      },
    },
  });
};

export const registryRemoveData = (registryKey) => ({
  type: REGISTRY_REMOVE_DATA,
  payload: {
    registryKey,
  },
});

export const registryLoadDataByKey = (registryKey) => (dispatch, getState) => {
  const { registry: { [registryKey]: { Service } } } = getState();

  return dispatch({
    type: '',
    payload: Service.get()
      .then((ans) => {
        const {
          result: { rows: array },
        } = ans;

        const { registry: { [registryKey]: { list } } } = getState();

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
      }),
    meta: {
      promise: true,
      page: 'registry',
    },
  });
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

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        processed: {
          ...processed,
          processedArray: makeProcessedArray(list.data.array, processed),
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

  dispatch(
    registryChangeListData(
      registryKey,
      {
        ...list,
        processed: {
          ...processed,
          processedArray: makeProcessedArray(list.data.array, processed),
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

export const registyLoadPrintForm = (registryKey) => (dispatch, getState) => {
  const { registry: { [registryKey]: { Service } } } = getState();

  return dispatch({
    type: '',
    payload: Service.getBlob({ format: 'xls'})
      .then((ans) => {
        saveData(ans.blob, ans.fileName);

        return ans;
      }),
    meta: {
      promise: true,
      page: 'registry',
    },
  });
};

export const registryTriggerOnChangeSelectedField = (registryKey, field) => (dispatch, getState) => {
  const { registry: { [registryKey]: { list } } } = getState();

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
          processedArray: makeProcessedArray(list.data.array, processed),
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

export const registryResetSelectedRowToShowInForm: any = (registryKey, isSubmited) => (dispatch, getState) => {
  const {
    registry: {
      [registryKey]: {
        list,
      },
    },
  } = getState();

  if (isSubmited) {
    dispatch(
      registryLoadDataByKey(registryKey),
    );
    dispatch(
      registryChangeListData(
        registryKey,
        {
          ...list,
          data: {
            ...list.data,
            selectedRow: null,
            checkedRows: {},
            selectedRowToShow: null,
          },
        },
      ),
    );
  } else {
    dispatch(
      registryChangeListData(
        registryKey,
        {
          ...list,
          data: {
            ...list.data,
            selectedRowToShow: null,
          },
        },
      ),
    );
  }
};
