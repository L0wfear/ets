import * as React from 'react';
import { connect } from 'react-redux';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { getListData, getServiceData, getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { registryResetSelectedRowToShowInForm, registryLoadOneData } from 'components/new/ui/registry/module/actions-registy';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { isNullOrUndefined } from 'util';
import { DivNone } from 'global-styled/global-styled';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { get } from 'lodash';

type WithFormRegistrySearchConfig = {
  cantCreate?: boolean;                   // может ли форма создать запись
  noCheckDataInRegistryArray?: boolean;   // не искать данные по элементу в списке реестра (пробросить с getRecordAction в withForm)
  uniqKeyName?: string;                   // имя уникального ключа для формы (см выше)
  hideWithClose?: string[];
};

let lasPermissions = {};
let lastPermissionsArray = [];

const getPermissionsCreateReadUpdate = (permission) => {
  if (lasPermissions !== permission) {
    lasPermissions = permission;

    lastPermissionsArray = [permission.create, permission.read, permission.update];
  }

  return lastPermissionsArray;
};

const reduceArrayToObj = (newObj, rowData, uniqKey) => {
  return {
    ...newObj,
    [rowData[uniqKey]]: rowData,
    ...get(rowData, 'children', []).reduce(
      (newObjChild, rowDataChild) => reduceArrayToObj(newObjChild, rowDataChild, uniqKey),
      {},
    ),
  };
};

const findRecondInDeepArray = (array: any[], uniqKey, uniqKeyValue) => {
  return array.reduce(
    (newObj, rowData) => reduceArrayToObj(newObj, rowData, uniqKey),
    {},
  )[uniqKeyValue];
};

// вызов тригерится на ключ в url
export const withFormRegistrySearch = <P extends any>(config: WithFormRegistrySearchConfig) => (Component) => (
  compose<any, { registryKey: string, uniqKeyForParams?: string, permissions?: { [k: string]: string } } & P>(
    withSearch,
    connect<any, any, { registryKey: string, uniqKeyForParams?: string, permissions?: { [k: string]: string } }, ReduxState>(
      (state, { registryKey, uniqKeyForParams, permissions }) => ({
        getOneData: getServiceData(state.registry, registryKey).getOneData,
        array: getListData(state.registry, registryKey).data.array,
        buttons: getHeaderData(state.registry, registryKey).buttons,
        data: getListData(state.registry, registryKey).data,
        uniqKey: getListData(state.registry, registryKey).data.uniqKey,
        uniqKeyForParams: uniqKeyForParams || getListData(state.registry, registryKey).data.uniqKeyForParams,
        permissions: getPermissionsCreateReadUpdate(permissions || getListData(state.registry, registryKey).permissions), //  прокидывается в следующий компонент
      }),
      (dispatch: any) => ({
        registryResetSelectedRowToShowInForm: (...arg) => (
          dispatch(
            registryResetSelectedRowToShowInForm(
              ...arg,
            ),
          )
        ),
        registryLoadOneData: (...arg) => (
          dispatch(
            registryLoadOneData(
              ...arg,
            ),
          )
        ),
      }),
    ),
    withRequirePermissionsNew(),
  )(
    ({ registryResetSelectedRowToShowInForm: registryResetSelectedRowToShowInFormProps, array, uniqKey, uniqKeyForParams, ...props}) => {
      const [element, setElement] = React.useState(null);
      const uniqKeyValue = getNumberValueFromSerch(props.match.params[uniqKeyForParams]);
      const type = props.match.params.type;

      React.useEffect(
        () => {
          if (props.match.params[uniqKeyForParams] === buttonsTypes.create && props.buttons.length) {
            if (props.buttons.includes(buttonsTypes.create) || props.buttons.includes(buttonsTypes.mission_create) || props.buttons.includes(buttonsTypes.company_structure_create) && !config.cantCreate) {
              setElement({});
            } else {
              global.NOTIFICATION_SYSTEM.notify('Действие запрещено', 'warning', 'tr');
              props.setParams(
                { [uniqKeyForParams]: null },
                'replace',
              );
            }
            return;
          }

          if (!isNullOrUndefined(uniqKeyValue)) {
            if (config.noCheckDataInRegistryArray) {
              setElement({
                [config.uniqKeyName || uniqKeyForParams]: uniqKeyValue,
              });
              return;
            }

            if (array.length) {
              const newElement = findRecondInDeepArray(array, uniqKey, uniqKeyValue);
              if (newElement || config.noCheckDataInRegistryArray) {
                setElement(newElement);
                return;
              }

              if (props.getOneData) {
                props.registryLoadOneData(props.registryKey, uniqKeyValue).then((responseElement) => {
                  if (responseElement) {
                    setElement(responseElement);
                  } else {
                    global.NOTIFICATION_SYSTEM.notify('Выбранная запись не найдена', 'info', 'tr');
                    handleHide(false);
                  }
                });
              } else {
                global.NOTIFICATION_SYSTEM.notify('Выбранная запись не найдена', 'info', 'tr');
                handleHide(false);
              }
            } else if (element) {
              setElement(null);
            }
          }
        },
        [props.match.params[uniqKeyForParams], uniqKeyValue, array],
      );
      const handleHide = React.useCallback(
        (isSubmitted: boolean, response?: any) => {
          setElement(null);

          props.setParams({
            [uniqKeyForParams]: null,
          });
          props.setParamsAndSearch({
            params: { [uniqKeyForParams]: null },
            search: (
              config.hideWithClose
                ? (
                  config.hideWithClose.reduce(
                    (newObj, key) => {
                      newObj[key] = null;

                      return newObj;
                    },
                    {},
                  )
                )
                : {}
            ),
          });

          registryResetSelectedRowToShowInFormProps(props.registryKey, isSubmitted, response);
        },
        [uniqKeyForParams, props.setParamsAndSearch, props.match.params, props.searchState],
      );

      return element
        ? (
          <Component
            {...props}
            type={type}
            element={element}
            onFormHide={handleHide}
          />
        )
        : (
          <DivNone />
        );
    },
  )
);

export default withFormRegistrySearch;
