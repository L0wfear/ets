import { isArray, isString, isObject, isNullOrUndefined } from 'util';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { diffDatesByDays } from 'utils/dates';

type ArrayRegisrty<F> = OneRegistryData<F>['list']['data']['array'];
type FilterValues<F> = OneRegistryData<F>['list']['processed']['filterValues'];
type FilterFields<F> = OneRegistryData<F>['filter']['fields'];

const filterArrayByIn = <F extends any>(row_value: any, filter_value: any, field_data: ValuesOf<FilterFields<F>>) => {
  if (field_data.type === 'multiselect') {
    if (isArray(row_value)) {
      if (row_value[0] && isObject(row_value[0]) && 'id' in row_value[0]) {
        return filter_value.every((oneValue) => !row_value.some(({ id }) => id === oneValue));
      }
      return filter_value.every((oneValue) => !row_value.includes(oneValue));
    }
    return !filter_value.includes(row_value);
  }
  throw new Error('non define filter by type');
};

const filterArrayByLike = <F extends any>(row_value: any, filter_value: any, field_data: ValuesOf<FilterFields<F>>) => {
  if (field_data.type === 'advanced-select-like') {
    const sliceValue = isString(filter_value) ? filter_value.slice(1, -1) : null;
    if (sliceValue && isString(row_value)) {
      return !row_value.includes(sliceValue);
    }

    return true;
  }
  if (field_data.type === 'advanced-string-like') {
    return !row_value || row_value && isString(row_value) && !row_value.includes(filter_value);
  }

  throw new Error('non define filter by type');
};

const filterArrayByEq = <F extends any>(row_value: any, filter_value: any, field_data: ValuesOf<FilterFields<F>>) => {
  if (isNullOrUndefined(filter_value)) {
    return false;
  }

  if (field_data.type === 'advanced-number') {
    return filter_value !== row_value;
  }
  if (field_data.type === 'advanced-date') {
    return diffDatesByDays(filter_value, row_value) !== 0;
  }
  throw new Error('non define filter by type');
};

const filterArrayByNeq = <F extends any>(row_value: any, filter_value: any, field_data: ValuesOf<FilterFields<F>>) => {
  if (isNullOrUndefined(filter_value)) {
    return false;
  }

  return !filterArrayByEq(row_value, filter_value, field_data);
};

const filterArrayByGt = <F extends any>(row_value: any, filter_value: any, field_data: ValuesOf<FilterFields<F>>) => {
  if (isNullOrUndefined(filter_value)) {
    return false;
  }

  if (field_data.type === 'advanced-number') {
    return filter_value >= row_value;
  }
  if (field_data.type === 'advanced-date') {
    return !(diffDatesByDays(row_value, filter_value) > 0);
  }
  throw new Error('non define filter by type');
};

const filterArrayByLt = <F extends any>(row_value: any, filter_value: any, field_data: ValuesOf<FilterFields<F>>) => {
  if (isNullOrUndefined(filter_value)) {
    return false;
  }

  if (isNullOrUndefined(row_value)) {
    return true;
  }

  if (field_data.type === 'advanced-number') {
    return filter_value <= row_value;
  }
  if (field_data.type === 'advanced-date') {
    return diffDatesByDays(filter_value, row_value) <= 0;
  }
  throw new Error('non define filter by type');
};

// для массивов работает по частичному совпадению
export const filterArray = <F extends any>(array: ArrayRegisrty<F>, filter_values: FilterValues<F>, filter_fields: FilterFields<F>) => {
  const filterValauesEntries = Object.entries(filter_values);

  if (filterValauesEntries.length > 0) {
    const fieldsAsObj = filter_fields.reduce((newObj: any, fieldData) => {
      newObj[fieldData.valueKey] = fieldData;

      return newObj;
    }, {});

    return array.filter((row) => {
      return !filterValauesEntries.some(([valueKeyType, value]) => {    //  если заваливается хотя бы на 1 фильтре
        // описываем проигрышные варианты
        if (valueKeyType.match(/__in$/)) {
          const valueKey = valueKeyType.replace(/__in$/, '');
          const row_value = row[valueKey];
          const field_data = fieldsAsObj[valueKey];

          return filterArrayByIn(row_value, value, field_data);
        }
        if (valueKeyType.match(/__like$/)) {
          const valueKey = valueKeyType.replace(/__like$/, '');
          const row_value = row[valueKey];
          const field_data = fieldsAsObj[valueKey];

          return filterArrayByLike(row_value, value, field_data);
        }
        if (valueKeyType.match(/__eq$/)) {
          const valueKey = valueKeyType.replace(/__eq$/, '');
          const row_value = row[valueKey];
          const field_data = fieldsAsObj[valueKey];

          return filterArrayByEq(row_value, value, field_data);
        }
        if (valueKeyType.match(/__neq$/)) {
          const valueKey = valueKeyType.replace(/__neq$/, '');
          const row_value = row[valueKey];
          const field_data = fieldsAsObj[valueKey];

          return filterArrayByNeq(row_value, value, field_data);
        }
        if (valueKeyType.match(/__gt$/)) {
          const valueKey = valueKeyType.replace(/__gt$/, '');
          const row_value = row[valueKey];
          const field_data = fieldsAsObj[valueKey];

          return filterArrayByGt(row_value, value, field_data);
        }
        if (valueKeyType.match(/__lt$/)) {
          const valueKey = valueKeyType.replace(/__lt$/, '');
          const row_value = row[valueKey];
          const field_data = fieldsAsObj[valueKey];

          return filterArrayByLt(row_value, value, field_data);
        }

        console.log('НЕ ОПРЕДЕЛЕНА ФИЛЬТРАЦИЯ ДЛЯ ТИПА', valueKeyType); // tslint:disable-line:no-console
        return false;
      });
    });
  }

  return [...array];
};
