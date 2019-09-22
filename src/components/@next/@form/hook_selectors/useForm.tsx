import * as React from 'react';
import { get } from 'lodash';

import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import {
  getFormDataByKey,
  getFormDataIsCreatingByKey,
  getFormDataIsPermittedToCreateByKey,
  getFormDataIsPermittedToUpdateByKey,
  getFormDataIsPermittedByKey,
  getFormDataMetaByKey,
  getFormDataFormStateByKey,
  getFormDataFormErrorsByKey,
  getFormDataCanSaveByKey,
  getFormDataFormStatePickValueByKey,
  getFormDataOriginFormStateByKey,
} from 'redux-main/reducers/modules/form_data_record/selectors';
import { actionChangeFormState, mapFormMeta, actionSubmitFormState } from 'redux-main/reducers/modules/form_data_record/actions';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { isObject } from 'util';

/* _______________ селекторы хуки _______________ */

/**
 * formData по ключу
 */
const useFormData = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const formContext = etsUseSelector((state) => getFormDataByKey<F>(state, formDataKey));

  return formContext;
};

/**
 * получение флага 'Создаётся ли элемент' формы
 */
const useFormDataIsCreating = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const IS_CREATING = etsUseSelector((state) => getFormDataIsCreatingByKey<F>(state, formDataKey));

  return IS_CREATING;
};

/**
 * получение флага 'Создаётся ли элемент' формы
 */
const useFormDataTitle = (formDataKey: FormKeys) => {
  const IS_CREATING = useFormDataIsCreating(formDataKey);
  const title = mapFormMeta[formDataKey].schema.header.title;

  return IS_CREATING ? title.update : title.update;
};

/**
 * получение разрешения на создание формы
 */
const useFormDataSchemaIsPermittedToCreate = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const isPermittedToCreate = etsUseSelector((state) => getFormDataIsPermittedToCreateByKey<F>(state, formDataKey));

  return isPermittedToCreate;
};

/**
 * получение разрешения на редактирование формы
 */
const useFormDataSchemaIsPermittedToUpdate = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const isPermittedToUpdate = etsUseSelector((state) => getFormDataIsPermittedToUpdateByKey<F>(state, formDataKey));

  return isPermittedToUpdate;
};

/**
 * получение разрешения на измнение формы
 */
const useFormDataSchemaIsPermitted = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const isPermitted = etsUseSelector((state) => getFormDataIsPermittedByKey<F>(state, formDataKey));

  return isPermitted;
};

/**
 * получение функции изменения формы
 */
const useFormDataHandleChange = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const dispatch = etsUseDispatch();

  return React.useCallback(
    (partialFormState: Partial<F> | keyof F, value?: F[keyof F]) => {
      if (isObject(partialFormState)) {
        dispatch(
          actionChangeFormState<F>(
            formDataKey,
            partialFormState as Partial<F> ,
          ),
        );
      } else {
        const partialFormStateNew = {
          [partialFormState as keyof F]: get(value, 'target.value', value),
        } as Partial<F> ;
        dispatch(
          actionChangeFormState<F>(
            formDataKey,
            partialFormStateNew,
          ),
        );
      }
    },
    [],
  );
};

/**
 * получение meta формы
 */
const useFormDataMeta = <F extends Record<string, any> = any>(formDataKey: FormKeys) => {
  const meta = etsUseSelector((state) => getFormDataMetaByKey(state, formDataKey));

  return meta;
};

/**
 * получение функции сабмита формы
 */
const useFormDataHandleSubmitPromise = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const dispatch = etsUseDispatch();

  return React.useCallback(
    (...arg) => {
      return dispatch(actionSubmitFormState(formDataKey, ...arg));
    },
    [],
  );
};

/**
 * получение функции измнения значение стора формы
 */
const useFormDataHandleChangeStore = <Store extends Record<string, any> = {}>(formDataKey: FormKeys) => {
  // const dispatch = etsUseDispatch();

  return React.useCallback(
    (partialStore: Partial<Store>) => {
      // dispatch(
      //   actionChangeFormStore<object>(
      //     formDataKey,
      //     partialStore,
      //   ),
      // )
    },
    [],
  );
};

/**
 * получение состояния зачений формы (formState)
 */
const useFormDataFormState = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const formState = etsUseSelector((state) => getFormDataFormStateByKey<F>(state, formDataKey));

  return formState;
};

/**
 * получение состояния зачений формы (originalFormState)
 */
const useFormDataOriginalFormState = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const originalFormState = etsUseSelector((state) => getFormDataOriginFormStateByKey<F>(state, formDataKey));

  return originalFormState;
};

/**
 * получение состояния значения формы (formState) по ключу (key)
 */
const useFormDataFormStatePickValue = <F extends Record<string, any>, ReturnType>(formDataKey: FormKeys, key: keyof F) => {
  const pickValue: ReturnType = etsUseSelector((state) => getFormDataFormStatePickValueByKey<F>(state, formDataKey, key));

  return pickValue;
};

/**
 * получение состояния ошибок (formErrors)
 */
const useFormDataFormErrors = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const formErrors = etsUseSelector((state) => getFormDataFormErrorsByKey<F>(state, formDataKey));

  return formErrors;
};

/**
 * получение состояния ошибок (formErrors)
 */
const useFormDataFormErrorsPickValue = <F extends Record<string, any>, ReturnType>(formDataKey: FormKeys, key: keyof F) => {
  const pirckError: ReturnType = etsUseSelector((state) => getFormDataFormErrorsByKey<F>(state, formDataKey)[key]);

  return pirckError;
};

/**
 * получение статуса возможности сабмита формы
 */
const useFormDataCanSave = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const canSave = etsUseSelector((state) => getFormDataCanSaveByKey<F>(state, formDataKey));

  return canSave;
};

/**
 * получение статуса возможности изменения формы
 */
const useFormDataIsPermitted = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const isPermitted = etsUseSelector((state) => getFormDataIsPermittedByKey<F>(state, formDataKey));

  return isPermitted;
};

/**
 * получение глобального стора формы
 */
const useFormDataStore = <F extends Record<string, any>>(formDataKey: FormKeys) => {
  const store: any = null; // etsUseSelector((state) => getFormDataStoreByKey<F>(state, formDataKey));

  return store;
};

/**
 * получение значения из глобального стора формы
 */
const useFormDataStorePickValue = <F extends Record<string, any>>(formDataKey: FormKeys, key: string) => {
  const storePickValue: any = null; // etsUseSelector((state) => getFormDataStoreByKey<F>(state, formDataKey)[key]);

  return storePickValue;
};

const useFormDataLoadOptions = <Store extends Record<string, any>, K extends keyof Store>(formDataKey: FormKeys, key: K, hookData: Store[K]) => {
  const optionData = hookData;
  const handleChangeStore = useFormDataHandleChangeStore<Store>(formDataKey);

  React.useEffect(
    () => {
      const partialStore: Partial<Store> = {};
      partialStore[key] = optionData;

      handleChangeStore(partialStore);
    },
    [handleChangeStore, optionData],
  );

  return optionData;
};

export default {
  useFormData,
  useFormDataIsCreating,
  useFormDataHandleChangeStore,
  useFormDataMeta,
  useFormDataOriginalFormState,
  useFormDataFormState,
  useFormDataFormStatePickValue,
  useFormDataFormErrors,
  useFormDataFormErrorsPickValue,
  useFormDataIsPermitted,
  useFormDataHandleChange,
  useFormDataCanSave,
  useFormDataHandleSubmitPromise,
  useFormDataSchemaIsPermittedToCreate,
  useFormDataSchemaIsPermittedToUpdate,
  useFormDataSchemaIsPermitted,

  useFormDataStore,
  useFormDataStorePickValue,
  useFormDataLoadOptions,
  useFormDataTitle,
};
