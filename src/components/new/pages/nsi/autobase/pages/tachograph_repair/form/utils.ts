import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';
import { TachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import { uniqBy } from 'lodash';

export const defaultTachographRepair: TachographRepair = {
  comment: '',
  factory_number: '',
  gov_number: '',
  id: null,
  repair_date: '',
  repair_reason_id: null,
  repair_reason_name: '',
  tachograph_brand_name: '',
  tachograph_id: null,
};

export const getDefaultTachographRepairElement = (element: Partial<TachographRepair>): TachographRepair => {
  const newElement = cloneDeep(defaultTachographRepair);
  if (isObject(element)) {
    Object.keys(defaultTachographRepair).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};

export const getOptions = (data, state, key) => {
  if (key === 'brands') {
    const dataList = state.factory_number
      ? data.filter(({ factory_number }) => factory_number === state.factory_number)
      : data;

    return uniqBy(
      dataList.map((rowData) => ({
        value: rowData.tachograph_brand_name,
        label: rowData.tachograph_brand_name,
        rowData,
      })),
      'value',
    );
  }

  if (key === 'factoryNumbers') {
    const dataList = state.tachograph_brand_name
      ? data.filter(({ tachograph_brand_name }) => tachograph_brand_name === state.tachograph_brand_name)
      : data;
    return dataList.map(({ factory_number }) => {
      return ({
        value: factory_number,
        label: factory_number,
      });
    });
  }
};
