import registryDefaultObj from 'components/new/ui/registry/module/contant/defaultValues';
import { isArray, isBoolean, isObject, isString, isNumber } from 'util';
import { makeRawFilterValues } from 'components/new/ui/registry/module/utils/filter';
import { makerDataMetaField } from 'components/new/ui/registry/module/utils/meta';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

export const mergeFilter = (filter: OneRegistryData['filter']) => {
  const rawFilterValues = makeRawFilterValues(filter);

  if (!filter) {
    return {
      ...registryDefaultObj.filter,
      ...rawFilterValues,
    };
  }

  return (
    Object.entries(registryDefaultObj.filter).reduce((newObj, [key, value]) => {
      if (key === 'fields') {
        newObj[key] = isArray(filter[key]) ? filter[key] : value;
      }
      if (key === 'isOpen') {
        newObj[key] = isBoolean(filter[key]) ? filter[key] : value;
      }
      if (key === 'displayIf') {
        if (isString(filter[key])) {
          newObj[key] = [filter[key]];
        } else if (isArray(filter[key])) {
          newObj[key] = filter[key];
        } else {
          newObj[key] = value;
        }
      }
      if (key === 'rawFilterValues') {
        const { rawFilterValues: outRawFilterValues } = filter;

        newObj[key] = Object.entries(rawFilterValues).reduce((newObjByKey, [valueKey, typesObj]) => {
          newObjByKey[valueKey] = Object.entries(typesObj).reduce((newObjValues, [type, typeData]) => {
            if (outRawFilterValues && outRawFilterValues[valueKey] && outRawFilterValues[valueKey][type]) {
              newObjValues[type] = {
                ...outRawFilterValues[valueKey][type],
              };
            } else {
              newObjValues[type] = typeData;
            }

            return newObjValues;
          }, {});

          return newObjByKey;
        }, {});
      }

      return newObj;
    }, {})
  );
};

export const mergeHeader = (header: OneRegistryData['header']) => (
  header
  ? (
    Object.entries(registryDefaultObj.header).reduce((newObj, [key, value]) => {
      if (key === 'buttons') {
        if (isArray(header[key])) {
          newObj[key] = header[key].map((buttonData) => {
            if (!isObject(buttonData) && isString(buttonData)) {
              return {
                type: buttonData,
              };
            }

            return buttonData;
          });
        } else {
          newObj[key] = value;
        }
      }

      if (key === 'title') {
        newObj[key] = isString(header[key]) ? header[key] : value;
      }

      return newObj;
    }, {})
  )
  : (
    registryDefaultObj.header
  )
);

export const mergeListData = (data: OneRegistryData['list']['data']) => (
  data
  ? (
    Object.entries(registryDefaultObj.list.data).reduce((newObj, [key, value]) => {
      if (key === 'array') {
        newObj[key] = isArray(data[key]) ? data[key] : value;
      }
      if (key === 'total_count') {
        if (isArray(data.array)) {
          newObj[key] = data.array.length;
        } else {
          newObj[key] = isNumber(data[key]) ? data[key] : value;
        }
      }
      if (key === 'uniqKey') {
        newObj[key] = isString(data[key]) ? data[key] : value;
      }

      if (key === 'selectedRow') {
        newObj[key] = isObject(data[key]) ? data[key] : value;
      }
      if (key === 'selectedUniqKey') {
        newObj[key] = isObject(data[key]) ? data[key] : value;
      }

      if (key === 'checkedRows') {
        newObj[key] = isObject(data[key]) ? data[key] : value;
      }

      return newObj;
    }, {})
  )
  : (
    registryDefaultObj.list.data
  )
);

export const mergeListPermissions = (permissions: OneRegistryData['list']['permissions']) => {
  return permissions;
};

export const mergeListMeta = (meta: OneRegistryData['list']['meta']) => {
  const {
    fields = registryDefaultObj.list.meta.fields,
  } = meta || {};

  return makerDataMetaField({ fields });
};

export const mergeListPaginator = (paginator: OneRegistryData['list']['paginator']) => (
  paginator
  ? (
    Object.entries(registryDefaultObj.list.paginator).reduce((newObj, [key, value]) => {
      if (key === 'currentPage') {
        newObj[key] = isString(paginator[key]) ? paginator[key] : value;
      }
      if (key === 'perPage') {
        newObj[key] = isString(paginator[key]) ? paginator[key] : value;
      }

      return newObj;
    }, {})
  )
  : (
    registryDefaultObj.list.paginator
  )
);

export const mergeListProcessed = (processed: OneRegistryData['list']['processed']) => (
  processed
  ? (
    Object.entries(registryDefaultObj.list.processed).reduce((newObj, [key, value]: any) => {
      if (key === 'filterValues') {
        if (processed[key] && isObject(processed[key])) {
          newObj[key] = processed[key];
        } else {
          newObj[key] = value;
        }
      }
      if (key === 'processedArray') {
        newObj[key] = isArray(newObj[key]) ? newObj[key] : value;
      }
      if (key === 'sort') {
        if (isObject(processed[key])) {
          newObj[key] = {
            field: isString(processed[key].field) || value.field,
            reverse: isBoolean(processed[key].reverse) || value.reverse,
          };
        } else {
          newObj[key] = value;
        }
      }

      if (key === 'total_count') {
        if (isArray(processed.processedArray)) {
          newObj[key] = processed.processedArray.length;
        } else {
          newObj[key] = isNumber(processed[key]) ? processed[key] : value;
        }
      }

      return newObj;
    }, {})
  )
  : (
    registryDefaultObj.list.processed
  )
);

export const mergeList = (list: OneRegistryData['list']) => ({
  data: mergeListData(list.data),
  permissions: mergeListPermissions(list.permissions),
  meta: mergeListMeta(list.meta),
  paginator: mergeListPaginator(list.paginator),
  processed: mergeListProcessed(list.processed),
});
