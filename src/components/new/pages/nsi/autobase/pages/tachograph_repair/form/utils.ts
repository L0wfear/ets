import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';
import { TachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import { uniqBy } from 'lodash';

import { TachographList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';

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
    return uniqBy(
      data.map((rowData) => ({
        value: rowData.id,
        label: rowData.tachograph_brand_name,
        rowData,
      })),
      'label',
    );
  }

  if (key === 'factoryNumbers') {
    const tachograph_brand_name = data.find(
      (el) => el.id === state.tachograph_id
    )?.tachograph_brand_name;
    const dataList = state.tachograph_id
      ? data.filter((el) => el.tachograph_brand_name === tachograph_brand_name)
      : data;
    return dataList.map(({ factory_number }) => {
      return ({
        value: factory_number,
        label: factory_number,
      });
    });
  }
};
type Props = {
  tachographBrandNameList: Array<TachographList>;
  tachographBrandNameOptions: Array<{value: string | number; label: string;}>;
  handleChange: any;
  state: any;
  setTachographFactoryNumberOptions: React.Dispatch<React.SetStateAction<Array<{value: string | number; label: string;}>>>;
};
export const setTachographBrandNameAndTachographFactoryNumberOptions = (props: Props) => {
  const {
    tachographBrandNameList,
    state,
    tachographBrandNameOptions,
    handleChange,
    setTachographFactoryNumberOptions,
  } = props;
  if (tachographBrandNameList.length) {
    const tachographFactoryNumberOptions = getOptions(tachographBrandNameList, state, 'factoryNumbers'); 
    setTachographFactoryNumberOptions(tachographFactoryNumberOptions);
    if (!state.tachograph_id && state.factory_number) {
      const tachograph_brand_name = tachographBrandNameList.find(
        (el) => el.factory_number === state.factory_number
      )?.tachograph_brand_name;
      const tachograph_id = tachographBrandNameOptions.find(
        (el) => el.label === tachograph_brand_name
      )?.value;
      handleChange('tachograph_id', tachograph_id);
    }
    if (state.tachograph_id) {
        
      if (
        !tachographFactoryNumberOptions.find(
          (el) => el.value === state.factory_number
        )
      ) {
        handleChange('factory_number', null);
      }
    } 
  }
};
