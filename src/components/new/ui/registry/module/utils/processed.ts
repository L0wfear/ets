import { isNullOrUndefined, isArray, isString, isObject } from 'util';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { diffDatesByDays } from 'utils/dates';
import { get } from 'lodash';
import { sortArray } from 'components/@next/@ui/registry/utils/sort/sort';

export const filterArray = (array, filterValues, fields: OneRegistryData['filter']['fields']) => {
  const filterValauesEntries = Object.entries<any>(filterValues);

  if (filterValauesEntries.length > 0) {
    const fieldsAsObj = fields.reduce((newObj, fieldData) => {
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
              const sliceValue = value.slice(1, -1);
              return !row[valueKey].includes(sliceValue);
            }
            case 'advanced-string-like': return !row[valueKey] || row[valueKey] && isString(row[valueKey]) && !row[valueKey].includes(value);
            case 'multiselect': return !row[valueKey].includes(value);
            default: throw new Error('non define filter by type');
          }
        }
        if (valueKeyType.match(/__eq$/)) {
          const valueKey = valueKeyType.replace(/__eq$/, '');

          switch (fieldsAsObj[valueKey].type) {
            case 'advanced-number': return value !== row[valueKey];
            case 'advanced-date': return diffDatesByDays(value, row[valueKey]) !== 0;
            default: throw new Error('non define filter by type');
          }
        }
        if (valueKeyType.match(/__neq$/)) {
          const valueKey = valueKeyType.replace(/__neq$/, '');

          switch (fieldsAsObj[valueKey].type) {
            case 'advanced-number': return !(value !== row[valueKey]);
            case 'advanced-date': return !(diffDatesByDays(value, row[valueKey]) !== 0);
            default: throw new Error('non define filter by type');
          }
        }
        if (valueKeyType.match(/__gt$/)) {
          const valueKey = valueKeyType.replace(/__gt$/, '');

          switch (fieldsAsObj[valueKey].type) {
            case 'advanced-number': return value >= row[valueKey];
            case 'advanced-date': return diffDatesByDays(value, row[valueKey]) >= 0;
            default: throw new Error('non define filter by type');
          }
        }
        if (valueKeyType.match(/__lt$/)) {
          const valueKey = valueKeyType.replace(/__lt$/, '');

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

export const makeProcessedArray = (array, { sort, filterValues }: Pick<OneRegistryData['list']['processed'], 'sort' | 'filterValues'>, fields: OneRegistryData['filter']['fields']) => {
  let processedArray = filterArray(array, filterValues, fields);

  if (sort.field) {
    if (processedArray.some(({ [sort.field]: fieldValue }: any) => !isNullOrUndefined(fieldValue))) {
      processedArray.sort((a, b) =>
        sortArray(
          sort.reverse ? b : a,
          sort.reverse ? a : b,
          sort.field,
        ),
      );
    }

    if (processedArray.some(({ children }) => isArray(children) && children.length)) {
      processedArray = processedArray.map((rowData) => {
        const children = get(rowData, 'children', null);
        if (children) {
          const rowDataTemp =  {
            ...rowData,
            children: makeProcessedArray(children, { sort, filterValues }, fields),
          };

          rowDataTemp.is_open = false;

          return rowDataTemp;
        }
      });
    }
  }

  return processedArray;
};
