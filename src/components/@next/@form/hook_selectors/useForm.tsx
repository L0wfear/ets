import * as React from 'react';

import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import {
  getFormDataByKey,
  getFormDataShemaByKey,
  getFormDataShemaBodyByKey,
  getFormDataShemaHeaderByKey,
  getFormDataShemaFooterByKey,
  getFormDataShemaBodyFieldsByKey,
  getFormDataIsCreatingByKey,
  getFormDataIsPermittedToCreateByKey,
  getFormDataIsPermittedToUpdateByKey,
  getFormDataIsPermittedByKey,
  getFormDataHandleHideByKey,
  getFormDataHandleSubmitPromiseByKey,
  getFormDataMetaByKey,
  getFormDataFormStateByKey,
  getFormDataFormErrorsByKey,
  getFormDataCanSaveByKey,
  getFormDataStoreByKey,
  getFormDataBsSizeFormByKey,
  getFormDataFormStatePickValueByKey,
} from 'redux-main/reducers/modules/form_data_record/selectors';
import { actionChangeFormState, actionChangeFormStore, actionRemoveFormData } from 'redux-main/reducers/modules/form_data_record/actions';
import { defaultAction } from 'redux-main/default.actions';

/* _______________ селекторы хуки _______________ */

/**
 * formData по ключу
 */
const useFormData = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formContext = etsUseSelector((state) => getFormDataByKey<F, Store>(state, formDataKey));

  return formContext;
};

/**
 * получение схемы formData
 */
const useFormDataSchema = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const schema = etsUseSelector((state) => getFormDataShemaByKey<F, Store>(state, formDataKey));

  return schema;
};

/**
 * полуение шапки схемы
 */
const useFormDataSchemaHeader = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const header = etsUseSelector((state) => getFormDataShemaHeaderByKey<F, Store>(state, formDataKey));

  return header;
};

/**
 * полуение тела схемы
 */
const useFormDataSchemaBody = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const body = etsUseSelector((state) => getFormDataShemaBodyByKey<F, Store>(state, formDataKey));

  return body;
};
/**
 * получение полей формы из тела схемы
 */
const useFormDataSchemaBodyFields = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const fields = etsUseSelector((state) => getFormDataShemaBodyFieldsByKey<F, Store>(state, formDataKey));

  return fields;
};

/**
 * полуение футера схемы
 */
const useFormDataSchemaFooter = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const footer = etsUseSelector((state) => getFormDataShemaFooterByKey<F, Store>(state, formDataKey));

  return footer;
};

/**
 * получение флага 'Создаётся ли элемент' формы
 */
const useFormDataSchemaIsCreating = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const IS_CREATING = etsUseSelector((state) => getFormDataIsCreatingByKey<F, Store>(state, formDataKey));

  return IS_CREATING;
};

/**
 * получение разрешения на создание формы
 */
const useFormDataSchemaIsPermittedToCreate = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const isPermittedToCreate = etsUseSelector((state) => getFormDataIsPermittedToCreateByKey<F, Store>(state, formDataKey));

  return isPermittedToCreate;
};

/**
 * получение разрешения на редактирование формы
 */
const useFormDataSchemaIsPermittedToUpdate = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const isPermittedToUpdate = etsUseSelector((state) => getFormDataIsPermittedToUpdateByKey<F, Store>(state, formDataKey));

  return isPermittedToUpdate;
};

/**
 * получение разрешения на измнение формы
 */
const useFormDataSchemaIsPermitted = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const isPermitted = etsUseSelector((state) => getFormDataIsPermittedByKey<F, Store>(state, formDataKey));

  return isPermitted;
};

/**
 * получение разрешения на измнение формы
 */
const useFormDataBsSizeForm = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const bsSizeForm = etsUseSelector((state) => getFormDataBsSizeFormByKey<F, Store>(state, formDataKey));

  return bsSizeForm;
};

/**
 * получение функции закрытия формы
 */
const useFormDataSchemaHandleHide = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const handleHide = etsUseSelector((state) => getFormDataHandleHideByKey<F, Store>(state, formDataKey));
  const dispatch = etsUseDispatch();

  return React.useCallback(
    (...arg: Parameters<typeof handleHide>) => {
      handleHide(...arg);
      dispatch(
        actionRemoveFormData(
          formDataKey,
        ),
      );
    },
    [],
  );
};

/**
 * получение функции изменения формы
 */
const useFormDataHandleChange = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const dispatch = etsUseDispatch();

  return React.useCallback(
    (partialFormState: Partial<F>) => (
      dispatch(
        actionChangeFormState<F, Store>(
          formDataKey,
          partialFormState,
        ),
      )
    ),
    [],
  );
};

/**
 * получение meta формы
 */
const useFormDataMeta = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const meta = etsUseSelector((state) => getFormDataMetaByKey<F, Store>(state, formDataKey));

  return meta;
};

/**
 * получение функции сабмита формы
 */
const useFormDataHandleSubmitPromise = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const handleSubmitPromise = etsUseSelector((state) => getFormDataHandleSubmitPromiseByKey<F, Store>(state, formDataKey));
  const formState = useFormDataFormState<F, Store>(formDataKey);

  const meta = useFormDataMeta<F, Store>(formDataKey);
  const dispatch = etsUseDispatch();

  return React.useCallback(
    () => {
      return dispatch(
        defaultAction(
          handleSubmitPromise(formState),
          meta,
        ),
      );
    },
    [
      formState,
      meta,
    ],
  );
};

/**
 * получение функции измнения значение стора формы
 */
const useFormDataHandleChangeStore = <Store extends object = {}>(formDataKey: string) => {
  const dispatch = etsUseDispatch();

  return React.useCallback(
    (partialStore: Partial<Store>) => (
      dispatch(
        actionChangeFormStore<object, Store>(
          formDataKey,
          partialStore,
        ),
      )
    ),
    [],
  );
};

/**
 * получение состояния зачений формы (formState)
 */
const useFormDataFormState = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formState = etsUseSelector((state) => getFormDataFormStateByKey<F, Store>(state, formDataKey));

  return formState;
};

/**
 * получение состояния значения формы (formState) по ключу (key)
 */
const useFormDataFormStatePickValue = <F extends object, ReturnType>(formDataKey: string, key: keyof F) => {
  const pickValue: ReturnType = etsUseSelector((state) => getFormDataFormStatePickValueByKey<any, any>(state, formDataKey, key));

  return pickValue;
};

/**
 * получение состояния ошибок (formErrors)
 */
const useFormDataFormErrors = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formErrors = etsUseSelector((state) => getFormDataFormErrorsByKey<F, Store>(state, formDataKey));

  return formErrors;
};

/**
 * получение статуса возможности сабмита формы
 */
const useFormDataCanSave = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const canSave = etsUseSelector((state) => getFormDataCanSaveByKey<F, Store>(state, formDataKey));

  return canSave;
};

/**
 * получение статуса возможности изменения формы
 */
const useFormDataIsPermitted = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const isPermitted = etsUseSelector((state) => getFormDataIsPermittedByKey<F, Store>(state, formDataKey));

  return isPermitted;
};

/**
 * получение глобального стора формы
 */
const useFormDataStore = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const store = etsUseSelector((state) => getFormDataStoreByKey<F, Store>(state, formDataKey));

  return store;
};

/**
 * получение значения из глобального стора формы
 */
const useFormDataStorePickValue = <F extends object, Store extends object = {}>(formDataKey: string, key: string) => {
  const storePickValue = etsUseSelector((state) => getFormDataStoreByKey<F, Store>(state, formDataKey)[key]);

  return storePickValue;
};

const useFormDataLoadOptions = <Store extends object, K extends keyof Store>(formDataKey: string, key: K, hookData: Store[K]) => {
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
  useFormDataSchema,
  useFormDataSchemaHeader,
  useFormDataSchemaBody,
  useFormDataSchemaFooter,
  useFormDataSchemaIsCreating,
  useFormDataSchemaHandleHide,
  useFormDataHandleChangeStore,
  useFormDataMeta,
  useFormDataSchemaBodyFields,
  useFormDataFormState,
  useFormDataFormStatePickValue,
  useFormDataFormErrors,
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
  useFormDataBsSizeForm,
};
