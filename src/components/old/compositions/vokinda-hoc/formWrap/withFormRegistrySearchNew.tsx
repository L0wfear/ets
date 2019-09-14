import * as React from 'react';
import { isFunction } from 'util';

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

type TypeConfig = {
  // uniqKeyName?: string;                               // имя уникального ключа для формы (см выше)
  // hideWithClose?: string[];
  cant_create?: boolean;                                  // может ли форма создать запись
  no_find_in_arr?: boolean;                               // не искать данные по элементу в списке реестра (пробросить с getRecordAction в withForm)
  add_path: string;                                       // path для формы
};

export type WithFormRegistrySearchAddPropsWithoutWithSerach<F> = {
  registryKey: string;
  page: string;                                           // page для лоудинга
  path: string;                                           // path для лоудинга
  handleHide: (isSubmitted: boolean, result?: F) => any;
  element: F;
};

export type WithFormRegistrySearchAddProps<F> = (
  WithFormRegistrySearchAddPropsWithoutWithSerach<F>
  & WithSearchProps
);

export type WithFormRegistrySearchProps<F = any> = {
  registryKey: string;
  handleHide?: WithFormRegistrySearchAddProps<F>['handleHide'];
  path?: string;
};

export const withFormRegistrySearchNew = <PropsOwn extends WithFormRegistrySearchProps<F>, F extends any>(config: TypeConfig) => (
  (Component: React.ComponentType<PropsOwn & WithFormRegistrySearchAddProps<F>>) => {
    const ComponentWrap: React.FC<PropsOwn & WithSearchProps>  = React.memo(
      (props) => {
        const [element, setElement] = React.useState<F>(null);
        const path = `${props.path ? `${props.path}-` : ''}${config.add_path}-form`;

        const dispatch = etsUseDispatch();
        const isLoading = etsUseSelector(
          (state) => (
            !getRootRegistry(getRegistryState(state), props.registryKey, true)
            || getRootRegistry(getRegistryState(state), props.registryKey).isLoading
            || !getListData(getRegistryState(state), props.registryKey).data.array[0]
          ),
        );
        const array: any[] = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).data.array);
        const uniqKey: string = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).data.uniqKey);
        const uniqKeyForParams = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).data.uniqKeyForParams);
        const permissions = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).permissions);
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

        const param_uniq_value_prev = usePrevious(param_uniq_value);
        const isLoading_prev = usePrevious(isLoading);

        const isPermittedToCreate = etsUseIsPermitted(permissions.create) && hasButtonToCreate;
        const isPermittedToRead = etsUseIsPermitted(permissions.read);
        const isPermittedToUpdate = etsUseIsPermitted(permissions.update);
        const isPermittedToSee = (
          isPermittedToRead
          || isPermittedToUpdate
        );

        const handleHide: WithFormRegistrySearchAddProps<F>['handleHide'] = React.useCallback(
          (isSubmitted, response) => {
            setElement(null);
            props.setParams({
              [uniqKeyForParams]: null,
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

        React.useEffect(
          () => {
            if (!isLoading) {
              const triggerOnUpdate = (
                param_uniq_value
                && (
                  param_uniq_value !== param_uniq_value_prev
                  || isLoading !== isLoading_prev
                )
              );

              if (triggerOnUpdate) {
                if (param_uniq_value === buttonsTypes.create) {
                  if (isPermittedToCreate && !config.cant_create) {
                    setElement({} as any);
                  } else {
                    global.NOTIFICATION_SYSTEM.notify('Действие запрещено', 'warning', 'tr');
                    handleHide(false);
                  }
                } else {
                  const param_uniq_value_number = Number(param_uniq_value);
                  const elementPick = array.find(({ [uniqKey]: id }) => id === param_uniq_value_number);

                  if (elementPick || config.no_find_in_arr) {
                    if (isPermittedToSee) {
                      if (elementPick) {
                        setElement(elementPick);
                      } else {
                        setElement({
                          [uniqKey]: param_uniq_value_number,
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
