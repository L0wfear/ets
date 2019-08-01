import { isArray, isString, isObject, isNullOrUndefined } from 'util';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { diffDatesByDays } from 'utils/dates';

type ArrayRegisrty<F> = OneRegistryData<F>['list']['data']['array'];
type FilterValues<F> = OneRegistryData<F>['list']['processed']['filterValues'];
type FilterFields<F> = OneRegistryData<F>['filter']['fields'];

// для массивов работает по частичному совпадению
export const filterArray = <F extends any>(array: ArrayRegisrty<F>, filter_values: FilterValues<F>, filter_fields: FilterFields<F>) => {
  const filterValauesEntries = Object.entries(filter_values);

  // console.log(filter_values)
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

          switch (fieldsAsObj[valueKey].type) {
            case 'multiselect': {
              if (isArray(row[valueKey])) {
                if (row[valueKey][0] && isObject(row[valueKey][0]) && 'id' in row[valueKey][0]) {
                  return value.every((oneValue) => !row[valueKey].some(({ id }) => id === oneValue));
                }
                return value.every((oneValue) => !row[valueKey].includes(oneValue));
              }
              return !value.includes(row[valueKey]);
            }
            default: throw new Error('non define filter by type');
          }
        }
        if (valueKeyType.match(/__like$/)) {
          const valueKey = valueKeyType.replace(/__like$/, '');

          switch (fieldsAsObj[valueKey].type) {
            case 'advanced-select-like': {
              const sliceValue = isString(value) ? value.slice(1, -1) : null;
              if (sliceValue && isString(row[valueKey])) {
                return !row[valueKey].includes(sliceValue);
              }

              return true;
            }
            case 'advanced-string-like': return !row[valueKey] || row[valueKey] && isString(row[valueKey]) && !row[valueKey].includes(value);
            default: throw new Error('non define filter by type');
          }
        }
        if (valueKeyType.match(/__eq$/)) {
          const valueKey = valueKeyType.replace(/__eq$/, '');
          if (isNullOrUndefined(value)) {
            return false;
          }

          switch (fieldsAsObj[valueKey].type) {
            case 'advanced-number': {
              return value !== row[valueKey];
            }
            case 'advanced-date': return diffDatesByDays(value, row[valueKey]) !== 0;
            default: throw new Error('non define filter by type');
          }
        }
        if (valueKeyType.match(/__neq$/)) {
          const valueKey = valueKeyType.replace(/__neq$/, '');
          if (isNullOrUndefined(value)) {
            return false;
          }

          switch (fieldsAsObj[valueKey].type) {
            case 'advanced-number': return !(value !== row[valueKey]);
            case 'advanced-date': return !(diffDatesByDays(value, row[valueKey]) !== 0);
            default: throw new Error('non define filter by type');
          }
        }
        if (valueKeyType.match(/__gt$/)) {
          const valueKey = valueKeyType.replace(/__gt$/, '');
          if (isNullOrUndefined(value)) {
            return false;
          }

          switch (fieldsAsObj[valueKey].type) {
            case 'advanced-number': return value >= row[valueKey];
            case 'advanced-date': {
              return !(diffDatesByDays(row[valueKey], value) > 0);
            }
            default: throw new Error('non define filter by type');
          }
        }
        if (valueKeyType.match(/__lt$/)) {
          const valueKey = valueKeyType.replace(/__lt$/, '');
          if (isNullOrUndefined(value)) {
            return false;
          }

          if (isNullOrUndefined(row[valueKey])) {
            return true;
          }

          switch (fieldsAsObj[valueKey].type) {
            case 'advanced-number': return value <= row[valueKey];
            case 'advanced-date': return diffDatesByDays(value, row[valueKey]) <= 0;
            default: throw new Error('non define filter by type');
          }
        }

        console.log('НЕ ОПРЕДЕЛЕНА ФИЛЬТРАЦИЯ ДЛЯ ТИПА', valueKeyType); // tslint:disable-line:no-console
        return false;
      });
    });
  }

  return [...array];
};
