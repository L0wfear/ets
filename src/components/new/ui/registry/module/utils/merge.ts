import { cloneDeep } from 'lodash';
import { isArray, isBoolean, isObject, isString, isNumber } from 'util';

import registryDefaultObj from 'components/new/ui/registry/module/contant/defaultValues';
import { makeRawFilterValues } from 'components/new/ui/registry/module/utils/filter';
import { makerDataMetaField } from 'components/new/ui/registry/module/utils/meta';
import { OneRegistryData, TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { makeProcessedArray } from './processed';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { displayIfContant } from '../../contants/displayIf';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';

type OtherData = {
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  userData: InitialStateSession['userData'];
};

export const mergeFilter = <F extends Record<string, any>>(filter: TypeConfigData<F>['filter']) => {
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

export const mergeHeader = <F extends Record<string, any>>(header: TypeConfigData<F>['header']): any => (
  header
    ? (
      Object.entries(registryDefaultObj.header).reduce((newObj, [key, value]) => {
        if (key === 'buttons') {
          if (isArray(header[key])) {
            newObj[key] = header[key].map(
              (buttonData) => {
                if (isObject(buttonData)) {
                  return buttonData;
                }

                return {
                  type: buttonData,
                };
              },
            );
          } else {
            newObj[key] = value;
          }
        }

        if (key === 'title') {
          newObj[key] = isString(header[key]) ? header[key] : value;
        }

        if (key === 'titlePopover') {
          newObj[key] = isString(header[key]) ? header[key] : value;
        }

        if (key === 'format') {
          newObj[key] = isString(header[key]) ? header[key] : value;
        }

        return newObj;
      }, {})
    )
    : (
      registryDefaultObj.header
    )
);

export const mergeListData = <F extends Record<string, any>>(data: TypeConfigData<F>['list']['data']): any => (
  data
    ? (
      Object.entries(registryDefaultObj.list.data).reduce((newObj, [key, value]) => {
        if (key === 'fixedWidth') {
          newObj[key] = isBoolean(data[key]) ? data[key] : value;
        }

        if (key === 'proxyCheckData') {
          newObj[key] = isString(data[key]) ? data[key] : value;
        }
        if (key === 'array') {
          newObj[key] = isArray(data[key]) ? data[key] : value;
        }
        if (key === 'objectExtra') {
          newObj[key] = isObject(data[key]) ? data[key] : value;
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
        if (key === 'uniqKeyForSelect') {
          newObj[key] = isString(data[key]) ? data[key] : value;
        }
        if (key === 'disableDoubleClick') {
          newObj[key] = isBoolean(data[key]) ? data[key] : value;
        }
        if (key === 'uniqKeyType') {
          newObj[key] = isString(data[key]) ? data[key] : value;
        }

        if (key === 'uniqKeyForParams') {
          if (isString(data[key])) {
            newObj[key] = data[key];
          } else if (isString(data.uniqKey)) {
            newObj[key] = data.uniqKey;
          } else {
            newObj[key] = value;
          }
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

export const mergeListPermissions = <F extends Record<string, any>>(permissions: TypeConfigData<F>['list']['permissions']) => {
  return permissions;
};

export const mergeListMeta = <F extends Record<string, any>>(meta: Partial<TypeConfigData<F>['list']['meta']>, otherData: OtherData) => {
  const {
    fields = registryDefaultObj.list.meta.fields,
    row_double_click = registryDefaultObj.list.meta.row_double_click,
    rowRequestActions = registryDefaultObj.list.meta.rowRequestActions,
    renderFieldsSchema = registryDefaultObj.list.meta.renderFieldsSchema,
    is_render_field = registryDefaultObj.list.meta.is_render_field,
    selected_row_in_params = registryDefaultObj.list.meta.selected_row_in_params,
    groupColumn = registryDefaultObj.list.meta.groupColumn,
  } = meta || {};

  const fieldsFiltred = (fields as any).reduce(
    (newArr, fieldData) => {
      let formatedTitle = null;

      // добить childrenFields

      if ('title' in fieldData) {
        const { title } = fieldData;
        if (isArray(title)) {
          formatedTitle = title.reduce((filtredTitle, titleSomeValue) => {
            const { displayIf } = titleSomeValue;

            if (displayIf === displayIfContant.isKgh && otherData.userData.isKgh) {
              return titleSomeValue.title;
            }
            if (displayIf === displayIfContant.isOkrug && otherData.userData.isOkrug) {
              return titleSomeValue.title;
            }
            if (displayIf === displayIfContant.lenghtStructureMoreOne && otherData.STRUCTURES.length) {
              return titleSomeValue.title;
            }

            return filtredTitle;
          }, null);
        } else {
          formatedTitle = title;
        }

        if ('displayIfPermission' in fieldData) {
          const { displayIfPermission } = fieldData;
          if (isString(displayIfPermission) || isArray(displayIfPermission)) {
            formatedTitle = validatePermissions(displayIfPermission, otherData.userData.permissionsSet) ? formatedTitle : null;
          }
        }
      }

      if (formatedTitle || ('key' in fieldData && fieldData.key === 'checkbox')) {
        newArr.push({
          ...fieldData,
          title: formatedTitle,
        });
      }
      return newArr;
    },
    [],
  );

  return {
    ...makerDataMetaField(fieldsFiltred),
    row_double_click,
    rowRequestActions,
    selected_row_in_params,
    is_render_field,
    renderFieldsSchema,
    groupColumn,
  };
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

export const mergeListProcessed = (processed: Partial<OneRegistryData['list']['processed']>) => {
  let processedNew = cloneDeep(registryDefaultObj.list.processed);

  if (processed) {
    processedNew = Object.entries(registryDefaultObj.list.processed).reduce((newObj, [key, value]: any) => {
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
            field: isString(processed[key].field) ? processed[key].field : value.field,
            reverse: isBoolean(processed[key].reverse) ? processed[key].reverse : value.reverse,
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
    }, {});
  }

  return processedNew;
};

export const mergeList = <F extends Record<string, any>>(list: TypeConfigData<F>['list'], fields: OneRegistryData['filter']['fields'], otherData: OtherData): any => {
  const listNew: Partial<OneRegistryData['list']> = {};

  listNew.data = mergeListData(list.data);
  listNew.permissions = mergeListPermissions(list.permissions);
  listNew.meta = mergeListMeta(list.meta, otherData);
  listNew.paginator = mergeListPaginator(list.paginator);
  listNew.processed = mergeListProcessed(list.processed);

  listNew.processed.processedArray = makeProcessedArray(listNew.data.array, listNew.processed, fields);
  listNew.processed.total_count = listNew.processed.processedArray.length;

  return listNew;
};
