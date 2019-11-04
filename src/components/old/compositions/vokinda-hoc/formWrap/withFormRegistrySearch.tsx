import * as React from 'react';
import { isFunction, isBoolean } from 'util';

import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';
import PreloaderMainPage from 'components/old/ui/PreloaderMainPage';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData, getRootRegistry, getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import { registryResetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

type TypeConfig = {
  cant_create?: boolean;                                  // может ли форма создать запись
  no_find_in_arr?: boolean;                               // не искать данные по элементу в списке реестра (пробросить с getRecordAction в withForm)
  add_path: FormKeys | string;                            // path для формы
  replace_uniqKey_on?: string;                             // имя уникального ключа для формы
  search_which_need_to_remove?: Array<string>;            // Что удалить из search при закрытии формы
};

export type WithFormRegistrySearchAddPropsWithoutWithSerach<F> = {
  registryKey: string;
  page: string;                                           // page для лоудинга
  path: string;                                           // path для лоудинга
  meta?: LoadingMeta;                                      // для будущего лоудинга
  handleHide: (isSubmitted: boolean, result?: F) => any;
  element: F;
  type?: string | null;
};

export type WithFormRegistrySearchAddProps<F> = (
  WithFormRegistrySearchAddPropsWithoutWithSerach<F>
  & WithSearchProps
);

export type WithFormRegistrySearchProps<F = any> = {
  uniqKeyForParams?: string;
  permissions?: OneRegistryData['list']['permissions'];
  registryKey: string;
  handleHide?: WithFormRegistrySearchAddProps<F>['handleHide'];
  path?: string;
};

const findRecondInDeepArray = <F extends any>(array: Array<F>, uniqKey: keyof F, uniqKeyValue: F[keyof F]) => {
  const children = [];

  const selectedItem = array.find((rowData) => {
    if (rowData[uniqKey] === uniqKeyValue) {
      return true;
    }
    if ('children' in rowData) {
      children.push(...rowData.children);
    }
  });

  if (selectedItem) {
    return selectedItem;
  }
  if (children[0]) {
    return findRecondInDeepArray(children, uniqKey, uniqKeyValue);
  }

  return null;
};

export const withFormRegistrySearch = <PropsOwn extends WithFormRegistrySearchProps<F>, F extends any>(config: TypeConfig) => (
  (Component: React.ComponentType<PropsOwn & WithFormRegistrySearchAddProps<F>>) => {
    const ComponentWrap: React.FC<PropsOwn & WithSearchProps>  = React.memo(
      (props) => {
        const [element, setElement] = React.useState<F>(null);
        const path = `${props.path ? `${props.path}-` : ''}${config.add_path}-form`;

        const dispatch = etsUseDispatch();

        const array: Array<any> = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).data.array);
        const uniqKey: string = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).data.uniqKey);
        const uniqKeyForParams = etsUseSelector((state) => props.uniqKeyForParams || getListData(getRegistryState(state), props.registryKey).data.uniqKeyForParams);
        const permissions = etsUseSelector((state) => props.permissions || getListData(getRegistryState(state), props.registryKey).permissions);
        const hasButtonToCreate = etsUseSelector((state) => {
          const buttons = getHeaderData(getRegistryState(state), props.registryKey).buttons;
          return (
            buttons.some((buttonData) => (
              buttonsTypes.create === buttonData.type
              || buttonsTypes.mission_create === buttonData.type
            ))
          );
        });
        const param_uniq_value = props.match.params[uniqKeyForParams];
        const type = props.match.params.type;
        const param_uniq_value_prev = usePrevious(param_uniq_value);

        const isPermittedToCreate = etsUseIsPermitted(permissions.create) && hasButtonToCreate;
        const isPermittedToRead = etsUseIsPermitted(permissions.read);
        const isPermittedToUpdate = etsUseIsPermitted(permissions.update);
        const isPermittedToSee = (
          isPermittedToRead
          || isPermittedToUpdate
        );

        const isLoading = etsUseSelector(
          (state) => (
            !getRootRegistry(getRegistryState(state), props.registryKey, true)
            || (
              (                                                                               // проверяем есть ли реестр
                (
                  getRootRegistry(getRegistryState(state), props.registryKey).isLoading
                  || !getListData(getRegistryState(state), props.registryKey).data.array[0]
                )
                && !config.no_find_in_arr                                                     // можно не дожидаться загрузки реестра, чтобы отобразить форму
              )
              && param_uniq_value !== buttonsTypes.create                                     // для создания не нужен весь реестр
            )
          ),
        );
        const isLoading_prev = usePrevious(isLoading);

        const handleHide: WithFormRegistrySearchAddProps<F>['handleHide'] = React.useCallback(
          (isSubmittedRaw, response) => {
            const isSubmitted = isBoolean(isSubmittedRaw) ? isSubmittedRaw : false;
            setElement(null);
            props.setParamsAndSearch({
              params: {
                [uniqKeyForParams]: null,
              },
              search: Object.fromEntries(
                (config.search_which_need_to_remove || []).map((name) => [name, null]),
              ),
            });

            dispatch(
              registryResetSelectedRowToShowInForm(props.registryKey, isSubmitted, response),
            );

            if (isFunction(props.handleHide)) {
              props.handleHide(isSubmitted, response);
            }
          },
          [props.match.params, props.setParams, uniqKeyForParams],
        );

        // React.useEffect(
        //   () => {
        //     if (type && !buttonsTypes[type]) {
        //       handleHide(false);
        //     }
        //   },
        //   [handleHide],
        // );

        React.useEffect(
          () => {
            if (!isLoading) {
              const triggerOnUpdate = (
                param_uniq_value !== param_uniq_value_prev
                || isLoading !== isLoading_prev
              );

              if (triggerOnUpdate) {
                if (param_uniq_value_prev && !param_uniq_value) {
                  handleHide(false);
                  return;
                }
                if (param_uniq_value) {
                  if (param_uniq_value === buttonsTypes.create) {
                    if (isPermittedToCreate && !config.cant_create) {
                      setElement({} as any);
                    } else {
                      global.NOTIFICATION_SYSTEM.notify('Действие запрещено', 'warning', 'tr');
                      handleHide(false);
                    }
                  } else {
                    const param_uniq_value_number = Number(param_uniq_value);
                    const elementPick = findRecondInDeepArray(array, uniqKey, param_uniq_value_number);

                    if (elementPick || config.no_find_in_arr) {
                      if (isPermittedToSee) {
                        if (elementPick) {
                          setElement(elementPick);
                        } else {
                          setElement({
                            [config.replace_uniqKey_on || uniqKey]: param_uniq_value_number,
                          } as any);
                        }
                      } else {
                        global.NOTIFICATION_SYSTEM.notify('Действие запрещено', 'warning', 'tr');
                        handleHide(false);
                      }
                    } else {
                      global.NOTIFICATION_SYSTEM.notify('Выбранная запись не найдена', 'info', 'tr');
                      handleHide(false);
                    }
                  }
                }
              }
            }
          },
          [
            isPermittedToCreate,
            isPermittedToSee,
            isLoading,
            isLoading_prev,
            param_uniq_value,
            param_uniq_value_prev,
            array,
            handleHide,
          ],
        );

        const meta = React.useMemo(
          () => ({
            page: props.registryKey,
            path,
          }),
          [props.registryKey, path],
        );

        return (
          <ErrorBoundaryForm>
            <React.Suspense fallback={<PreloaderMainPage />}>
              {
                element && (
                  <Component
                    {...props}
                    page={props.registryKey}
                    path={path}
                    handleHide={handleHide}
                    element={element}
                    type={type}

                    meta={meta}
                  />
                )
              }
            </React.Suspense>
          </ErrorBoundaryForm>
        );
      },
    );

    return withSearch<PropsOwn>(ComponentWrap);
  }
);
